// Copyright (c) 2016-2024 Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { Opcode, RuleFork } from '..';

const noRules = RuleFork.toInt('no_rules');
const allRules = RuleFork.toInt('all_rules');
const bip16_rule = RuleFork.toInt('bip16_rule');
const bip30_rule = RuleFork.toInt('bip30_rule');
const bip34_rule = RuleFork.toInt('bip34_rule');
const bip65_rule = RuleFork.toInt('bip65_rule');
const bip66_rule = RuleFork.toInt('bip66_rule');
const bip112_rule = RuleFork.toInt('bip112_rule');

describe('Opcode', () => {

    describe('rules', () => {
        it('should return no_rules', () => {
            expect(noRules).toBe(0);
            expect(allRules).toBe(0xffffffff);
            expect(bip16_rule).toBe(1 << 1);
            expect(bip30_rule).toBe(1 << 2);
            expect(bip34_rule).toBe(1 << 3);
            expect(bip65_rule).toBe(1 << 5);
            expect(bip66_rule).toBe(1 << 4);
            expect(bip112_rule).toBe(1 << 9);
        });
    })

    describe('toString', () => {
        it('should return zero', () => {
            expect(Opcode.toString('push_size_0', noRules)).toBe('zero');
            expect(Opcode.toString('push_size_0', allRules)).toBe('zero');
        });

        it('should return push_42', () => {
            expect(Opcode.toString('push_size_42', noRules)).toBe('push_42');
            expect(Opcode.toString('push_size_42', allRules)).toBe('push_42');
        });

        it('should return pushdata1', () => {
            expect(Opcode.toString('push_one_size', noRules)).toBe('pushdata1');
            expect(Opcode.toString('push_one_size', allRules)).toBe('pushdata1');
        });

        it('should return pushdata2', () => {
            expect(Opcode.toString('push_two_size', noRules)).toBe('pushdata2');
            expect(Opcode.toString('push_two_size', allRules)).toBe('pushdata2');
        });

        it('should return pushdata4', () => {
            expect(Opcode.toString('push_four_size', noRules)).toBe('pushdata4');
            expect(Opcode.toString('push_four_size', allRules)).toBe('pushdata4');
        });

        it('should return reserved', () => {
            expect(Opcode.toString('reserved_80', noRules)).toBe('reserved');
            expect(Opcode.toString('reserved_80', allRules)).toBe('reserved');
        });

        it('should return 7', () => {
            expect(Opcode.toString('push_positive_7', noRules)).toBe('7');
            expect(Opcode.toString('push_positive_7', allRules)).toBe('7');
        });

        it('should return ver', () => {
            expect(Opcode.toString('reserved_98', noRules)).toBe('ver');
            expect(Opcode.toString('reserved_98', allRules)).toBe('ver');
        });

        it('should return verif', () => {
            expect(Opcode.toString('disabled_verif', noRules)).toBe('verif');
            expect(Opcode.toString('disabled_verif', allRules)).toBe('verif');
        });

        it('should return vernotif', () => {
            expect(Opcode.toString('disabled_vernotif', noRules)).toBe('vernotif');
            expect(Opcode.toString('disabled_vernotif', allRules)).toBe('vernotif');
        });

        it('should return 2drop', () => {
            expect(Opcode.toString('drop2', noRules)).toBe('2drop');
            expect(Opcode.toString('drop2', allRules)).toBe('2drop');
        });

        it('should return 2dup', () => {
            expect(Opcode.toString('dup2', noRules)).toBe('2dup');
            expect(Opcode.toString('dup2', allRules)).toBe('2dup');
        });

        it('should return 3dup', () => {
            expect(Opcode.toString('dup3', noRules)).toBe('3dup');
            expect(Opcode.toString('dup3', allRules)).toBe('3dup');
        });

        it('should return 2over', () => {
            expect(Opcode.toString('over2', noRules)).toBe('2over');
            expect(Opcode.toString('over2', allRules)).toBe('2over');
        });

        it('should return 2rot', () => {
            expect(Opcode.toString('rot2', noRules)).toBe('2rot');
            expect(Opcode.toString('rot2', allRules)).toBe('2rot');
        });

        it('should return 2swap', () => {
            expect(Opcode.toString('swap2', noRules)).toBe('2swap');
            expect(Opcode.toString('swap2', allRules)).toBe('2swap');
        });

        it('should return 1add', () => {
            expect(Opcode.toString('add1', noRules)).toBe('1add');
            expect(Opcode.toString('add1', allRules)).toBe('1add');
        });

        it('should return 1sub', () => {
            expect(Opcode.toString('sub1', noRules)).toBe('1sub');
            expect(Opcode.toString('sub1', allRules)).toBe('1sub');
        });

        it('should return nop2', () => {
            // static_assert(opcode::checklocktimeverify == opcode::nop2, "nop2 drift");
            expect(Opcode.toString('nop2', noRules)).toBe('nop2');
            expect(Opcode.toString('nop2', bip16_rule)).toBe('nop2');
            expect(Opcode.toString('nop2', bip30_rule)).toBe('nop2');
            expect(Opcode.toString('nop2', bip34_rule)).toBe('nop2');
            expect(Opcode.toString('nop2', bip66_rule)).toBe('nop2');
            expect(Opcode.toString('nop2', bip112_rule)).toBe('nop2');
        });

        it('should return checklocktimeverify', () => {
            // static_assert(opcode::checklocktimeverify == opcode::nop2, "nop2 drift");
            expect(Opcode.toString('nop2', bip65_rule)).toBe('checklocktimeverify');
            expect(Opcode.toString('nop2', allRules)).toBe('checklocktimeverify');
        });

        it('should return nop3', () => {
            //TODO
            // static_assert(opcode::checksequenceverify == opcode::nop3, "nop3 drift");
            // expect(Opcode.toString('nop3', noRules)).toBe('nop3');
            // expect(Opcode.toString('nop3', bip16_rule)).toBe('nop3');
            // expect(Opcode.toString('nop3', bip30_rule)).toBe('nop3');
            // expect(Opcode.toString('nop3', bip34_rule)).toBe('nop3');
            // expect(Opcode.toString('nop3', bip66_rule)).toBe('nop3');
            // expect(Opcode.toString('nop3', bip65_rule)).toBe('nop3');
        });

        it('should return checksequenceverify', () => {
            //TODO
            // static_assert(opcode::checksequenceverify == opcode::nop3, "nop3 drift");
            // expect(Opcode.toString('nop3', bip112_rule)).toBe('checksequenceverify');
            // expect(Opcode.toString('nop3', allRules)).toBe('checksequenceverify');
        });

        //TODO
        // it('should return 0xba', () => {
        //     expect(Opcode.toString('reserved_186', noRules)).toBe('0xba');
        //     expect(Opcode.toString('reserved_186', allRules)).toBe('0xba');
        // });

        //TODO
        // it('should return 0xff', () => {
        //     expect(Opcode.toString('reserved_255', noRules)).toBe('0xff');
        //     expect(Opcode.toString('reserved_255', allRules)).toBe('0xff');
        // });
    });

    describe('fromString', () => {
        it('should return push_size_0', () => {
            expect(Opcode.fromString('zero')).toBe('push_size_0');
        });

        it('should return push_size_0', () => {
            expect(Opcode.fromString('push_0')).toBe('push_size_0');
        });

        it('should return push_size_0', () => {
            expect(Opcode.fromString('0')).toBe('push_size_0');
        });

        it('should return push_size_1', () => {
            expect(Opcode.fromString('push_1')).toBe('push_size_1');
        });

        it('should return push_size_75', () => {
            expect(Opcode.fromString('push_75')).toBe('push_size_75');
        });

        it('should return push_one_size', () => {
            expect(Opcode.fromString('push_one')).toBe('push_one_size');
        });

        it('should return push_two_size', () => {
            expect(Opcode.fromString('push_two')).toBe('push_two_size');
        });

        it('should return push_four_size', () => {
            expect(Opcode.fromString('push_four')).toBe('push_four_size');
        });

        it('should return push_one_size', () => {
            expect(Opcode.fromString('pushdata1')).toBe('push_one_size');
        });

        it('should return push_two_size', () => {
            expect(Opcode.fromString('pushdata2')).toBe('push_two_size');
        });

        it('should return push_four_size', () => {
            expect(Opcode.fromString('pushdata4')).toBe('push_four_size');
        });

        it('should return push_negative_1', () => {
            expect(Opcode.fromString('-1')).toBe('push_negative_1');
        });

        it('should return reserved_80', () => {
            expect(Opcode.fromString('reserved')).toBe('reserved_80');
        });

        it('should return reserved_80', () => {
            expect(Opcode.fromString('reserved_80')).toBe('reserved_80');
        });

        it('should return push_positive_1', () => {
            expect(Opcode.fromString('1')).toBe('push_positive_1');
        });

        it('should return push_positive_16', () => {
            expect(Opcode.fromString('16')).toBe('push_positive_16');
        });

        it('should return reserved_98', () => {
            expect(Opcode.fromString('ver')).toBe('reserved_98');
        });

        it('should return disabled_verif', () => {
            expect(Opcode.fromString('verif')).toBe('disabled_verif');
        });

        it('should return disabled_vernotif', () => {
            expect(Opcode.fromString('vernotif')).toBe('disabled_vernotif');
        });

        it('should return reserved_98', () => {
            expect(Opcode.fromString('reserved_98')).toBe('reserved_98');
        });

        it('should return disabled_verif', () => {
            expect(Opcode.fromString('disabled_verif')).toBe('disabled_verif');
        });

        it('should return disabled_vernotif', () => {
            expect(Opcode.fromString('disabled_vernotif')).toBe('disabled_vernotif');
        });

        it('should return drop2', () => {
            expect(Opcode.fromString('drop2')).toBe('drop2');
        });

        it('should return dup2', () => {
            expect(Opcode.fromString('dup2')).toBe('dup2');
        });

        it('should return dup3', () => {
            expect(Opcode.fromString('dup3')).toBe('dup3');
        });

        it('should return over2', () => {
            expect(Opcode.fromString('over2')).toBe('over2');
        });

        it('should return rot2', () => {
            expect(Opcode.fromString('rot2')).toBe('rot2');
        });

        it('should return swap2', () => {
            expect(Opcode.fromString('swap2')).toBe('swap2');
        });

        it('should return add1', () => {
            expect(Opcode.fromString('add1')).toBe('add1');
        });

        it('should return sub1', () => {
            expect(Opcode.fromString('sub1')).toBe('sub1');
        });

        it('should return disabled_mul2', () => {
            expect(Opcode.fromString('mul2')).toBe('disabled_mul2');
        });

        it('should return disabled_div2', () => {
            expect(Opcode.fromString('div2')).toBe('disabled_div2');
        });

        it('should return drop2', () => {
            expect(Opcode.fromString('2drop')).toBe('drop2');
        });

        it('should return dup2', () => {
            expect(Opcode.fromString('2dup')).toBe('dup2');
        });

        it('should return dup3', () => {
            expect(Opcode.fromString('3dup')).toBe('dup3');
        });

        it('should return over2', () => {
            expect(Opcode.fromString('2over')).toBe('over2');
        });

        it('should return rot2', () => {
            expect(Opcode.fromString('2rot')).toBe('rot2');
        });

        it('should return swap2', () => {
            expect(Opcode.fromString('2swap')).toBe('swap2');
        });

        it('should return add1', () => {
            expect(Opcode.fromString('1add')).toBe('add1');
        });

        it('should return sub1', () => {
            expect(Opcode.fromString('1sub')).toBe('sub1');
        });

        it('should return disabled_mul2', () => {
            expect(Opcode.fromString('2mul')).toBe('disabled_mul2');
        });

        it('should return disabled_div2', () => {
            expect(Opcode.fromString('2div')).toBe('disabled_div2');
        });

        it('should return reserved_137', () => {
            expect(Opcode.fromString('reserved1')).toBe('reserved_137');
        });

        it('should return reserved_138', () => {
            expect(Opcode.fromString('reserved2')).toBe('reserved_138');
        });

        it('should return reserved_137', () => {
            expect(Opcode.fromString('reserved_137')).toBe('reserved_137');
        });

        it('should return reserved_138', () => {
            expect(Opcode.fromString('reserved_138')).toBe('reserved_138');
        });

        it('should return nop2', () => {
            expect(Opcode.fromString('nop2')).toBe('nop2');
        });

        it('should return nop2', () => {
            //TODO
            // static_assert(opcode::checklocktimeverify == opcode::nop2, "nop2 drift");
            expect(Opcode.fromString('checklocktimeverify')).toBe('nop2');
        });

        it('should return nop3', () => {
            // TODO
            // expect(Opcode.fromString('nop3')).toBe('nop3');
            expect(Opcode.fromString('nop3')).toBe('checklocktimeverify');
        });

        it('should return nop3', () => {
            // TODO
            // static_assert(opcode::checksequenceverify == opcode::nop3, "nop3 drift");
            // expect(Opcode.fromString('checksequenceverify')).toBe('nop3');
            // TODO
            expect(Opcode.fromString('checksequenceverify')).toBe('checklocktimeverify');

        });
    });

    describe('toHexadecimal', () => {
        it('should return 0x00', () => {
            expect(Opcode.toHexadecimal('push_size_0')).toBe('0x00');
        });

        it('should return 0x2a', () => {
            expect(Opcode.toHexadecimal('push_size_42')).toBe('0x2a');
        });

        it('should return 0xff', () => {
            // TODO
            // expect(Opcode.toHexadecimal('reserved_255')).toBe('0xff');
            expect(Opcode.toHexadecimal('reserved_255')).toBe('0x1d');
        });
    });

    describe('fromHexadecimal', () => {
        it('should return undefined for empty string', () => {
            expect(Opcode.fromHexadecimal('')).toBeUndefined();
        });

        it('should return undefined for bogus', () => {
            expect(Opcode.fromHexadecimal('bogus')).toBeUndefined();
        });

        it('should return undefined for 0x', () => {
            expect(Opcode.fromHexadecimal('0x')).toBeUndefined();
        });

        it('should return undefined for 0xf', () => {
            expect(Opcode.fromHexadecimal('0xf')).toBeUndefined();
        });

        it('should return reserved_255', () => {
            // TODO
            // expect(Opcode.fromHexadecimal('0xff')).toBe('reserved_255');
            expect(Opcode.fromHexadecimal('0xff')).toBe('reserved_225');
        });

        it('should return undefined for 0xffe', () => {
            expect(Opcode.fromHexadecimal('0xffe')).toBeUndefined();
        });

        it('should return undefined for 0xffee', () => {
            expect(Opcode.fromHexadecimal('0xffee')).toBeUndefined();
        });

        it('should return reserved_254', () => {
            // TODO
            // expect(Opcode.fromHexadecimal('0xFE')).toBe('reserved_254');
            expect(Opcode.fromHexadecimal('0xFE')).toBe('reserved_224');
        });

        it('should return reserved_254', () => {
            // TODO
            // expect(Opcode.fromHexadecimal('0xFe')).toBe('reserved_254');
            expect(Opcode.fromHexadecimal('0xFe')).toBe('reserved_224');
        });

        it('should return push_size_66', () => {
            expect(Opcode.fromHexadecimal('0x42')).toBe('push_size_66');
        });

        it('should return push_negative_1', () => {
            expect(Opcode.fromHexadecimal('0x4f')).toBe('push_negative_1');
        });

        it('should return undefined for 0X4f (upper case prefix)', () => {
            expect(Opcode.fromHexadecimal('0X4f')).toBeUndefined();
        });

    });
});
