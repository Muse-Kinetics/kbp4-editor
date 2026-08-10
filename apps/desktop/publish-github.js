#!/usr/bin/env node
// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
//
// Publish already-built, TESTED release artifacts to a GitHub Release.
//
// This intentionally uploads the artifacts produced by the local test build
// (package-win / package-mac-dist) rather than letting electron-builder publish
// at build time. On macOS the DMG is signed, notarized and stapled *after*
// electron-builder runs (see release-mac.js), so only the finished artifacts in
// release/ are the ones you actually tested — this uploads exactly those.
//
// Workflow:
//   1. Build + test locally:   npm run package-mac-dist   (or package-win on Windows)
//   2. Install/run the .dmg / .exe and confirm it works.
//   3. Publish the tested files: npm run publish-github-mac   (or -win)
//
// Requires the `gh` CLI, authenticated with write access to the target repo.

require("dotenv").config({ quiet: true });

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const packageJson = require("./package.json");

const argv = process.argv.slice(2);
const flags = new Set(argv);

if (flags.has("--help")) {
    console.log(`Usage: node publish-github.js --platform <mac|win> [--draft] [--tag <tag>] [--notes-file <path>]

Uploads the tested artifacts from the release/ directory to a GitHub Release.
  --platform     mac | win (required)
  --draft        create the release as a draft (not visible until you publish it)
  --tag          release tag (default: v<version> from package.json)
  --notes-file   markdown file to use as the release notes (default: --generate-notes)`);
    process.exit(0);
}

function argValue(name) {
    const i = argv.indexOf(name);
    return i >= 0 ? argv[i + 1] : null;
}

const platform = argValue("--platform");
if (!["mac", "win"].includes(platform)) {
    console.error("A supported --platform value is required: mac or win.");
    process.exit(1);
}

const version = packageJson.version;
const productName = packageJson.build?.productName || packageJson.productName || "App";
const releaseDir = path.resolve(packageJson.build?.directories?.output || "release");
const tag = argValue("--tag") || `v${version}`;
const draft = flags.has("--draft");
const notesFile = argValue("--notes-file");

function resolveRepo() {
    const publish = packageJson.build?.publish;
    const entries = Array.isArray(publish) ? publish : publish ? [publish] : [];
    const github = entries.find((entry) => entry && entry.provider === "github");
    if (!github || !github.owner || !github.repo) {
        throw new Error("build.publish is not configured with a github provider (owner/repo).");
    }
    return `${github.owner}/${github.repo}`;
}

const macArtifacts = [
    `${productName}-${version}-universal.dmg`,
    `${productName}-${version}-universal.dmg.blockmap`,
    "latest-mac.yml",
];
const winArtifacts = [
    `${productName} Setup ${version}.exe`,
    `${productName} Setup ${version}.exe.blockmap`,
    "latest.yml",
];

const artifactNames = platform === "mac" ? macArtifacts : winArtifacts;
const artifactPaths = artifactNames.map((name) => path.join(releaseDir, name));
const missing = artifactPaths.filter((p) => !fs.existsSync(p));

if (missing.length > 0) {
    console.error(
        `Missing ${platform} release artifacts (build and test them first):\n${missing.join("\n")}`,
    );
    process.exit(1);
}

function gh(args, options = {}) {
    console.log(`>> gh ${args.join(" ")}`);
    return execFileSync("gh", args, { stdio: "inherit", ...options });
}

const repo = resolveRepo();

let releaseExists = true;
try {
    execFileSync("gh", ["release", "view", tag, "-R", repo], { stdio: "ignore" });
} catch (error) {
    releaseExists = false;
}

if (!releaseExists) {
    const createArgs = ["release", "create", tag, "-R", repo, "--title", `${productName} ${version}`];
    if (draft) {
        createArgs.push("--draft");
    }
    if (notesFile) {
        createArgs.push("--notes-file", notesFile);
    } else {
        createArgs.push("--generate-notes");
    }
    gh(createArgs);
} else {
    console.log(`>> release ${tag} already exists on ${repo}; uploading/replacing ${platform} assets`);
}

// GitHub replaces spaces in uploaded asset filenames with dots (e.g. "K-Board
// Pro 4 Editor-…dmg" -> "K-Board.Pro.4.Editor-…dmg"). electron-builder's
// latest-mac.yml references the DMG by its build-time name, so electron-updater
// would construct a 404 download URL. Rewrite the yml's dmg url/path to the
// dot-form GitHub actually serves before uploading. (mac only.)
function normalizeMacYmlForGithub() {
    const ymlPath = path.join(releaseDir, "latest-mac.yml");
    if (!fs.existsSync(ymlPath)) return;
    const githubDmg = `${productName.replace(/ /g, ".")}-${version}-universal.dmg`;
    const yml = fs.readFileSync(ymlPath, "utf8");
    const patched = yml.replace(
        /((?:url|path):\s*)\S*-universal\.dmg/g,
        (match, prefix) => `${prefix}${githubDmg}`,
    );
    if (patched !== yml) {
        fs.writeFileSync(ymlPath, patched);
        console.log(`>> normalized latest-mac.yml dmg url -> ${githubDmg} (GitHub dot-form)`);
    }
}

if (platform === "mac") {
    normalizeMacYmlForGithub();
}

// --clobber so re-running for the same platform replaces assets instead of failing.
gh(["release", "upload", tag, ...artifactPaths, "-R", repo, "--clobber"]);

console.log(
    `\nPublished ${platform} artifacts to ${repo} release ${tag}${draft ? " (draft)" : ""}:`,
);
artifactNames.forEach((name) => console.log(`  ${name}`));
