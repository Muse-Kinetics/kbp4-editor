// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.

require("dotenv").config({ quiet: true });

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const yaml = require("js-yaml");
const { appBuilderPath } = require("app-builder-bin");
const packageJson = require("./package.json");

const args = new Set(process.argv.slice(2));

if (args.has("--help")) {
    console.log(`Usage: node release-mac.js [options]

Options:
  --skip-build      Reuse the existing universal .app bundle.
  --skip-package    Reuse the existing DMG artifact.
  --skip-notarize   Stop after signing and verification.
  --help            Show this help message.`);
    process.exit(0);
}

const skipBuild = args.has("--skip-build");
const skipPackage = args.has("--skip-package");
const skipNotarize = args.has("--skip-notarize");

const productName = packageJson.build?.productName || packageJson.productName || "App";
const version = packageJson.version;
const releaseDir = path.resolve(packageJson.build?.directories?.output || "release");
const appPath = path.resolve(releaseDir, "mac-universal", `${productName}.app`);
const entitlementsPath = path.resolve(
    packageJson.build?.mac?.entitlements || "resources/entitlements.mac.plist"
);
const signingIdentity =
    process.env.APPLE_SIGNING_IDENTITY || "Developer ID Application: Kesumo, LLC (J372N6RANB)";
const appleKeychainProfile = process.env.APPLE_KEYCHAIN_PROFILE;

function run(command, commandArgs, options = {}) {
    console.log(`>> ${command} ${commandArgs.join(" ")}`);
    execFileSync(command, commandArgs, {
        stdio: "inherit",
        ...options,
    });
}

function ensureExists(filePath, label) {
    if (!fs.existsSync(filePath)) {
        throw new Error(`${label} not found at ${filePath}`);
    }
}

function resolveDmgPath() {
    const preferredPath = path.resolve(releaseDir, `${productName}-${version}-universal.dmg`);
    if (fs.existsSync(preferredPath)) {
        return preferredPath;
    }

    const candidates = fs
        .readdirSync(releaseDir)
        .filter((fileName) => fileName.endsWith(".dmg"))
        .filter((fileName) => fileName.startsWith(`${productName}-${version}`))
        .sort();

    if (candidates.length === 0) {
        throw new Error(`No DMG artifact found in ${releaseDir}`);
    }

    return path.resolve(releaseDir, candidates[candidates.length - 1]);
}

function builderEnv() {
    return {
        ...process.env,
        CSC_IDENTITY_AUTO_DISCOVERY: "false",
    };
}

function runElectronBuilder(commandArgs) {
    run("npm", ["exec", "--", "electron-builder", ...commandArgs], {
        env: builderEnv(),
    });
}

function buildUniversalApp() {
    run("npm", ["run", "sync-renderer"]);
    runElectronBuilder(["build", "--mac", "--universal", "--dir", "--publish", "never", "-c.mac.identity=null"]);
    ensureExists(appPath, "Universal mac app");
}

// electron-builder only writes Contents/Resources/app-update.yml for darwin when
// the build targets include "dmg" or "zip" (PublishManager afterPack). This
// workflow packs with `--dir` (target "dir") and then wraps the DMG with
// `--prepackaged`, so neither pass emits it — electron-updater then fails
// "Check For Updates" with ENOENT: app-update.yml. Write it ourselves, from the
// generic publish entry, BEFORE signing so it lives inside the signed/notarized
// bundle. The generic feed (not the private GitHub repo) is the public updater
// channel; electron-updater can't fetch releases from a private repo.
function writeAppUpdateYml() {
    ensureExists(appPath, "Universal mac app");
    const publishEntries = [].concat(packageJson.build?.publish || []);
    const generic = publishEntries.find((entry) => entry && entry.provider === "generic");
    if (!generic || !generic.url) {
        throw new Error("No generic publish url in package.json build.publish — cannot write app-update.yml");
    }
    const feedUrl = generic.url.replace(/\$\{os\}/g, "mac");
    const config = {
        provider: "generic",
        url: feedUrl,
        updaterCacheDirName: "k-board-pro-4-editor-desktop-updater",
    };
    const resourcesDir = path.join(appPath, "Contents", "Resources");
    ensureExists(resourcesDir, "app Resources directory");
    const ymlPath = path.join(resourcesDir, "app-update.yml");
    fs.writeFileSync(ymlPath, yaml.dump(config, { lineWidth: 120 }));
    console.log(`>> wrote app-update.yml -> ${feedUrl}`);
}

function signApp() {
    ensureExists(appPath, "Universal mac app");
    ensureExists(entitlementsPath, "mac entitlements");
    run("npm", [
        "exec",
        "--",
        "electron-osx-sign",
        appPath,
        `--identity=${signingIdentity}`,
        `--entitlements=${entitlementsPath}`,
        `--entitlements-inherit=${entitlementsPath}`,
        "--hardened-runtime",
        "--timestamp=http://timestamp.apple.com/ts01",
        "--no-gatekeeper-assess",
    ]);
}

function verifyApp() {
    run("codesign", ["--verify", "--deep", "--strict", "--verbose=2", appPath]);
    run("spctl", ["-a", "-vvv", "-t", "exec", appPath]);
}

function packageDmg() {
    ensureExists(appPath, "Signed mac app");
    runElectronBuilder([
        "build",
        "--mac",
        "dmg",
        "--universal",
        "--prepackaged",
        appPath,
        "--publish",
        "never",
        "-c.mac.identity=null",
    ]);
}

function signDmg(dmgPath) {
    run("codesign", [
        "--force",
        "--timestamp",
        "--options",
        "runtime",
        "--sign",
        signingIdentity,
        dmgPath,
    ]);
}

function verifyDmg(dmgPath) {
    run("codesign", ["--verify", "--verbose=2", dmgPath]);
}

function notarizeAndStaple(dmgPath) {
    if (!appleKeychainProfile) {
        throw new Error(
            "APPLE_KEYCHAIN_PROFILE is not set. Configure a stored notarytool profile before notarizing."
        );
    }

    run("xcrun", ["notarytool", "submit", dmgPath, "--keychain-profile", appleKeychainProfile, "--wait"]);
    run("xcrun", ["stapler", "staple", dmgPath]);
    run("xcrun", ["stapler", "validate", dmgPath]);
}

// electron-builder generates latest-mac.yml and the .blockmap while building the
// dmg with identity=null, i.e. BEFORE this script signs and staples it. Signing
// and stapling change the dmg bytes (size and sha512), so the recorded channel
// metadata describes a file that no longer exists and electron-updater rejects
// the download with a sha512 mismatch. Regenerate both from the final dmg.
function regenerateChannelMetadata(dmgPath) {
    const blockmapPath = `${dmgPath}.blockmap`;
    const output = execFileSync(appBuilderPath, ["blockmap", "--input", dmgPath, "--output", blockmapPath]);
    const { size, sha512 } = JSON.parse(output.toString().trim());

    const channelPath = path.resolve(releaseDir, "latest-mac.yml");
    ensureExists(channelPath, "latest-mac.yml channel file");

    const channel = yaml.load(fs.readFileSync(channelPath, "utf8"));
    const dmgName = path.basename(dmgPath);

    if (Array.isArray(channel.files)) {
        channel.files = channel.files.map((file) =>
            file && file.url === dmgName ? { ...file, sha512, size } : file
        );
    }

    if (channel.path === dmgName) {
        channel.sha512 = sha512;
    }

    fs.writeFileSync(channelPath, yaml.dump(channel, { lineWidth: 120 }));
    console.log(`>> regenerated latest-mac.yml + blockmap for the signed/stapled dmg (size=${size})`);
}

(async () => {
    try {
        if (!skipBuild) {
            buildUniversalApp();
        } else {
            ensureExists(appPath, "Universal mac app");
        }

        writeAppUpdateYml();
        signApp();
        verifyApp();

        if (!skipPackage) {
            packageDmg();
        }

        if (skipPackage && skipNotarize) {
            return;
        }

        const dmgPath = resolveDmgPath();
        signDmg(dmgPath);
        verifyDmg(dmgPath);

        if (skipNotarize) {
            regenerateChannelMetadata(dmgPath);
            return;
        }

        notarizeAndStaple(dmgPath);
        verifyDmg(dmgPath);
        regenerateChannelMetadata(dmgPath);
    } catch (error) {
        console.error(`>> Mac release workflow failed: ${error.message}`);
        process.exit(1);
    }
})();
