// Copyright (c) 2016-2025 Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { Input, InputList, OutputPoint, RuleFork, Script } from '..';
import { bytesToHexStr, hexStrToBytes, encodeHash, decodeHash } from '..';
import { HashFunctions } from '..';

const noRules = RuleFork.noRules;
const allRules = RuleFork.allRules;
const bip16_rule = RuleFork.bip16Rule;
const bip30_rule = RuleFork.bip30Rule;
const bip34_rule = RuleFork.bip34Rule;
const bip65_rule = RuleFork.bip65Rule;
const bip66_rule = RuleFork.bip66Rule;
const bip112_rule = RuleFork.bip112Rule;

const validRawHex = '54b755c39207d443fd96a8d12c94446a1c6f66e39c95e894c23418d7501f681b010000006b48304502203267910f55f2297360198fff57a3631be850965344370f732950b47795737875022100f7da90b82d24e6e957264b17d3e5042bab8946ee5fc676d15d915da450151d36012103893d5a06201d5cf61400e96fa4a7514fc12ab45166ace618d68b8066c9c585f9ffffffff';
const validRawInput = hexStrToBytes(validRawHex);

describe('InputList', () => {

    it('Should convert an array of inputs to native and verify the count', () => {
        const inputs = [
            new Input(),
            new Input(),
            new Input()
        ];
        const native = InputList.toNative(inputs);
        expect(native.count()).toBe(3);
    });

    it('Should convert inputs to native and back, verifying properties', () => {
        const inputs = [
            new Input(
                new OutputPoint(decodeHash('0101010101010101010101010101010101010101010101010101010101010101'), 5434),
                Script.fromData(hexStrToBytes('ece424a6bb6ddf4db592c0faed60685047a361b1'), false),
                4568656
            ),
            new Input(
                new OutputPoint(decodeHash('0202020202020202020202020202020202020202020202020202020202020202'), 5435),
                Script.fromData(hexStrToBytes('ece424a6bb6ddf4db592c0faed60685047a361b2'), false),
                4568657
            ),
            new Input(
                new OutputPoint(decodeHash('0303030303030303030303030303030303030303030303030303030303030303'), 5436),
                Script.fromData(hexStrToBytes('ece424a6bb6ddf4db592c0faed60685047a361b3'), false),
                4568658
            )
        ];

        const native = InputList.toNative(inputs);
        expect(native.count()).toBe(3);

        const inputs2 = InputList.fromNative(native);
        expect(inputs2.length).toBe(3);
        expect(encodeHash(inputs2[0]?.previousOutput?.hash ?? HashFunctions.nullHash)).toEqual('0101010101010101010101010101010101010101010101010101010101010101');
        expect(inputs2[0]?.previousOutput?.index).toBe(5434);
        expect(encodeHash(inputs2[1]?.previousOutput?.hash ?? HashFunctions.nullHash)).toEqual('0202020202020202020202020202020202020202020202020202020202020202');
        expect(inputs2[1]?.previousOutput?.index).toBe(5435);
        expect(encodeHash(inputs2[2]?.previousOutput?.hash ?? HashFunctions.nullHash)).toEqual('0303030303030303030303030303030303030303030303030303030303030303');
        expect(inputs2[2]?.previousOutput?.index).toBe(5436);

        expect(bytesToHexStr(inputs2[0]?.script?.toData(false) ?? new Uint8Array(0))).toBe('ece424a6bb6ddf4db592c0faed60685047a361b1');
        expect(bytesToHexStr(inputs2[1]?.script?.toData(false) ?? new Uint8Array(0))).toBe('ece424a6bb6ddf4db592c0faed60685047a361b2');
        expect(bytesToHexStr(inputs2[2]?.script?.toData(false) ?? new Uint8Array(0))).toBe('ece424a6bb6ddf4db592c0faed60685047a361b3');

        expect(inputs2[0]?.seq).toBe(4568656);
        expect(inputs2[1]?.seq).toBe(4568657);
        expect(inputs2[2]?.seq).toBe(4568658);
    });

    it('Should handle raw input data correctly', () => {
        const inputs = [
            Input.fromData(validRawInput) ?? new Input(),
            Input.fromData(validRawInput) ?? new Input(),
            Input.fromData(validRawInput) ?? new Input()
        ];
        const native = InputList.toNative(inputs);
        expect(native.count()).toBe(3);

        const inputs2 = InputList.fromNative(native);
        expect(inputs2.length).toBe(3);

        expect(bytesToHexStr(inputs2[0]?.toData(true) ?? new Uint8Array)).toEqual(validRawHex);
        expect(bytesToHexStr(inputs2[1]?.toData(true) ?? new Uint8Array)).toEqual(validRawHex);
        expect(bytesToHexStr(inputs2[2]?.toData(true) ?? new Uint8Array)).toEqual(validRawHex);
    });
});
