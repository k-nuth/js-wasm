// Copyright (c) 2016-2025 Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { Script, RuleFork, Program, Interpreter, Debugger } from '..';
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

describe('Interpreter', () => {

    it('Should ', () => {
        const scriptStr = "[68656c6c6f]";
        const script = Script.fromString(scriptStr);
        expect(script).toBeDefined();
        if ( ! script) {
            return;
        }

        const program = new Program(script);
        expect(program.valid).toBe(true);

        // program.evaluate() is equivalent to Interpreter.run(program)
        expect(Interpreter.run(program)).toBe(0);
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
        expect(Interpreter.run(program)).toBe(0);
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
        expect(Interpreter.run(program)).toBe(0);
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
    //     expect(Interpreter.run(program)).toBe(0);
    //     expect(program.size).toBe(1);
    //     expect(bytesToHexStr(program.item(0))).toEqual('b6a9c8c230722b7c748331a8b450f05566dc7d0f');
    // });

    it('Should ', () => {
        // bitAuthBasicExample
        const scriptStr =
            "[68656c6c6f] " + // 'hello'
            "[f09f8c8e] "   + // '🌎'
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
        expect(Interpreter.run(program)).toBe(0);
        expect(program.size).toBe(1);
        expect(bytesToHexStr(program.item(0))).toEqual('03');
    });

    describe('Debugger', () => {
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

            const deb = Interpreter.debug(program);

            expect(deb instanceof Debugger).toBe(true);
            if ( ! (deb instanceof Debugger)) {
                return;
            }

            // Before running the first step (first operation) - [68656c6c6f]
            let res = deb.stepForward();
            expect(res).toBe(0);
            expect(deb.lastProgram).toBeDefined();
            if ( ! deb.lastProgram) {
                return;
            }
            expect(deb.lastProgram.size).toBe(1);
            expect(bytesToHexStr(deb.lastProgram.item(0))).toEqual('68656c6c6f');

            // Before running the second step - [f09f8c8e]
            res = deb.stepForward();
            expect(res).toBe(0);
            expect(deb.lastProgram).toBeDefined();
            if ( ! deb.lastProgram) {
                return;
            }
            expect(deb.lastProgram.size).toBe(2);
            expect(bytesToHexStr(deb.lastProgram.item(0))).toEqual('f09f8c8e');
            expect(bytesToHexStr(deb.lastProgram.item(1))).toEqual('68656c6c6f');

            // Before running the third step - cat
            res = deb.stepForward();
            expect(res).toBe(0);
            expect(deb.lastProgram).toBeDefined();
            if ( ! deb.lastProgram) {
                return;
            }
            expect(deb.lastProgram.size).toBe(1);
            expect(bytesToHexStr(deb.lastProgram.item(0))).toEqual('68656c6c6ff09f8c8e');

            // Before running the fourth step - hash160
            res = deb.stepForward();
            expect(res).toBe(0);
            expect(deb.lastProgram).toBeDefined();
            if ( ! deb.lastProgram) {
                return;
            }
            expect(deb.lastProgram.size).toBe(1);
            expect(bytesToHexStr(deb.lastProgram.item(0))).toEqual('fec6d89ec9eb8665b1fd48c9e7ff2aa2aaf2a200');

            // Before running the fifth step - [fec6d89ec9eb8665b1fd48c9e7ff2aa2aaf2a200]
            res = deb.stepForward();
            expect(res).toBe(0);
            expect(deb.lastProgram).toBeDefined();
            if ( ! deb.lastProgram) {
                return;
            }
            expect(deb.lastProgram.size).toBe(2);
            expect(bytesToHexStr(deb.lastProgram.item(0))).toEqual('fec6d89ec9eb8665b1fd48c9e7ff2aa2aaf2a200');
            expect(bytesToHexStr(deb.lastProgram.item(1))).toEqual('fec6d89ec9eb8665b1fd48c9e7ff2aa2aaf2a200');

            // Before running the 6th step - equal
            res = deb.stepForward();
            expect(res).toBe(0);
            expect(deb.lastProgram).toBeDefined();
            if ( ! deb.lastProgram) {
                return;
            }
            expect(deb.lastProgram.size).toBe(1);
            expect(bytesToHexStr(deb.lastProgram.item(0))).toEqual('01');


            // Before running the 7th step - 2
            res = deb.stepForward();
            expect(res).toBe(0);
            expect(deb.lastProgram).toBeDefined();
            if ( ! deb.lastProgram) {
                return;
            }
            expect(deb.lastProgram.size).toBe(2);
            expect(bytesToHexStr(deb.lastProgram.item(0))).toEqual('02');
            expect(bytesToHexStr(deb.lastProgram.item(1))).toEqual('01');

            // Before running the 8th step - add
            res = deb.stepForward();
            expect(res).toBe(0);
            expect(deb.lastProgram).toBeDefined();
            if ( ! deb.lastProgram) {
                return;
            }
            expect(deb.lastProgram.size).toBe(1);
            expect(bytesToHexStr(deb.lastProgram.item(0))).toEqual('03');

        });
    });

});
