// Copyright (c) 2016-2025 Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { Script, Opcode, RuleFork, Transaction, OutputPoint, Input, Output, Program } from '..';
import { bytesToHexStr, hexStrToBytes } from '..';

const noRules = RuleFork.noRules;
const allRules = RuleFork.allRules;
const bip16_rule = RuleFork.bip16Rule;
const bip30_rule = RuleFork.bip30Rule;
const bip34_rule = RuleFork.bip34Rule;
const bip65_rule = RuleFork.bip65Rule;
const bip66_rule = RuleFork.bip66Rule;
const bip112_rule = RuleFork.bip112Rule;


function createScript(hex: string): Script | undefined {
    const bytes = hexStrToBytes(hex);
    return Script.fromData(bytes, true);
}

describe('Program', () => {

    it('Should create a program from a script string and verify its properties', () => {
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

    it('Should handle a script string with numeric data and verify the program', () => {
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

    it('Should evaluate a script with hash160 operation and verify the result', () => {
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
    // it('Should handle a script with hash161 operation and verify the result', () => {
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

    it('Should evaluate a complex script and verify the final result', () => {
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
