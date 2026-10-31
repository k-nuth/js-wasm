// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

// Ports the src/c-api/test/vm/debug_snapshot.cpp cases reachable through the public entry. The snapshot natives are not
// exported and the Debugger keeps its snapshot private, so a snapshot is only observable through Interpreter.debug():
// stepNumber is snapshot.step, !stepsAvailable is snapshot.done and lastProgram is snapshot.prog(). construct(program)
// is observed through debug_begin, which builds the snapshot the same way.
import { Debugger, Interpreter, Program, Script } from '../..';
import { describeSource, sourceCase } from './support/sourceCase';

describeSource('src/c-api/test/vm/debug_snapshot.cpp', () => {
    sourceCase('C-API DebugSnapshot - construct(program) seats the snapshot on the script', () => {
        const program = new Program(Script.fromData(Uint8Array.of(0x51, 0x51), false)!);
        const debug = Interpreter.debug(program) as Debugger;
        try {
            expect(debug.stepNumber).toBe(0);
            expect(debug.stepsAvailable).toBe(true);
            expect(debug.lastProgram).toBeDefined();
        } finally {
            debug.dispose();
            program.dispose();
        }
    });

    sourceCase('C-API DebugSnapshot - debug_step on a done snapshot is a no-op', () => {
        const program = new Program(Script.fromData(Uint8Array.of(0x51), false)!);
        const debug = Interpreter.debug(program) as Debugger;
        try {
            debug.stepForward();
            expect(debug.stepsAvailable).toBe(false);
            const before = debug.stepNumber;
            debug.stepForward();
            expect(debug.stepsAvailable).toBe(false);
            expect(debug.stepNumber).toBe(before);
        } finally {
            debug.dispose();
            program.dispose();
        }
    });
});
