// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

// Loader smoke test (Node). The package entry defers the WebAssembly load until loadLib(), which resolves the binary from
// Module.locateFile(). If the module cannot be instantiated in Node, jest.setup's loadLib() or the native-backed calls
// below fail, so this suite fails fast when the loader regresses across Emscripten versions.
//
// This covers the Node main-thread load path only. A browser smoke test (web main thread plus pthread worker) needs a
// browser harness and is not part of the Jest/Node run.
import { HashFunctions, Kth, Script, Transaction, bytesToHexStr, free, hexStrToBytes, loadLib, malloc } from '..';

const utf8 = (text: string) => new TextEncoder().encode(text);

describe('WASM load smoke test (node)', () => {
    // A hex round trip would not prove that WebAssembly loaded because it is plain JavaScript. These calls execute
    // inside the module and are compared with published vectors (FIPS 180-2 SHA-256, the RIPEMD-160 paper), so a module
    // that instantiates but computes wrongly is caught as well.
    test('native-backed hashes match the published vectors after loadLib()', () => {
        expect(bytesToHexStr(HashFunctions.sha256(utf8('abc')))).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
        expect(bytesToHexStr(HashFunctions.sha256(new Uint8Array(0)))).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
        expect(bytesToHexStr(HashFunctions.ripemd160(utf8('abc')))).toBe('8eb208f7e05d987a9b044a8e98c6b087f15a0bfc');
    });

    test('the library configuration reports the WebAssembly target', () => {
        const config = Kth.getLibconfig();
        expect(config.architecture).toBe('WASM');
        expect(config.endianness).toBe('Little-endian');
        expect(config.compilerName).toBe('Emscripten');
        expect(config.currency).toBe('bitcoin_cash');
        expect(config.cppapiVersion).toMatch(/^\d+\.\d+\.\d+/);
    });

    test('script and transaction natives execute', () => {
        const input = Script.fromString('2 3 add');
        const prevout = Script.fromString('5 equal');
        expect(input).toBeDefined();
        expect(prevout).toBeDefined();
        const tx = Transaction.fromData(hexStrToBytes('0100000001b3807042c92f449bbf79b33ca59d7dfec7f4cc71096704a9c526dddf496ee0970100000000ffffffff01905f0100000000001976a91418c0bd8d1818f1bf99cb1df2269c645318ef7b7388ac00000000'))!;
        expect(tx.serializedSize(true)).toBe(85);
        expect(Script.verify(tx, 0, 0n, input!, prevout!, 0n)).toBe(0);
        expect(Script.verify(tx, 0, 0n, input!, Script.fromString('6 equal')!, 0n)).not.toBe(0);
    });

    test('linear memory is reachable through the exported allocator', () => {
        const block = malloc(Uint8Array, 16);
        try {
            expect(block.buffer.byteLength).toBeGreaterThanOrEqual(65536);
            block.fill(0xab);
            expect(Array.from(block)).toEqual(new Array(16).fill(0xab));
        } finally {
            free(block);
        }
    });

    test('loadLib() is idempotent once loaded', async () => {
        const first = loadLib('src/kth.wasm', 'src/kth.js');
        const second = loadLib('src/kth.wasm', 'src/kth.js');
        expect(second).toBe(first);
        await first;
    });

    test('a separately evaluated copy of the package loads and runs from a cold start', async () => {
        let fresh: any;
        jest.isolateModules(() => {
            fresh = require('..');
        });
        await fresh.loadLib('src/kth.wasm', 'src/kth.js');
        expect(bytesToHexStr(fresh.HashFunctions.sha256(utf8('abc')))).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
    }, 60000);
});
