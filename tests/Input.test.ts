// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { Input, OutputPoint, RuleFork, Script } from '..';
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

describe('Input', () => {

    it('is incomplete by default', () => {
        const input = new Input();
        expect(input.hasComponents).toBe(false);
    });

    it('constructs a complete input with a valid previous output, script, and sequence', () => {
        const prevOut = new OutputPoint(HashFunctions.nullHash, 5434);
        const script = Script.fromData(hexStrToBytes("ece424a6bb6ddf4db592c0faed60685047a361b1"), false);
        const seq = 4568656;

        const input = new Input(prevOut, script, seq);
        expect(input.hasComponents).toBe(true);
        expect(input.previousOutput).toBe(prevOut);
        expect(input.previousOutput?.hash).toEqual(HashFunctions.nullHash);
        expect(input.previousOutput?.index).toBe(5434);
        expect(input.script).toBe(script);
        expect(bytesToHexStr(input.script?.toData(false) ?? new Uint8Array)).toEqual("ece424a6bb6ddf4db592c0faed60685047a361b1");
        expect(input.seq).toBe(seq);
    });

    it('constructs a complete input with a valid previous output, script, and sequence', () => {
        const input = Input.fromData(validRawInput);
        expect(input?.hasComponents).toBe(true);
        expect(encodeHash(input?.previousOutput?.hash ?? HashFunctions.nullHash)).toEqual('1b681f50d71834c294e8959ce3666f1c6a44942cd1a896fd43d40792c355b754');
        expect(input?.previousOutput?.index).toBe(1);
        expect(bytesToHexStr(input?.script?.toData(false) ?? new Uint8Array)).toEqual("48304502203267910f55f2297360198fff57a3631be850965344370f732950b47795737875022100f7da90b82d24e6e957264b17d3e5042bab8946ee5fc676d15d915da450151d36012103893d5a06201d5cf61400e96fa4a7514fc12ab45166ace618d68b8066c9c585f9");
        expect(input?.seq).toEqual(4294967295);
        expect(input?.serializedSize(true)).toBe(validRawInput.length);
        // expect(input?.toData(true)).toEqual(validRawInput);
        expect(bytesToHexStr(input?.toData(true) ?? new Uint8Array)).toEqual(validRawHex);
    });

    it('Should return undefined if the input data is insufficient', () => {
        const input = Input.fromData(new Uint8Array(2));
        expect(input).toBeUndefined();
    });
});
