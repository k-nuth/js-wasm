// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

// Ports the src/c-api/test/vm/interpreter.cpp cases that the Interpreter / Debugger wrappers express. The wrapper hides the
// snapshot (last(), done() before the first step), and has no step_n, run, run_traced or step_until, so those cases stay
// blocked in the inventory.
import { Debugger, Interpreter, Operation, Program, Script } from '../..';
import { loadFixture } from './support/fixtures';
import { describeSource, sourceCase } from './support/sourceCase';

const errorCodes = loadFixture<Record<string, number>>('error_codes.json');

describeSource('src/c-api/test/vm/interpreter.cpp', () => {
    sourceCase('C-API Interpreter - run_operation rejects OP_CODESEPARATOR standalone', () => {
        const program = new Program();
        try {
            expect(Interpreter.runOperation(new Operation('codeseparator'), program)).toBe(errorCodes.not_implemented);
        } finally {
            program.dispose();
        }
    });

    sourceCase('C-API Interpreter - debug_step advances one op at a time', () => {
        const script = Script.fromData(Uint8Array.of(0x51, 0x51), false)!;
        const program = new Program(script);
        const debug = Interpreter.debug(program) as Debugger;
        try {
            expect(debug).toBeInstanceOf(Debugger);
            expect(debug.stepNumber).toBe(0);
            expect(debug.stepsAvailable).toBe(true);

            expect(debug.stepForward()).toBe(0);
            expect(debug.stepNumber).toBe(1);
            expect(debug.stepsAvailable).toBe(true);

            expect(debug.stepForward()).toBe(0);
            expect(debug.stepNumber).toBe(2);
            expect(debug.stepsAvailable).toBe(false);
        } finally {
            debug.dispose();
            program.dispose();
        }
    });
});
