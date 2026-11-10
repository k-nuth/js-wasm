// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { webcrypto } = require('node:crypto');

// Run the Worker module's real WASM without HTTP or a DOM dependency. Browser
// networking and IndexedDB persistence are exercised by browser applications.
module.exports = async function checkBrowser(root) {
    const context = vm.createContext({
        console, setTimeout, clearTimeout, setInterval, clearInterval,
        performance, TextEncoder, TextDecoder, URL, Blob, crypto: webcrypto,
        location: { href: 'https://localhost/worker.js' },
        importScripts() { throw new Error('Unexpected script dependency'); }
    });
    context.self = context;
    vm.runInContext(fs.readFileSync(path.join(root, 'src/browser_headers_persistent_v1.js'), 'utf8'), context,
        { filename: 'browser_headers_persistent_v1.js' });
    const core = await context.createHeaders({
        instantiateWasm(imports, receive) {
            const bytes = fs.readFileSync(path.join(root, 'src/browser_headers_persistent_v1.wasm'));
            const instance = new WebAssembly.Instance(new WebAssembly.Module(bytes), imports);
            receive(instance);
            return instance.exports;
        },
        print() {}, printErr() {}
    });
    assert.equal(core.getLibconfig().version, '1.6.1');
    assert(core.getLibconfig().wasm_build_timestamp > 0);
    assert.equal(typeof core.FS.mount, 'function');
    assert.equal(typeof core.IDBFS.mount, 'function');
    const client = new core.HeaderSync('wss://tempnet.kth.cash/p2p', 'tempnet', 100);
    try {
        assert.equal(client.configureLegacyDiscovery(false), true);
        assert.equal(client.configureDiscovery(true, false, true), true);
        const settings = JSON.parse(client.runtimeSettings());
        assert.equal(settings.network.user_agent, '/Knuth:1.6.1(browser)/');
        assert.equal(settings.header_sync.discovery_legacy_agent, false);
        assert.equal(client.reset(), 0);
    } finally { client.dispose(); }
    client.dispose();
    assert.throws(() => client.lastHeight(), /disposed/);
    console.log('Worker module, Core version, filesystem and lifecycle verified');
};
