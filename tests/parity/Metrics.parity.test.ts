// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

// Ports src/c-api/test/vm/metrics.cpp. MetricsNative is reached the way the upstream test reaches it: borrowed from a
// program (Program.toNative().getMetrics()) and copied into an owned handle.
import { Program, Script } from '../..';
import { flag } from './support/flags';
import { MetricsNative } from './support/natives';
import { describeSource, sourceCase } from './support/sourceCase';

const HASH_ITER_FACTOR_CONSENSUS = 64n;
const HASH_ITER_FACTOR_STANDARD = 192n; // 64 * 3
const SIG_CHECK_COST_FACTOR = 26000n;
const SCRIPT_SIG_SIZE = 100n;

function freshMetrics(): MetricsNative {
    const program = new Program(Script.fromData(Uint8Array.of(0x51), false)!);
    try {
        return program.toNative().getMetrics().copy();
    } finally {
        program.dispose();
    }
}

describeSource('src/c-api/test/vm/metrics.cpp', () => {
    sourceCase('C-API Metrics - default metrics: all counters zero, no script limits', () => {
        const m = freshMetrics();
        expect(m.sigChecks()).toBe(0);
        expect(m.opCost()).toBe(0n);
        expect(m.hashDigestIterations()).toBe(0n);
        expect(m.hasValidScriptLimits()).toBe(false);
    });

    sourceCase('C-API Metrics - without script_limits, every is_over_*_limit is false', () => {
        const m = freshMetrics();
        m.addOpCost(1000000000);
        m.addHashIterations(1 << 20, true);
        expect(m.isOverOpCostLimitSimple()).toBe(false);
        expect(m.isOverOpCostLimit(0n)).toBe(false);
        expect(m.isOverHashItersLimit()).toBe(false);
    });

    sourceCase('C-API Metrics - copy produces an independent metrics', () => {
        const a = freshMetrics();
        a.addOpCost(500);
        const b = a.copy();
        expect(b.opCost()).toBe(500n);
        b.addOpCost(100);
        expect(a.opCost()).toBe(500n);
        expect(b.opCost()).toBe(600n);
    });

    sourceCase('C-API Metrics - add_op_cost accumulates', () => {
        const m = freshMetrics();
        m.addOpCost(10);
        m.addOpCost(20);
        m.addOpCost(100);
        expect(m.opCost()).toBe(130n);
    });

    sourceCase('C-API Metrics - add_push_op is an alias of add_op_cost', () => {
        const viaPush = freshMetrics();
        viaPush.addPushOp(5);
        viaPush.addPushOp(17);
        const viaOpCost = freshMetrics();
        viaOpCost.addOpCost(5);
        viaOpCost.addOpCost(17);
        expect(viaPush.opCost()).toBe(viaOpCost.opCost());
        expect(viaPush.opCost()).toBe(22n);
    });

    const hashIterations = (name: string, length: number, twoRound: boolean, expected: bigint) => {
        sourceCase(name, () => {
            const m = freshMetrics();
            m.addHashIterations(length, twoRound);
            expect(m.hashDigestIterations()).toBe(expected);
        });
    };
    hashIterations('C-API Metrics - add_hash_iterations: one-round on short message', 0, false, 1n);
    hashIterations('C-API Metrics - add_hash_iterations: two-round on short message', 0, true, 2n);
    hashIterations('C-API Metrics - add_hash_iterations: one-round on one block', 56, false, 2n);

    sourceCase('C-API Metrics - add_hash_iterations accumulates across calls', () => {
        const m = freshMetrics();
        m.addHashIterations(0, false);
        m.addHashIterations(0, true);
        m.addHashIterations(56, false);
        expect(m.hashDigestIterations()).toBe(5n);
    });

    sourceCase('C-API Metrics - add_sig_checks accumulates', () => {
        const m = freshMetrics();
        m.addSigChecks(1);
        m.addSigChecks(1);
        m.addSigChecks(15);
        expect(m.sigChecks()).toBe(17);
    });

    sourceCase('C-API Metrics - composite_op_cost on zero metrics is zero', () => {
        const m = freshMetrics();
        expect(m.compositeOpCostBool(false)).toBe(0n);
        expect(m.compositeOpCostBool(true)).toBe(0n);
    });

    sourceCase('C-API Metrics - composite_op_cost: sig_checks contribution only', () => {
        const m = freshMetrics();
        m.addSigChecks(3);
        expect(m.compositeOpCostBool(false)).toBe(3n * SIG_CHECK_COST_FACTOR);
        expect(m.compositeOpCostBool(true)).toBe(3n * SIG_CHECK_COST_FACTOR);
    });

    sourceCase("C-API Metrics - composite_op_cost: hash iters weighted by 'standard'", () => {
        const m = freshMetrics();
        m.addHashIterations(0, false);
        expect(m.compositeOpCostBool(false)).toBe(HASH_ITER_FACTOR_CONSENSUS);
        expect(m.compositeOpCostBool(true)).toBe(HASH_ITER_FACTOR_STANDARD);
    });

    sourceCase('C-API Metrics - composite_op_cost composes op_cost + hash_iters + sig_checks', () => {
        const m = freshMetrics();
        m.addOpCost(500);
        m.addHashIterations(0, true);
        m.addSigChecks(1);
        expect(m.compositeOpCostBool(false)).toBe(500n + 2n * HASH_ITER_FACTOR_CONSENSUS + SIG_CHECK_COST_FACTOR);
    });

    sourceCase('C-API Metrics - composite_op_cost(flags) routes through is_vm_limits_standard', () => {
        const m = freshMetrics();
        m.addHashIterations(0, false);
        expect(m.compositeOpCostScriptFlags(flag('bch_vm_limits_standard'))).toBe(m.compositeOpCostBool(true));
        expect(m.compositeOpCostScriptFlags(0n)).toBe(m.compositeOpCostBool(false));
    });

    sourceCase('C-API Metrics - set_script_limits activates has_valid_script_limits', () => {
        const m = freshMetrics();
        expect(m.hasValidScriptLimits()).toBe(false);
        m.setScriptLimits(0n, SCRIPT_SIG_SIZE);
        expect(m.hasValidScriptLimits()).toBe(true);
    });

    sourceCase("C-API Metrics - set_native_script_limits picks the hash_iters ceiling from 'standard'", () => {
        const consensus = freshMetrics();
        consensus.setNativeScriptLimits(false, SCRIPT_SIG_SIZE);
        const standard = freshMetrics();
        standard.setNativeScriptLimits(true, SCRIPT_SIG_SIZE);
        consensus.addHashIterations(5000, false);
        standard.addHashIterations(5000, false);
        expect(consensus.isOverHashItersLimit()).toBe(false);
        expect(standard.isOverHashItersLimit()).toBe(true);
    });

    sourceCase('C-API Metrics - is_over_op_cost_limit crosses when composite > ceiling', () => {
        const m = freshMetrics();
        m.setNativeScriptLimits(false, SCRIPT_SIG_SIZE);
        m.addOpCost(112800);
        expect(m.isOverOpCostLimitSimple()).toBe(false);
        m.addOpCost(1);
        expect(m.isOverOpCostLimitSimple()).toBe(true);
    });

    sourceCase('C-API Metrics - is_over_hash_iters_limit crosses when iters > ceiling', () => {
        const m = freshMetrics();
        m.setNativeScriptLimits(false, SCRIPT_SIG_SIZE);
        m.addHashIterations(30000, false);
        expect(m.isOverHashItersLimit()).toBe(false);
        m.addHashIterations(30000, false);
        expect(m.isOverHashItersLimit()).toBe(true);
    });
});
