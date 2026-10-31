// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

// Ports the src/c-api/test/vm/interpreter.cpp debug cases by their observable behaviour through the Debugger: step_n,
// run, run_traced and step_until are repeated stepForward() calls (the upstream definitions), stepNumber is
// snapshot.step, !stepsAvailable is snapshot.done, programHistory is the trace and end() is debug_finalize.
import { Debugger, Interpreter, Program, Script } from '../..';
import { describeSource, sourceCase } from './support/sourceCase';

function withTwoPushes(body: (debug: Debugger) => void): void {
    const program = new Program(Script.fromData(Uint8Array.of(0x51, 0x51), false)!);
    const debug = Interpreter.debug(program) as Debugger;
    try {
        body(debug);
    } finally {
        debug.dispose();
        program.dispose();
    }
}

describeSource('src/c-api/test/vm/interpreter.cpp', () => {
    sourceCase('C-API Interpreter - debug_step_n advances by N or stops at done', () => {
        withTwoPushes(debug => {
            for (let i = 0; i < 10 && debug.stepsAvailable; ++i) {
                debug.stepForward();
            }
            expect(debug.stepsAvailable).toBe(false);
        });
    });

    sourceCase('C-API Interpreter - debug_run + debug_finalize reach success', () => {
        withTwoPushes(debug => {
            while (debug.stepsAvailable) {
                debug.stepForward();
            }
            expect(debug.stepsAvailable).toBe(false);
            expect(debug.end()).toBe(0);
        });
    });

    sourceCase('C-API Interpreter - debug_run_traced records initial + per-step snapshots', () => {
        withTwoPushes(debug => {
            while (debug.stepsAvailable) {
                debug.stepForward();
            }
            expect(debug.programHistory.size).toBe(3);
        });
    });

    sourceCase('C-API Interpreter - debug_step_until stops when predicate fires', () => {
        withTwoPushes(debug => {
            while (debug.stepNumber !== 1 && debug.stepsAvailable) {
                debug.stepForward();
            }
            expect(debug.stepNumber).toBe(1);
            expect(debug.stepsAvailable).toBe(true);
        });
    });
});
