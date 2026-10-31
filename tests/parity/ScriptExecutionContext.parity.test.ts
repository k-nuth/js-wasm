// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

// Ports src/c-api/test/vm/script_execution_context.cpp and src/domain/test/machine/metrics.cpp. The execution-context
// class is taken from the context a program built with a transaction returns; the metrics are the program's own,
// copied into an owned handle, as in the upstream C-API test.
import { Input, Output, OutputPoint, Program, Script, Transaction, free } from '../..';
import { flag } from './support/flags';
import { MetricsNative, ScriptExecutionContextNative } from './support/natives';
import { describeSource, sourceCase } from './support/sourceCase';

const SCRIPT_BODY = 'ece424a6bb6ddf4db592c0faed60685047a361b1';
const body = () => Script.fromData(Uint8Array.from(SCRIPT_BODY.match(/../g)!.map(b => parseInt(b, 16))), false)!;
const prevHash = Uint8Array.from({ length: 32 }, (_, i) => 0xa0 + i) as any;
const makeTransaction = () => new Transaction(2, 42,
    [new Input(new OutputPoint(prevHash, 0), body(), 0xffffffff)], [new Output(50000n, body())]);

function contextClass(): typeof ScriptExecutionContextNative {
    const program = new Program(body(), makeTransaction(), 0, 0n, 0n);
    try {
        const context = program.toNative().context();
        expect(context).not.toBeNull();
        return (context as unknown as { constructor: typeof ScriptExecutionContextNative }).constructor;
    } finally {
        program.dispose();
    }
}

describeSource('src/c-api/test/vm/script_execution_context.cpp', () => {
    sourceCase('C-API ScriptExecutionContext - construct surfaces the input index and tx getters', () => {
        const tx = makeTransaction().toNative();
        try {
            const context = new (contextClass())(0, tx);
            expect(context.inputIndex()).toBe(0);
            expect(context.inputCount()).toBe(1);
            expect(context.outputCount()).toBe(1);
            expect(context.txVersion()).toBe(2);
            expect(context.txLocktime()).toBe(42);
        } finally {
            free(tx);
        }
    });

    sourceCase('C-API ScriptExecutionContext - copy is an independent handle', () => {
        const tx = makeTransaction().toNative();
        try {
            const original = new (contextClass())(0, tx);
            const copy = original.copy();
            expect(copy).not.toBe(original);
            free(copy);
            expect(original.inputIndex()).toBe(0);
        } finally {
            free(tx);
        }
    });

    sourceCase('C-API ScriptExecutionContext - transaction() returns a queryable borrowed view', () => {
        const tx = makeTransaction().toNative();
        try {
            const borrowed = new (contextClass())(0, tx).transaction();
            expect(borrowed.version()).toBe(2);
            expect(borrowed.locktime()).toBe(42);
        } finally {
            free(tx);
        }
    });

    sourceCase('C-API ScriptExecutionContext - program without ctx reports no context', () => {
        const program = new Program(body());
        try {
            expect(program.toNative().context()).toBeNull();
        } finally {
            program.dispose();
        }
    });
});

const HASH_ITER_FACTOR_CONSENSUS = 64n;
const HASH_ITER_FACTOR_STANDARD = 192n;
const SIG_CHECK_COST_FACTOR = 26000n;
const SCRIPT_SIG_SIZE = 100n;

function metrics(): MetricsNative {
    const program = new Program(Script.fromData(Uint8Array.of(0x51), false)!);
    try {
        return program.toNative().getMetrics().copy();
    } finally {
        program.dispose();
    }
}

describeSource('src/domain/test/machine/metrics.cpp', () => {
    sourceCase('default metrics: all counters zero, no script limits', () => {
        const m = metrics();
        expect(m.sigChecks()).toBe(0);
        expect(m.opCost()).toBe(0n);
        expect(m.hashDigestIterations()).toBe(0n);
        expect(m.hasValidScriptLimits()).toBe(false);
    });

    sourceCase('without script_limits, every is_over_*_limit is false', () => {
        const m = metrics();
        m.addOpCost(1000000000);
        m.addHashIterations(1 << 20, true);
        expect(m.isOverOpCostLimitSimple()).toBe(false);
        expect(m.isOverOpCostLimit(0n)).toBe(false);
        expect(m.isOverHashItersLimit()).toBe(false);
    });

    sourceCase('add_op_cost accumulates', () => {
        const m = metrics();
        m.addOpCost(10);
        m.addOpCost(20);
        m.addOpCost(100);
        expect(m.opCost()).toBe(130n);
    });

    sourceCase('add_push_op is an alias of add_op_cost', () => {
        const viaPush = metrics();
        viaPush.addPushOp(5);
        viaPush.addPushOp(17);
        const viaOpCost = metrics();
        viaOpCost.addOpCost(5);
        viaOpCost.addOpCost(17);
        expect(viaPush.opCost()).toBe(viaOpCost.opCost());
        expect(viaPush.opCost()).toBe(22n);
    });

    const hashIterations = (name: string, length: number, twoRound: boolean, expected: bigint) => {
        sourceCase(name, () => {
            const m = metrics();
            m.addHashIterations(length, twoRound);
            expect(m.hashDigestIterations()).toBe(expected);
        });
    };
    hashIterations('add_hash_iterations: one-round hasher on short message', 0, false, 1n);
    hashIterations('add_hash_iterations: two-round hasher on short message', 0, true, 2n);
    hashIterations('add_hash_iterations: one-round hasher on one block of message', 56, false, 2n);

    sourceCase('add_hash_iterations accumulates across calls', () => {
        const m = metrics();
        m.addHashIterations(0, false);
        m.addHashIterations(0, true);
        m.addHashIterations(56, false);
        expect(m.hashDigestIterations()).toBe(5n);
    });

    sourceCase('add_sig_checks accumulates', () => {
        const m = metrics();
        m.addSigChecks(1);
        m.addSigChecks(1);
        m.addSigChecks(15);
        expect(m.sigChecks()).toBe(17);
    });

    sourceCase('composite_op_cost on zero metrics is zero', () => {
        const m = metrics();
        expect(m.compositeOpCostBool(false)).toBe(0n);
        expect(m.compositeOpCostBool(true)).toBe(0n);
    });

    sourceCase('composite_op_cost contribution from sig_checks only', () => {
        const m = metrics();
        m.addSigChecks(3);
        expect(m.compositeOpCostBool(false)).toBe(3n * SIG_CHECK_COST_FACTOR);
        expect(m.compositeOpCostBool(true)).toBe(3n * SIG_CHECK_COST_FACTOR);
    });

    sourceCase('composite_op_cost contribution from hash iters varies with standard flag', () => {
        const m = metrics();
        m.addHashIterations(0, false);
        expect(m.compositeOpCostBool(false)).toBe(HASH_ITER_FACTOR_CONSENSUS);
        expect(m.compositeOpCostBool(true)).toBe(HASH_ITER_FACTOR_STANDARD);
    });

    sourceCase('composite_op_cost composes op_cost + hash_iters + sig_checks', () => {
        const m = metrics();
        m.addOpCost(500);
        m.addHashIterations(0, true);
        m.addSigChecks(1);
        expect(m.compositeOpCostBool(false)).toBe(500n + 2n * HASH_ITER_FACTOR_CONSENSUS + SIG_CHECK_COST_FACTOR);
    });

    sourceCase('composite_op_cost(flags) routes through is_vm_limits_standard', () => {
        const m = metrics();
        m.addHashIterations(0, false);
        expect(m.compositeOpCostScriptFlags(flag('bch_vm_limits_standard'))).toBe(m.compositeOpCostBool(true));
        expect(m.compositeOpCostScriptFlags(0n)).toBe(m.compositeOpCostBool(false));
    });

    // is_vm_limits_standard(flags) is a free function; its result is observable as the hash-iteration weight that
    // composite_op_cost(flags) selects (192 for the policy bit, 64 otherwise).
    sourceCase('is_vm_limits_standard detects the policy bit', () => {
        const standardOf = (flags: bigint) => {
            const m = metrics();
            m.addHashIterations(0, false);
            return m.compositeOpCostScriptFlags(flags) === HASH_ITER_FACTOR_STANDARD;
        };
        expect(standardOf(0n)).toBe(false);
        expect(standardOf(flag('bch_vm_limits_standard'))).toBe(true);
        expect(standardOf(flag('bch_bitwise_ops'))).toBe(false);
        expect(standardOf(flag('bch_vm_limits_standard') | flag('bch_bitwise_ops'))).toBe(true);
    });

    // get_script_limits()->op_cost_limit() has no binding; the ceiling is observed as the first op cost that is over it.
    sourceCase('set_script_limits activates the ceiling derived from flags+scriptsig', () => {
        const m = metrics();
        expect(m.hasValidScriptLimits()).toBe(false);
        m.setScriptLimits(0n, SCRIPT_SIG_SIZE);
        expect(m.hasValidScriptLimits()).toBe(true);
        m.addOpCost(112800);
        expect(m.isOverOpCostLimit(0n)).toBe(false);
        m.addOpCost(1);
        expect(m.isOverOpCostLimit(0n)).toBe(true);
    });

    sourceCase("set_native_script_limits picks factor 192 vs 64 based on 'standard' bool", () => {
        const consensus = metrics();
        consensus.setNativeScriptLimits(false, SCRIPT_SIG_SIZE);
        consensus.addHashIterations(0, false);
        const standard = metrics();
        standard.setNativeScriptLimits(true, SCRIPT_SIG_SIZE);
        standard.addHashIterations(0, false);
        expect(consensus.compositeOpCostBool(false)).toBe(HASH_ITER_FACTOR_CONSENSUS);
        expect(standard.compositeOpCostBool(true)).toBe(HASH_ITER_FACTOR_STANDARD);
    });

    sourceCase('is_over_op_cost_limit crosses when the composite exceeds the ceiling', () => {
        const m = metrics();
        m.setNativeScriptLimits(false, SCRIPT_SIG_SIZE);
        m.addOpCost(112800);
        expect(m.isOverOpCostLimitSimple()).toBe(false);
        m.addOpCost(1);
        expect(m.isOverOpCostLimitSimple()).toBe(true);
    });

    sourceCase('is_over_hash_iters_limit crosses when iters exceed the ceiling', () => {
        const m = metrics();
        m.setNativeScriptLimits(false, SCRIPT_SIG_SIZE);
        m.addHashIterations(30000, false);
        expect(m.isOverHashItersLimit()).toBe(false);
        m.addHashIterations(30000, false);
        expect(m.isOverHashItersLimit()).toBe(true);
    });
});
