// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

// Ports src/domain/test/machine/program.cpp and src/c-api/test/vm/program.cpp. The Program wrapper keeps the stack
// operations on the native program that its public toNative() returns, so they are exercised there.
import { Operation, Program, Script, Transaction, free } from '../..';
import { describeSource, sourceCase } from './support/sourceCase';

const emptyTx = () => new Transaction(0, 0, [], []);
const scriptOf = (...names: Array<string>) => Script.fromOperations(names.map(n => new Operation(n as any)))!;

describeSource('src/domain/test/machine/program.cpp', () => {
    sourceCase('default program has an empty script and zero flags', () => {
        const program = new Program();
        const native = program.toNative();
        try {
            expect(native.flags()).toBe(0n);
            expect(native.inputIndex()).toBe(0);
            expect(native.size()).toBe(0);
            expect(native.empty()).toBe(true);
        } finally {
            program.dispose();
        }
    });

    sourceCase('program from script exposes begin/end iterators', () => {
        const program = new Program(scriptOf('push_positive_1', 'push_positive_2'));
        try {
            expect(program.toNative().subscript().count()).toBe(2);
        } finally {
            program.dispose();
        }
    });

    sourceCase('program captures the flags and input_index it was built with', () => {
        const program = new Program(scriptOf('push_positive_1'), emptyTx(), 7, 0x42n, 9000n);
        try {
            const native = program.toNative();
            expect(native.inputIndex()).toBe(7);
            expect(native.flags()).toBe(0x42n);
            expect(native.value()).toBe(9000n);
        } finally {
            program.dispose();
        }
    });

    sourceCase('push / pop roundtrip', () => {
        const program = new Program();
        try {
            const native = program.toNative();
            native.push(true);
            expect(native.size()).toBe(1);
            expect(native.empty()).toBe(false);
            const value = native.popSimple();
            expect(native.empty()).toBe(true);
            expect(Array.from(value)).toEqual([0x01]);
        } finally {
            program.dispose();
        }
    });

    sourceCase('drop removes the top element', () => {
        const program = new Program();
        try {
            const native = program.toNative();
            native.push(true);
            native.push(false);
            expect(native.size()).toBe(2);
            native.drop();
            expect(native.size()).toBe(1);
        } finally {
            program.dispose();
        }
    });

    sourceCase('alternate stack push / pop', () => {
        const program = new Program();
        try {
            const native = program.toNative();
            expect(native.emptyAlternate()).toBe(true);
            native.pushAlternate(Uint8Array.of(0x2a));
            expect(native.emptyAlternate()).toBe(false);
            expect(Array.from(native.popAlternate())).toEqual([0x2a]);
            expect(native.emptyAlternate()).toBe(true);
        } finally {
            program.dispose();
        }
    });

    sourceCase('conditional stack open / close', () => {
        const program = new Program();
        try {
            const native = program.toNative();
            expect(native.conditionalStackSize()).toBe(0);
            expect(native.closed()).toBe(true);
            native.open(true);
            expect(native.conditionalStackSize()).toBe(1);
            expect(native.closed()).toBe(false);
            native.close();
            expect(native.conditionalStackSize()).toBe(0);
            expect(native.closed()).toBe(true);
        } finally {
            program.dispose();
        }
    });

    sourceCase('program::evaluate runs a valid script', () => {
        const program = new Program(scriptOf('push_positive_1'));
        try {
            expect(program.evaluate()).toBe(0);
        } finally {
            program.dispose();
        }
    });
});

describeSource('src/c-api/test/vm/program.cpp', () => {
    const twoOpProgram = () => new Program(Script.fromData(Uint8Array.of(0x51, 0xab), false)!);
    const withProgram = (body: (native: ReturnType<Program['toNative']>) => void) => {
        const program = twoOpProgram();
        try {
            body(program.toNative());
        } finally {
            program.dispose();
        }
    };
    const SIZE_MAX = 0xffffffff;

    sourceCase('C-API Program - mark_code_separator on default (empty script) fails', () => {
        const program = new Program();
        try {
            expect(program.toNative().markCodeSeparator(0)).toBe(false);
        } finally {
            program.dispose();
        }
    });

    sourceCase('C-API Program - mark_code_separator succeeds for every valid PC', () => {
        withProgram(native => {
            expect(native.markCodeSeparator(0)).toBe(true);
            expect(native.markCodeSeparator(1)).toBe(true);
        });
    });

    sourceCase('C-API Program - mark_code_separator rejects out-of-range PC', () => {
        withProgram(native => {
            expect(native.markCodeSeparator(2)).toBe(false);
            expect(native.markCodeSeparator(SIZE_MAX)).toBe(false);
        });
    });

    sourceCase('C-API Program - top_number reads the script integer at TOS', () => {
        withProgram(native => {
            native.push(true);
            const out = native.topNumber(4);
            expect(out.int64()).toBe(1n);
            free(out);
        });
    });

    sourceCase('C-API Program - pop_number consumes the stack top', () => {
        withProgram(native => {
            native.push(true);
            const out = native.popNumber(4);
            expect(out.int64()).toBe(1n);
            free(out);
            expect(() => native.popNumber(4)).toThrow();
        });
    });

    sourceCase('C-API Program - top_big_number reads the stack top as big-int', () => {
        withProgram(native => {
            native.push(true);
            const out = native.topBigNumber(4);
            expect(out.toInt32Saturating()).toBe(1);
            free(out);
        });
    });

    sourceCase('C-API Program - pop_big_number consumes the stack top', () => {
        withProgram(native => {
            native.push(true);
            const out = native.popBigNumber(4);
            expect(out.toInt32Saturating()).toBe(1);
            free(out);
        });
    });

    sourceCase('C-API Program - pop_binary pops two numbers from TOS', () => {
        withProgram(native => {
            native.push(true);
            native.push(true);
            const [a, b] = native.popBinary();
            expect(a.int64()).toBe(1n);
            expect(b.int64()).toBe(1n);
            free(a);
            free(b);
            expect(() => native.popNumber(4)).toThrow();
        });
    });

    sourceCase('C-API Program - pop_ternary pops three numbers from TOS', () => {
        withProgram(native => {
            native.push(true);
            native.push(true);
            native.push(true);
            const popped = native.popTernary();
            expect(popped.map(n => n.int64())).toEqual([1n, 1n, 1n]);
            popped.forEach(n => free(n));
        });
    });

    sourceCase('C-API Program - pop_binary on empty stack reports error', () => {
        withProgram(native => {
            expect(() => native.popBinary()).toThrow();
        });
    });

    sourceCase('C-API Program - pop_big_binary pops two big numbers from TOS', () => {
        withProgram(native => {
            native.push(true);
            native.push(true);
            const popped = native.popBigBinary();
            expect(popped.map(n => n.toInt32Saturating())).toEqual([1, 1]);
            popped.forEach(n => free(n));
        });
    });

    sourceCase('C-API Program - pop_big_ternary pops three big numbers from TOS', () => {
        withProgram(native => {
            native.push(true);
            native.push(true);
            native.push(true);
            const popped = native.popBigTernary();
            expect(popped.map(n => n.toInt32Saturating())).toEqual([1, 1, 1]);
            popped.forEach(n => free(n));
        });
    });

    sourceCase('C-API Program - pop(count) returns the top N stack elements', () => {
        withProgram(native => {
            native.push(true);
            native.push(true);
            native.push(true);
            const popped = native.pop(2);
            expect(popped.count()).toBe(2);
            expect(Array.from(popped.nth(0))).toEqual([0x01]);
            free(popped);
        });
    });

    sourceCase('C-API Program - pop(count) fails when the stack is too short', () => {
        withProgram(native => {
            native.push(true);
            expect(() => native.pop(2)).toThrow();
        });
    });
});
