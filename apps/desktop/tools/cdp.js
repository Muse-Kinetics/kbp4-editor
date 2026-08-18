// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.

'use strict';

//
// cdp.js — minimal Chrome DevTools Protocol client for the desktop editor's
// renderer process, for use with `npm run start:debug` (which opens
// --remote-debugging-port). Dev-only tool, not packaged into any build.
//
// No dependencies: relies on Node's built-in fetch + WebSocket (Node 18.17+
// for fetch, Node 22+ for WebSocket without a flag).
//
// Usage (from apps/desktop):
//   npm run start:debug                              # in one terminal
//   node tools/cdp.js targets                         # list CDP targets
//   node tools/cdp.js eval "<js expr>"                 # evaluate JS in the renderer, print result
//   node tools/cdp.js watch <seconds>                  # just capture console output for N seconds
//   node tools/cdp.js eval-and-watch <seconds> "<js>"  # eval, then keep capturing console for N seconds
//   node tools/cdp.js eval-file <path>                 # evaluate a JS file's contents in the renderer
//   node tools/cdp.js eval-file-and-watch <seconds> <path>
//
// The renderer exposes window.store (Redux store) and window.KBoardPro4 (the
// device API instance) globally, so `eval` can both inspect and drive the
// editor — e.g. `node tools/cdp.js eval "window.store.getState().device"`.
//
// Env: CDP_PORT (default 9222, matches start:debug)

const PORT = process.env.CDP_PORT || 9222;

async function getPageTarget() {
  const res = await fetch(`http://127.0.0.1:${PORT}/json`);
  const targets = await res.json();
  const page = targets.find((t) => t.type === 'page' && !String(t.url).startsWith('devtools://'));
  if (!page) throw new Error('no page target found: ' + JSON.stringify(targets, null, 2));
  return { page, all: targets };
}

function connect(wsUrl) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    ws.addEventListener('open', () => resolve(ws));
    ws.addEventListener('error', (e) => reject(e));
  });
}

let msgId = 1;
function send(ws, method, params = {}) {
  return new Promise((resolve) => {
    const id = msgId++;
    const handler = (event) => {
      const data = JSON.parse(event.data);
      if (data.id === id) {
        ws.removeEventListener('message', handler);
        resolve(data.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

function fmtArg(a) {
  if (a.type === 'string') return a.value;
  if (a.type === 'undefined') return 'undefined';
  if (a.subtype === 'error') return a.description;
  if (a.type === 'object' && a.preview) {
    const props = (a.preview.properties || []).map((p) => `${p.name}: ${p.value}`).join(', ');
    return `${a.className || 'Object'}{${props}}`;
  }
  if ('value' in a) return JSON.stringify(a.value);
  return a.description || a.type;
}

function ts() {
  return new Date().toISOString().split('T')[1].replace('Z', '');
}

async function main() {
  const [, , cmd, ...rest] = process.argv;

  if (cmd === 'targets') {
    const { all } = await getPageTarget().catch(async () => ({ all: await (await fetch(`http://127.0.0.1:${PORT}/json`)).json() }));
    console.log(JSON.stringify(all, null, 2));
    return;
  }

  const { page } = await getPageTarget();
  const ws = await connect(page.webSocketDebuggerUrl);

  ws.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    if (data.method === 'Runtime.consoleAPICalled') {
      const { type, args } = data.params;
      console.log(`${ts()} [console.${type}] ${args.map(fmtArg).join(' ')}`);
    } else if (data.method === 'Runtime.exceptionThrown') {
      const d = data.params.exceptionDetails;
      console.log(`${ts()} [exception] ${d.text} ${d.exception ? fmtArg(d.exception) : ''}`);
    }
  });

  await send(ws, 'Runtime.enable');

  if (cmd === 'eval') {
    const expr = rest[0];
    const result = await send(ws, 'Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true, timeout: 15000 });
    console.log('EVAL RESULT:', JSON.stringify(result));
  } else if (cmd === 'watch') {
    const seconds = Number(rest[0] || 30);
    console.log(`${ts()} watching console for ${seconds}s...`);
    await new Promise((r) => setTimeout(r, seconds * 1000));
  } else if (cmd === 'eval-and-watch') {
    const seconds = Number(rest[0]);
    const expr = rest[1];
    const result = await send(ws, 'Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true, timeout: 15000 });
    console.log('EVAL RESULT:', JSON.stringify(result));
    console.log(`${ts()} watching console for ${seconds}s...`);
    await new Promise((r) => setTimeout(r, seconds * 1000));
  } else if (cmd === 'eval-file') {
    const fs = require('fs');
    const filePath = rest[0];
    const expr = fs.readFileSync(filePath, 'utf8');
    const result = await send(ws, 'Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true, timeout: 15000 });
    console.log('EVAL RESULT:', JSON.stringify(result, null, 2));
  } else if (cmd === 'eval-file-and-watch') {
    const fs = require('fs');
    const seconds = Number(rest[0]);
    const filePath = rest[1];
    const expr = fs.readFileSync(filePath, 'utf8');
    const result = await send(ws, 'Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true, timeout: 15000 });
    console.log('EVAL RESULT:', JSON.stringify(result, null, 2));
    console.log(`${ts()} watching console for ${seconds}s...`);
    await new Promise((r) => setTimeout(r, seconds * 1000));
  } else {
    console.log('Usage: node tools/cdp.js <targets|eval|watch|eval-and-watch|eval-file|eval-file-and-watch> [args...]');
    console.log('See header comment in this file for details.');
  }

  ws.close();
  process.exit(0);
}

main().catch((e) => {
  console.error('cdp.js error:', e);
  process.exit(1);
});
