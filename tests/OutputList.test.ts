// Copyright (c) 2016-2025 Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { Output, OutputList, RuleFork, Script, bytesToHexStr, hexStrToBytes } from '..';

const noRules = RuleFork.toInt('no_rules');
const allRules = RuleFork.toInt('all_rules');
const bip16_rule = RuleFork.toInt('bip16_rule');
const bip30_rule = RuleFork.toInt('bip30_rule');
const bip34_rule = RuleFork.toInt('bip34_rule');
const bip65_rule = RuleFork.toInt('bip65_rule');
const bip66_rule = RuleFork.toInt('bip66_rule');
const bip112_rule = RuleFork.toInt('bip112_rule');

const validRawOutput = hexStrToBytes('20300500000000001976a914905f933de850988603aafeeb2fd7fce61e66fe5d88ac');

describe('OutputList', () => {

    it('Should ', () => {
        const outputs = [
            new Output(),
            new Output(),
            new Output()
        ];
        const native = OutputList.toNative(outputs);
        expect(native.count()).toBe(3);
    });

    it('Should ', () => {
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

    it('Should ', () => {

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
