// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

// Ports the src/domain/test/machine/interpreter*.cpp cases that the Interpreter / Debugger / Program wrappers express.
// The Debugger maps onto the upstream snapshot operations as follows: stepNumber = snapshot.step, !stepsAvailable =
// snapshot.done, stepForward() returns snapshot.last, programHistory = the trace, end() = debug_finalize. step_n, run,
// run_traced and step_until are repeated stepForward() calls with the same observable results.
//
// Cases that assert the failing opcode (op_result.op / snapshot.last.op), the C++ op_result struct itself, snapshot
// immutability or the snapshot's loop stack are blocked in the inventory: the C API returns a bare error code
// (kth_vm_interpreter_run in c-api/include/kth/capi/vm/interpreter.h) and the snapshot natives are not exported.
import { Debugger, Interpreter, Operation, Program, Script, Transaction } from '../..';
import { flag } from './support/flags';
import { loadFixture } from './support/fixtures';
import { describeSource, sourceCase } from './support/sourceCase';

const FILE = 'src/domain/test/machine/interpreter.cpp';
const errors = loadFixture<Record<string, number>>('error_codes.json');

const op = (name: string) => new Operation(name as any);
const push = (...bytes: Array<number>) => new Operation(Uint8Array.from(bytes));
const emptyTx = () => new Transaction(0, 0, [], []);
const scriptOfOps = (ops: Array<Operation>) => ops.length === 0 ? new Script(new Uint8Array(0), false) : Script.fromOperations(ops)!;
const programOf = (ops: Array<Operation>, flags: bigint = 0n) => new Program(scriptOfOps(ops), emptyTx(), 0, flags, 0n);
const zeros = (n: number) => Array.from({ length: n }, () => op('push_size_0'));

function withDebugger(ops: Array<Operation>, body: (debug: Debugger) => void, flags: bigint = 0n): void {
    const program = programOf(ops, flags);
    const debug = Interpreter.debug(program) as Debugger;
    try {
        expect(debug).toBeInstanceOf(Debugger);
        body(debug);
    } finally {
        debug.dispose();
        program.dispose();
    }
}

// debug_run: step until the snapshot is done; returns the last step's error code.
function runToEnd(debug: Debugger): number {
    let last = 0;
    while (debug.stepsAvailable) {
        last = debug.stepForward();
    }
    return last;
}

function runProgram(ops: Array<Operation>, flags: bigint = 0n): number {
    const program = programOf(ops, flags);
    try {
        return Interpreter.run(program);
    } finally {
        program.dispose();
    }
}

describeSource(FILE, () => {
    sourceCase('debug_step advances through the script', () => {
        withDebugger(zeros(2), debug => {
            expect(debug.stepsAvailable).toBe(true);
            expect(debug.stepNumber).toBe(0);
            expect(debug.stepForward()).toBe(0);
            expect(debug.stepNumber).toBe(1);
            expect(debug.stepsAvailable).toBe(true);
            expect(debug.stepForward()).toBe(0);
            expect(debug.stepNumber).toBe(2);
            expect(debug.stepsAvailable).toBe(false);
        });
    });

    sourceCase('debug_step on a done snapshot is a no-op', () => {
        withDebugger(zeros(1), debug => {
            debug.stepForward();
            expect(debug.stepsAvailable).toBe(false);
            const before = debug.stepNumber;
            debug.stepForward();
            expect(debug.stepsAvailable).toBe(false);
            expect(debug.stepNumber).toBe(before);
        });
    });

    sourceCase('debug_step_n advances by N (or stops at done)', () => {
        withDebugger(zeros(3), debug => {
            for (let i = 0; i < 2 && debug.stepsAvailable; ++i) {
                debug.stepForward();
            }
            expect(debug.stepNumber).toBe(2);
            expect(debug.stepsAvailable).toBe(true);
            for (let i = 0; i < 10 && debug.stepsAvailable; ++i) {
                debug.stepForward();
            }
            expect(debug.stepsAvailable).toBe(false);
        });
    });

    sourceCase('debug_run consumes the whole script', () => {
        withDebugger(zeros(2), debug => {
            expect(runToEnd(debug)).toBe(0);
            expect(debug.stepsAvailable).toBe(false);
        });
    });

    sourceCase('debug_run_traced yields one snapshot per step', () => {
        withDebugger(zeros(2), debug => {
            const doneStates = [!debug.stepsAvailable];
            while (debug.stepsAvailable) {
                debug.stepForward();
                doneStates.push(!debug.stepsAvailable);
            }
            expect(Array.from(debug.programHistory.keys()).sort()).toEqual([0, 1, 2]);
            expect(doneStates[0]).toBe(false);
            expect(doneStates[doneStates.length - 1]).toBe(true);
        });
    });

    sourceCase('debug_step_until stops when the predicate fires', () => {
        withDebugger(zeros(3), debug => {
            while (debug.stepNumber !== 2 && debug.stepsAvailable) {
                debug.stepForward();
            }
            expect(debug.stepNumber).toBe(2);
            expect(debug.stepsAvailable).toBe(true);
        });
    });

    sourceCase('run on a well-formed script returns success', () => {
        expect(runProgram([op('push_positive_1')])).toBe(errors.success);
    });

    sourceCase('run bridges to code for legacy callers via direct-init', () => {
        expect(runProgram([op('push_positive_1')])).toBe(errors.success);
    });

    sourceCase('run(op, program) executes a single opcode', () => {
        const program = new Program();
        try {
            expect(Interpreter.runOperation(op('push_positive_1'), program)).toBe(errors.success);
            expect(program.size).toBe(1);
        } finally {
            program.dispose();
        }
    });

    sourceCase('OP_CODESEPARATOR succeeds through run() and debug_run() alike', () => {
        const ops = [op('push_positive_1'), op('codeseparator')];
        expect(runProgram(ops)).toBe(errors.success);
        withDebugger(ops, debug => {
            expect(runToEnd(debug)).toBe(0);
            expect(debug.stepsAvailable).toBe(false);
        });
    });

    sourceCase('OP_CODESEPARATOR inside OP_INVOKE anchors per-frame PC', () => {
        const body = push(0xab, 0xc1); // codeseparator, active_bytecode
        const ops = [body, op('push_size_0'), op('op_define'), op('push_size_0'), op('op_invoke')];
        const program = programOf(ops, flag('bch_subroutines') | flag('bch_native_introspection'));
        try {
            expect(Interpreter.run(program)).toBe(errors.success);
            expect(Array.from(program.toNative().top())).toEqual([0xc1]);
        } finally {
            program.dispose();
        }
    });

    sourceCase('debug_step_until honours a predicate true at entry', () => {
        withDebugger([op('push_positive_1'), op('push_positive_1')], debug => {
            expect(debug.stepNumber).toBe(0);
            while (debug.stepNumber !== 0 && debug.stepsAvailable) {
                debug.stepForward();
            }
            expect(debug.stepNumber).toBe(0);
            expect(debug.stepsAvailable).toBe(true);
        });
    });

    sourceCase('debug_finalize on a closed snapshot returns success', () => {
        withDebugger([op('push_positive_1')], debug => {
            runToEnd(debug);
            expect(debug.end()).toBe(errors.success);
        });
    });

    sourceCase('debug_finalize propagates an earlier error', () => {
        withDebugger([op('verify')], debug => {
            runToEnd(debug);
            expect(debug.end()).not.toBe(errors.success);
        });
    });

    sourceCase('debug_finalize refuses unfinished snapshots', () => {
        withDebugger(zeros(2), debug => {
            debug.stepForward();
            expect(debug.stepsAvailable).toBe(true);
            expect(debug.end()).not.toBe(errors.success);
        });
    });

    sourceCase('debug_begin on an empty script marks the snapshot done', () => {
        withDebugger([], debug => {
            expect(debug.stepsAvailable).toBe(false);
            expect(debug.end()).toBe(errors.success);
        });
    });

    sourceCase('debug_step on OP_INVOKE without bch_subroutines flag errors with op_reserved', () => {
        withDebugger([op('op_invoke')], debug => {
            expect(debug.stepForward()).toBe(errors.op_reserved);
        });
    });
});

describeSource('src/domain/test/machine/interpreter_function_table_stack_budget.cpp', () => {
    // 999 OP_DEFINEs of empty bodies fill the function table to one below MAX_STACK_SIZE.
    const FLAGS = flag('bch_vm_limits') | flag('bch_subroutines');
    const defines = () => {
        const ops: Array<Operation> = [];
        for (let i = 0; i < 999; ++i) {
            ops.push(new Operation(new Uint8Array(0)), push(i & 0xff, (i >> 8) & 0xff), op('op_define'));
        }
        return ops;
    };

    sourceCase('function table + 1 push stays within MAX_STACK_SIZE', () => {
        expect(runProgram([...defines(), op('push_positive_1')], FLAGS)).toBe(errors.success);
    });

    sourceCase('function table counts against MAX_STACK_SIZE (matches BCHN)', () => {
        expect(runProgram([...defines(), op('push_positive_1'), op('push_positive_1')], FLAGS)).toBe(errors.invalid_stack_size);
    });
});

describeSource('src/domain/test/machine/interpreter_nested_invoke.cpp', () => {
    sourceCase('nested OP_INVOKE: OP_ACTIVEBYTECODE after inner return reads caller\'s body', () => {
        const ACTIVE_BYTECODE = 0xc1;
        const OP_0 = 0x00;
        const OP_INVOKE = 0x8a;
        const fn0 = push(ACTIVE_BYTECODE);
        const fn1 = push(OP_0, OP_INVOKE, ACTIVE_BYTECODE);
        const ops = [fn0, op('push_size_0'), op('op_define'), fn1, op('push_positive_1'), op('op_define'),
            op('push_positive_1'), op('op_invoke'), fn1, op('equalverify'), fn0, op('equal')];
        const program = programOf(ops, flag('bch_subroutines') | flag('bch_native_introspection'));
        try {
            expect(Interpreter.run(program)).toBe(errors.success);
            expect(program.stackResult(false)).toBe(true);
        } finally {
            program.dispose();
        }
    });
});
