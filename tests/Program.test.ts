// Copyright (c) 2016-2025 Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { Script, Opcode, RuleFork, Transaction, OutputPoint, Input, Output, Program } from '..';
import { bytesToHexStr, hexStrToBytes } from '..';

const noRules = RuleFork.toInt('no_rules');
const allRules = RuleFork.toInt('all_rules');
const bip16Rule = RuleFork.toInt('bip16_rule');
const bip30Rule = RuleFork.toInt('bip30_rule');
const bip34Rule = RuleFork.toInt('bip34_rule');
const bip65Rule = RuleFork.toInt('bip65_rule');
const bip66Rule = RuleFork.toInt('bip66_rule');
const bip112Rule = RuleFork.toInt('bip112_rule');


function createScript(hex: string): Script | undefined {
    const bytes = hexStrToBytes(hex);
    return Script.fromData(bytes, true);
}

describe('Program', () => {

    it('Should ', () => {
        const scriptStr = "[68656c6c6f]";
        const script = Script.fromString(scriptStr);
        expect(script).toBeDefined();
        if ( ! script) {
            return;
        }

        const program = new Program(script);
        expect(program.valid).toBe(true);
        expect(program.evaluate()).toBe(0);
        expect(program.size).toBe(1);
        expect(bytesToHexStr(program.item(0))).toEqual('68656c6c6f');
    });

    it('Should ', () => {
        const scriptStr = "16909060";       // 0x01020304
        const script = Script.fromString(scriptStr);
        expect(script).toBeDefined();
        if ( ! script) {
            return;
        }

        const program = new Program(script);
        expect(program.valid).toBe(true);
        expect(program.evaluate()).toBe(0);
        expect(program.size).toBe(1);
        expect(bytesToHexStr(program.item(0))).toEqual('04030201');
    });

    it('Should ', () => {
        const scriptStr = "[68656c6c6f] hash160";
        const script = Script.fromString(scriptStr);
        expect(script).toBeDefined();
        if ( ! script) {
            return;
        }

        const program = new Program(script);
        expect(program.valid).toBe(true);
        expect(program.evaluate()).toBe(0);
        expect(program.size).toBe(1);
        expect(bytesToHexStr(program.item(0))).toEqual('b6a9c8c230722b7c748331a8b450f05566dc7d0f');
    });

    // TODO: esto da error en runtime: wasm exception
    // it('Should ', () => {
    //     const scriptStr = "[68656c6c6f] hash161";
    //     const script = Script.fromString(scriptStr);
    //     expect(script).toBeDefined();
    //     if ( ! script) {
    //         return;
    //     }

    //     const program = new Program(script);
    //     expect(program.valid).toBe(true);
    //     expect(program.evaluate()).toBe(0);
    //     expect(program.size).toBe(1);
    //     expect(bytesToHexStr(program.item(0))).toEqual('b6a9c8c230722b7c748331a8b450f05566dc7d0f');
    // });

    it('Should ', () => {
        // bitAuthBasicExample
        const scriptStr =
            "[68656c6c6f] " + // <'hello'>
            "[f09f8c8e] "   + // <'🌎'>
            "cat " +
            "hash160 " +
            "[fec6d89ec9eb8665b1fd48c9e7ff2aa2aaf2a200] " +
            "equal " +
            "2 " +
            "add ";

        const script = Script.fromString(scriptStr);
        expect(script).toBeDefined();
        if ( ! script) {
            return;
        }

        const program = new Program(script);
        expect(program.valid).toBe(true);
        expect(program.evaluate()).toBe(0);
        expect(program.size).toBe(1);
        expect(bytesToHexStr(program.item(0))).toEqual('03');
    });


});
