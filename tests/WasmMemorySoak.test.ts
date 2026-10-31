// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

// Sustained-memory soak over public, native-backed operations.
//
// Metric. WebAssembly linear memory never shrinks, so the size of the ArrayBuffer behind the module heap is a monotonic
// high-water mark of what the native allocator ever needed. A leak of N bytes per call makes it grow without bound while a
// correct generated binding returns to a steady state once the allocator arena is warm. The heap buffer is reachable
// through the exported allocator: malloc(Uint8Array, n).buffer is the module heap.
//
// Method. Each workload runs one full warm-up window, which grows the arena and the JIT to what the workload needs, and the
// heap is sampled. An equal second window then must not raise the high-water mark by more than SLACK. One-time growth
// cannot be mistaken for a leak because the sampled window is the second one; a per-call leak of at least
// SLACK / WINDOW bytes (700 bytes) cannot hide.
//
// Sensitivity. The metric is only meaningful if it can fail, so a control leaks on purpose through the same exported
// allocator and the test requires the high-water mark to rise, then releases the blocks and requires that later work
// reuses them instead of growing again (release).
import {
    HashFunctions, Input, Output, OutputPoint, PaymentAddress, Script, TokenData, TokenDataFungible, Transaction, bytesToHexStr,
    free, hexStrToBytes, malloc
} from '..';

declare const require: (id: string) => any;

const WINDOW = 1500;
const SLACK = 1024 * 1024;

function collectGarbage() {
    const v8 = require('v8');
    const vm = require('vm');
    v8.setFlagsFromString('--expose_gc');
    const gc = vm.runInNewContext('gc') as () => void;
    gc();
    gc();
}

function heapBytes(): number {
    const probe = malloc(Uint8Array, 1);
    try {
        return probe.buffer.byteLength;
    } finally {
        free(probe);
    }
}

function arrayBufferBytes(): number {
    return require('process').memoryUsage().arrayBuffers;
}

function runWindow(work: (i: number) => void) {
    for (let i = 0; i < WINDOW; ++i) {
        work(i);
    }
}

function expectSteadyState(work: (i: number) => void) {
    runWindow(work);
    collectGarbage();
    const warmedHeap = heapBytes();
    const warmedBuffers = arrayBufferBytes();

    runWindow(work);
    collectGarbage();
    expect(heapBytes() - warmedHeap).toBeLessThanOrEqual(SLACK);
    expect(arrayBufferBytes() - warmedBuffers).toBeLessThanOrEqual(SLACK);
}

const scriptPubKey = '76a91406ccef231c2db72526df9338894ccf9355e8f12188ac';

// About 65 KB on the wire: forces large byte-array arguments and results through the generated glue.
function largeTransaction(): Transaction {
    const script = Script.fromData(hexStrToBytes(scriptPubKey), false)!;
    const outputs: Array<Output> = [];
    for (let i = 0; i < 1800; ++i) {
        outputs.push(new Output(BigInt(1000 + i), script));
    }
    const input = new Input(new OutputPoint(new Uint8Array(32).fill(7) as any, 3), script, 0xffffffff);
    return new Transaction(2, 0, [input], outputs);
}

describe('generated WASM glue memory soak', () => {
    test('large transactions encode and decode in a steady state', () => {
        const template = largeTransaction();
        const wire = template.toData(true);
        expect(wire.length).toBeGreaterThan(50_000);
        const expectedHash = bytesToHexStr(template.hash);

        expectSteadyState(() => {
            const decoded = Transaction.fromData(wire)!;
            expect(decoded.outputs).toHaveLength(1800);
            expect(bytesToHexStr(decoded.hash)).toBe(expectedHash);
            expect(decoded.toData(true).length).toBe(wire.length);
        });
    }, 600000);

    test('large scripts parse, serialize and verify in a steady state', () => {
        // Ten 500-byte pushes: below the 520-byte element limit, 5 KB of script in total.
        const body = Array(10).fill('[' + 'bb'.repeat(500) + '] drop').join(' ') + ' 1';
        const sigScript = Script.fromString('1')!;
        const tx = Transaction.fromData(hexStrToBytes('0100000001b3807042c92f449bbf79b33ca59d7dfec7f4cc71096704a9c526dddf496ee0970100000000ffffffff01905f0100000000001976a91418c0bd8d1818f1bf99cb1df2269c645318ef7b7388ac00000000'))!;

        expectSteadyState(() => {
            const prevout = Script.fromString(body)!;
            expect(prevout.toData(false).length).toBeGreaterThan(5000);
            expect(Script.verify(tx, 0, 0n, sigScript, prevout, 0n)).toBe(0);
        });
    }, 600000);

    test('hashing large buffers is released between calls', () => {
        const data = new Uint8Array(64 * 1024).fill(0x5a);
        const expected = bytesToHexStr(HashFunctions.sha256(data));
        expectSteadyState(() => {
            expect(bytesToHexStr(HashFunctions.sha256(data))).toBe(expected);
        });
    }, 600000);

    test('addresses encode and decode in a steady state', () => {
        const encoded = 'qrcuqadqrzp2uztjl9wn5sthepkg22majyxw4gmv6p';
        expectSteadyState(() => {
            const address = PaymentAddress.fromString(encoded)!;
            expect(address.encodedLegacy()).toBe('1P3GQYtcWgZHrrJhUa4ctoQ3QoCU2F65nz');
            expect(address.encodedCashAddr()).toBe('bitcoincash:' + encoded);
        });
    }, 600000);

    // Failure paths must clean up too: native objects created before the status was inspected, conversion errors thrown
    // after a native allocation, and inputs the library rejects.
    test('rejected inputs and failed conversions do not retain native memory', () => {
        const category = new Uint8Array(32).fill(9) as any;
        expectSteadyState(i => {
            expect(Transaction.fromData(new Uint8Array(1 + (i % 40)))).toBeUndefined();
            expect(Input.fromData(new Uint8Array(3))).toBeUndefined();
            expect(Output.fromData(new Uint8Array(5))).toBeUndefined();
            expect(Script.fromString('this is not a script')).toBeUndefined();
            expect(new TokenData(category, new TokenDataFungible(0n)).valid).toBe(false);
            expect(() => new TokenData(category, new TokenDataFungible(0n)).toNative()).toThrow();
            expect(new Input().hasComponents).toBe(false);
            expect(() => new Input().toNative()).toThrow();
        });
    }, 600000);

    test('the metric detects a deliberate leak and sees released blocks reused', () => {
        const baseline = heapBytes();
        const leaked: Array<Uint8Array> = [];
        let grown = baseline;
        for (let i = 0; i < 40_000 && grown - baseline <= SLACK; ++i) {
            leaked.push(malloc(Uint8Array, 4096));
            grown = heapBytes();
        }
        expect(grown - baseline).toBeGreaterThan(SLACK);

        for (const block of leaked) {
            free(block);
        }
        const released = heapBytes();
        const reuse: Array<Uint8Array> = [];
        for (let i = 0; i < leaked.length; ++i) {
            reuse.push(malloc(Uint8Array, 4096));
        }
        expect(heapBytes()).toBeLessThanOrEqual(released + SLACK);
        for (const block of reuse) {
            free(block);
        }
    }, 600000);
});
