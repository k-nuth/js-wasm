// Copyright (c) 2016-2025 Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { Output, OutputList, RuleFork, Script } from '..';
import { bytesToHexStr, hexStrToBytes } from '..';

const noRules = RuleFork.noRules;
const allRules = RuleFork.allRules;
const bip16_rule = RuleFork.bip16Rule;
const bip30_rule = RuleFork.bip30Rule;
const bip34_rule = RuleFork.bip34Rule;
const bip65_rule = RuleFork.bip65Rule;
const bip66_rule = RuleFork.bip66Rule;
const bip112_rule = RuleFork.bip112Rule;

const validRawOutput = hexStrToBytes('20300500000000001976a914905f933de850988603aafeeb2fd7fce61e66fe5d88ac');

describe('OutputList', () => {

    it('Should convert an array of outputs to native and verify the count', () => {
        const outputs = [
            new Output(),
            new Output(),
            new Output()
        ];
        const native = OutputList.toNative(outputs);
        expect(native.count()).toBe(3);
    });

    it('Should convert outputs with script to native and back maintaining values and scripts', () => {
        const hexStr = 'ece424a6bb6ddf4db592c0faed60685047a361b1';
        const bytes = hexStrToBytes(hexStr);
        const script = Script.fromData(bytes, false);

        const outputs = [
            new Output(123n, script),
            new Output(456n, script),
            new Output(789n, script)
        ];
        const native = OutputList.toNative(outputs);
        expect(native.count()).toBe(3);
        expect(native.nth(0).value()).toBe(123n);
        expect(native.nth(1).value()).toBe(456n);
        expect(native.nth(2).value()).toBe(789n);

        const outputs2 = OutputList.fromNative(native);

        expect(outputs2.length).toBe(3);
        expect(outputs2[0].value).toBe(123n);
        expect(outputs2[1].value).toBe(456n);
        expect(outputs2[2].value).toBe(789n);

        expect(bytesToHexStr(outputs2[0]?.script?.toData(false) ?? new Uint8Array(0))).toBe(hexStr);
        expect(bytesToHexStr(outputs2[1]?.script?.toData(false) ?? new Uint8Array(0))).toBe(hexStr);
        expect(bytesToHexStr(outputs2[2]?.script?.toData(false) ?? new Uint8Array(0))).toBe(hexStr);

    });

    it('Should convert outputs from raw data to native and back preserving values and serialization', () => {

        const outputs = [
            Output.fromData(validRawOutput) ?? new Output(),
            Output.fromData(validRawOutput) ?? new Output(),
            Output.fromData(validRawOutput) ?? new Output()
        ];
        const native = OutputList.toNative(outputs);
        expect(native.count()).toBe(3);

        const outputs2 = OutputList.fromNative(native);
        expect(outputs2.length).toBe(3);
        expect(outputs2[0]?.value).toBe(0x53020n);
        expect(outputs2[1]?.value).toBe(0x53020n);
        expect(outputs2[2]?.value).toBe(0x53020n);

        expect(outputs2[0]?.toData(true)).toEqual(validRawOutput);
        expect(outputs2[1]?.toData(true)).toEqual(validRawOutput);
        expect(outputs2[2]?.toData(true)).toEqual(validRawOutput);
    });

});
