// Copyright (c) 2016-2024 Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { RuleFork } from '..';

describe('RuleFork', () => {
    it('should convert RuleForkEnumNative to int', () => {
        expect(RuleFork.toInt('no_rules')).toBe(0);
        expect(RuleFork.toInt('easy_blocks')).toBe(1 << 0);
        expect(RuleFork.toInt('bip16_rule')).toBe(1 << 1);
        expect(RuleFork.toInt('bip30_rule')).toBe(1 << 2);
        expect(RuleFork.toInt('bip34_rule')).toBe(1 << 3);
        expect(RuleFork.toInt('bip66_rule')).toBe(1 << 4);
        expect(RuleFork.toInt('bip65_rule')).toBe(1 << 5);
        expect(RuleFork.toInt('bip90_rule')).toBe(1 << 6);
        expect(RuleFork.toInt('allow_collisions')).toBe(1 << 7);
        expect(RuleFork.toInt('bip68_rule')).toBe(1 << 8);
        expect(RuleFork.toInt('bip112_rule')).toBe(1 << 9);
        expect(RuleFork.toInt('bip113_rule')).toBe(1 << 10);
        expect(RuleFork.toInt('bch_uahf')).toBe(1 << 11);
        expect(RuleFork.toInt('bch_daa_cw144')).toBe(1 << 12);
        expect(RuleFork.toInt('bch_pythagoras')).toBe(1 << 13);
        expect(RuleFork.toInt('bch_euclid')).toBe(1 << 14);
        expect(RuleFork.toInt('bch_pisano')).toBe(1 << 15);
        expect(RuleFork.toInt('bch_mersenne')).toBe(1 << 16);
        expect(RuleFork.toInt('bch_fermat')).toBe(1 << 17);
        expect(RuleFork.toInt('bch_euler')).toBe(1 << 18);
        expect(RuleFork.toInt('bch_gauss')).toBe(1 << 19);
        expect(RuleFork.toInt('bch_descartes')).toBe(1 << 20);
        expect(RuleFork.toInt('bch_lobachevski')).toBe(1 << 21);
        expect(RuleFork.toInt('bch_galois')).toBe(1 << 22);
        expect(RuleFork.toInt('bch_leibniz')).toBe(1 << 23);
        expect(RuleFork.toInt('retarget')).toBe(1 << 30);
        expect(RuleFork.toInt('unverified')).toBe(1 << 31);
        expect(RuleFork.toInt('bip34_activations')).toBe((1 << 3) | (1 << 5) | (1 << 4));
        expect(RuleFork.toInt('bip9_bit0_group')).toBe((1 << 8) | (1 << 9) | (1 << 10));
        expect(RuleFork.toInt('bip9_bit1_group')).toBe((1 << 141) | (1 << 143) | (1 << 147));
        expect(RuleFork.toInt('all_rules')).toBe(0xffffffff);
    });
});
