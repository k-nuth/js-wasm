// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

// Generated idiomatic wrappers (OutputPoint, Output, Input and the array wrappers) exercised against the real library:
// construction, field mutation, arrays, nested conversion, absent values, status errors, release and failure safety.
import { HashFunctions, Input, InputList, Output, OutputList, OutputPoint, PaymentAddress, Script, free } from '../..';
import { hexStrToBytes } from '../..';
import type { Hash } from '../..';

const p2pkh = (): Script => Script.fromData(hexStrToBytes('76a91406ccef231c2db72526df9338894ccf9355e8f12188ac'), false) as Script;
const someHash = () => new Uint8Array(32).fill(7) as Hash;
const outputHex = '00e1f50500000000' + '19' + '76a91406ccef231c2db72526df9338894ccf9355e8f12188ac';

describe('OutputPoint (generated)', () => {
    it('keeps plain public fields that can be mutated and converted again', () => {
        const point = new OutputPoint(HashFunctions.nullHash, 3);
        point.index = 9;
        const native = point.toNative();
        try {
            expect(native.index()).toBe(9);
            expect(OutputPoint.fromNative(native).index).toBe(9);
        } finally {
            free(native);
        }
    });

    it('converts an unset point to the default native point and back to unset-compatible values', () => {
        const native = new OutputPoint().toNative();
        try {
            expect(native.index()).toBeDefined();
        } finally {
            free(native);
        }
    });

    it('is valid only with a hash other than the null hash', () => {
        expect(new OutputPoint(HashFunctions.nullHash, 1).valid).toBe(false);
        expect(OutputPoint.isValid(HashFunctions.nullHash, 1)).toBe(false);
        expect(new OutputPoint().valid).toBe(false);
    });

    it('round-trips hash and index, and is valid with a real hash', () => {
        const point = new OutputPoint(someHash(), 4);
        expect(point.valid).toBe(true);
        const again = OutputPoint.fromNative(point.toNative(), true);
        expect(again.index).toBe(4);
        expect(again.hash).toEqual(someHash());
    });
});

describe('Output (generated)', () => {
    it('decodes real data, reports bad data as undefined and re-encodes byte for byte', () => {
        const output = Output.fromData(hexStrToBytes(outputHex));
        expect(output?.value).toBe(100000000n);
        expect(output?.valid).toBe(true);
        expect(output?.toData(true)).toEqual(hexStrToBytes(outputHex));
        expect(output?.serializedSize(true)).toBe(hexStrToBytes(outputHex).length);
        expect(Output.fromData(new Uint8Array([1, 2]))).toBeUndefined();
    });

    it('rejects values outside the unsigned 64-bit range', () => {
        expect(() => new Output(-1n, p2pkh())).toThrow(/Invalid value/);
        expect(() => new Output(0x10000000000000000n, p2pkh())).toThrow(/Invalid value/);
        expect(new Output(0xffffffffffffffffn, p2pkh()).value).toBe(0xffffffffffffffffn);
    });

    it('treats absent token data as undefined in both directions', () => {
        const native = new Output(5n, p2pkh()).toNative();
        try {
            expect(native.tokenData()).toBeNull();
            expect(Output.fromNative(native).tokenData).toBeUndefined();
        } finally {
            free(native);
        }
    });

    it('mutating a field changes what is converted', () => {
        const output = new Output(5n, p2pkh());
        output.value = 7n;
        expect(Output.fromData(output.toData(true))?.value).toBe(7n);
        expect(Output.isValid(7n, p2pkh())).toBe(true);
    });
});

describe('Input (generated)', () => {
    it('nests an output point and a script and round-trips them', () => {
        const input = new Input(new OutputPoint(someHash(), 2), p2pkh(), 1234);
        input.seq = 99;
        const again = Input.fromData(input.toData(true));
        expect(again?.previousOutput?.index).toBe(2);
        expect(again?.seq).toBe(99);
        expect(again?.script?.serializedSize).toBe(25);
    });

    it('refuses to convert an incomplete input and says what is missing', () => {
        expect(() => new Input().toNative()).toThrow(/previousOutput, script and seq are required/);
        expect(Input.fromData(new Uint8Array([0]))).toBeUndefined();
    });
});

describe('array wrappers (generated)', () => {
    const input = (n: number) => new Input(new OutputPoint(someHash(), n), p2pkh(), n);

    it('turns arrays of wrappers into native lists and back', () => {
        const native = InputList.toNative([input(1), input(2), input(3)]);
        expect(native.count()).toBe(3);
        const items = InputList.fromNative(native, true);
        expect(items.map(i => i.previousOutput?.index)).toEqual([1, 2, 3]);
        expect(items[0]).toBeInstanceOf(Input);
    });

    it('handles empty arrays', () => {
        const native = OutputList.toNative([]);
        expect(native.count()).toBe(0);
        expect(OutputList.fromNative(native, true)).toEqual([]);
    });

    it('releases the native list only when destroy is requested', () => {
        const native = OutputList.toNative([new Output(1n, p2pkh())]);
        const destructor = jest.spyOn(native as any, '_destructor');
        OutputList.fromNative(native);
        expect(destructor).not.toHaveBeenCalled();
        OutputList.fromNative(native, true);
        expect(destructor).toHaveBeenCalledTimes(1);
    });

    it('releases the temporary native of an element converted before a later one fails', () => {
        const first = new Output(1n, p2pkh());
        let temporary: any;
        const realToNative = first.toNative.bind(first);
        first.toNative = () => {
            temporary = realToNative();
            jest.spyOn(temporary, '_destructor');
            return temporary;
        };
        const bad = Object.create(Output.prototype) as Output;
        bad.toNative = () => { throw new Error('second allocation failed'); };
        expect(() => OutputList.toNative([first, bad])).toThrow('second allocation failed');
        expect(temporary._destructor).toHaveBeenCalledTimes(1);
    });

    it('releases the first nested native when the second one cannot be built', () => {
        const point = new OutputPoint(someHash(), 1);
        let temporary: any;
        const realToNative = point.toNative.bind(point);
        point.toNative = () => {
            temporary = realToNative();
            jest.spyOn(temporary, '_destructor');
            return temporary;
        };
        const script = p2pkh();
        script.toNative = () => { throw new Error('script conversion failed'); };
        expect(() => new Input(point, script, 1).toNative()).toThrow('script conversion failed');
        expect(temporary._destructor).toHaveBeenCalledTimes(1);
    });
});


describe('object list adapter initialization', () => {
    it('extracts addresses through the circular PaymentAddress/list imports and keeps values after list destruction', () => {
        const addresses = PaymentAddress.extractOutput(p2pkh(), PaymentAddress.mainnetP2kh, PaymentAddress.mainnetP2sh);
        expect(addresses).toHaveLength(1);
        expect(addresses[0].hash).toEqual(hexStrToBytes('06ccef231c2db72526df9338894ccf9355e8f121'));
        expect(addresses[0].encodedCashAddr().length).toBeGreaterThan(0);
    });
});
