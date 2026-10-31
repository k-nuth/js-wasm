// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

'use strict';

const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

async function main() {
    const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'js-wasm-package-'));
    try {
        const [archive] = JSON.parse(execFileSync('npm', [
            'pack', '--ignore-scripts', '--json', '--pack-destination', temporary
        ], { encoding: 'utf8' }));
        assert.equal(archive.name, '@knuth/js-wasm');
        const names = new Set(archive.files.map(file => file.path));
        for (const required of ['package.json', 'LICENSE.md', 'README.md', 'src/kth.js', 'src/kth.wasm', 'types/wasm/bootloader.d.ts']) {
            assert(names.has(required), 'Missing package file: ' + required);
        }
        for (const name of names) {
            assert(
                ['package.json', 'LICENSE.md', 'README.md', 'src/kth.js', 'src/kth.wasm'].includes(name) ||
                /^types\/(?:[^/]+\/)*[^/]+\.d\.ts$/.test(name),
                'Unexpected package file: ' + name
            );
        }
        execFileSync('tar', ['-xzf', path.join(temporary, archive.filename), '-C', temporary]);
        const root = path.join(temporary, 'package');
        const api = require(root);
        await api.loadLib(path.join(root, 'src/kth.wasm'), path.join(root, 'src/kth.js'));
        assert.equal(api.Kth.getLibconfig().cppapiVersion, '1.5.2');
        assert.equal(api.Kth.getLibconfig().wasmLibraryVersion, archive.version);
        assert.equal(
            api.bytesToHexStr(api.HashFunctions.sha256(new TextEncoder().encode('abc'))),
            'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'
        );
        const consumer = path.join(temporary, 'consumer.ts');
        fs.writeFileSync(consumer,
            'import { Script, ScriptFlags, Wallet, Kth } from "./package";\n' +
            'const script = Script.fromString("2 3 add");\n' +
            'const text: string | undefined = script?.toString(ScriptFlags.noRules);\n' +
            'const version: string = Kth.getLibconfig().cppapiVersion;\n' +
            'const createWallet = (seed: ConstructorParameters<typeof Wallet>[0]) => new Wallet(seed, "m/0", "MAINNET");\n' +
            'void [text, version, createWallet];\n'
        );
        execFileSync(process.execPath, [
            require.resolve('typescript/bin/tsc'), '--strict', '--noEmit', '--target', 'ES2020',
            '--module', 'CommonJS', '--moduleResolution', 'node', '--lib', 'ES2020,DOM', consumer
        ], { stdio: 'inherit' });
        console.log('Package runtime, file list and consumer declarations verified: ' + archive.name + '@' + archive.version);
    } finally {
        fs.rmSync(temporary, { recursive: true, force: true });
    }
}

main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
