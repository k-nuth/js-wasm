// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { Output, RuleFork, Script } from '..';
import { hexStrToBytes } from '..';

const noRules = RuleFork.noRules;
const allRules = RuleFork.allRules;
const bip16_rule = RuleFork.bip16Rule;
const bip30_rule = RuleFork.bip30Rule;
const bip34_rule = RuleFork.bip34Rule;
const bip65_rule = RuleFork.bip65Rule;
const bip66_rule = RuleFork.bip66Rule;
const bip112_rule = RuleFork.bip112Rule;

const validRawOutput = hexStrToBytes('20300500000000001976a914905f933de850988603aafeeb2fd7fce61e66fe5d88ac');

describe('Output', () => {

    it('Should be invalid by default', () => {
        const output = new Output();
        expect(output.valid).toBe(false);
    });

    it('Should construct a valid output with a valid value and script', () => {
        const value = 643n;
        const bytes = hexStrToBytes('ece424a6bb6ddf4db592c0faed60685047a361b1');
        const script = Script.fromData(bytes, false);

        const output = new Output(value, script);
        expect(output.valid).toBe(true);
        expect(output.script).toBe(script);
        expect(output.value).toBe(value);
    });

    it('Should construct a valid output from bytes', () => {
        const output = Output.fromData(validRawOutput);
        expect(output).toBeDefined();
        expect(output?.valid).toBe(true);
        expect(output?.script).toBeDefined();
        expect(output?.value).toBe(0x53020n);
        //TODO: token data
        // REQUIRE( ! instance.token_data().has_value());
    });

    it('Should construct an invalid output from insufficient bytes', () => {
        const data = new Uint8Array(2);
        const output = Output.fromData(data);
        expect(output).toBeUndefined();
    });

    it('Should serialize and deserialize a valid output', () => {
        const output = Output.fromData(validRawOutput);
        expect(output).toBeDefined();
        expect(output?.valid).toBe(true);
        expect(output?.serializedSize(true)).toBe(validRawOutput.length);
        expect(output?.toData(true)).toEqual(validRawOutput);
    });

});
