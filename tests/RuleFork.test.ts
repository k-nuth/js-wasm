// Copyright (c) 2016-2025 Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { RuleFork } from '..';

function binStrToInteger(str: string): number {
    return parseInt(str, 2);
}

function intToBinStr(num: number): string {
    return '0b' + num.toString(2).padStart(32, '0');
}

describe('RuleFork', () => {
    it('should return the correct integer for each rule', () => {
        expect(RuleFork.noRules).toBe(0);
        expect(RuleFork.easyBlocks).toBe(1 << 0);
        expect(RuleFork.bip16Rule).toBe(1 << 1);
        expect(RuleFork.bip30Rule).toBe(1 << 2);
        expect(RuleFork.bip34Rule).toBe(1 << 3);
        expect(RuleFork.bip66Rule).toBe(1 << 4);
        expect(RuleFork.bip65Rule).toBe(1 << 5);
        expect(RuleFork.bip90Rule).toBe(1 << 6);
        expect(RuleFork.allowCollisions).toBe(1 << 7);
        expect(RuleFork.bip68Rule).toBe(1 << 8);
        expect(RuleFork.bip112Rule).toBe(1 << 9);
        expect(RuleFork.bip113Rule).toBe(1 << 10);
        expect(RuleFork.bchUahf).toBe(1 << 11);
        expect(RuleFork.bchDaaCw144).toBe(1 << 12);
        expect(RuleFork.bchPythagoras).toBe(1 << 13);
        expect(RuleFork.bchEuclid).toBe(1 << 14);
        expect(RuleFork.bchPisano).toBe(1 << 15);
        expect(RuleFork.bchMersenne).toBe(1 << 16);
        expect(RuleFork.bchFermat).toBe(1 << 17);
        expect(RuleFork.bchEuler).toBe(1 << 18);
        expect(RuleFork.bchGauss).toBe(1 << 19);
        expect(RuleFork.bchDescartes).toBe(1 << 20);
        expect(RuleFork.bchLobachevski).toBe(1 << 21);
        expect(RuleFork.bchGalois).toBe(1 << 22);
        expect(RuleFork.bchLeibniz).toBe(1 << 23);
        expect(RuleFork.retarget).toBe(1 << 30);
        expect(RuleFork.unverified).toBe(1 << 31);
        expect(RuleFork.bip34Activations).toBe((1 << 3) | (1 << 5) | (1 << 4));
        expect(RuleFork.allRules).toBe(0xffffffff);
    });

    it('should return the correct integer for enabled forks by year', () => {
        expect(intToBinStr(RuleFork.baseForks())).                   toBe('0b01000000000000000000011111111110');
        expect(intToBinStr(RuleFork.baseForks(true))).               toBe('0b01000000000000000000011111111111');
        expect(intToBinStr(RuleFork.enabledForksByYear(2017))).      toBe('0b01000000000000000001111111111110');
        expect(intToBinStr(RuleFork.enabledForksByYear(2017, true))).toBe('0b01000000000000000001111111111111');
        expect(intToBinStr(RuleFork.enabledForksByYear(2018))).      toBe('0b01000000000000000111111111111110');
        expect(intToBinStr(RuleFork.enabledForksByYear(2018, true))).toBe('0b01000000000000000111111111111111');
        expect(intToBinStr(RuleFork.enabledForksByYear(2019))).      toBe('0b01000000000000011111111111111110');
        expect(intToBinStr(RuleFork.enabledForksByYear(2019, true))).toBe('0b01000000000000011111111111111111');
        expect(intToBinStr(RuleFork.enabledForksByYear(2020))).      toBe('0b01000000000001111111111111111110');
        expect(intToBinStr(RuleFork.enabledForksByYear(2020, true))).toBe('0b01000000000001111111111111111111');
        expect(intToBinStr(RuleFork.enabledForksByYear(2021))).      toBe('0b01000000000001111111111111111110');
        expect(intToBinStr(RuleFork.enabledForksByYear(2021, true))).toBe('0b01000000000001111111111111111111');
        expect(intToBinStr(RuleFork.enabledForksByYear(2022))).      toBe('0b01000000000011111111111111111110');
        expect(intToBinStr(RuleFork.enabledForksByYear(2022, true))).toBe('0b01000000000011111111111111111111');
        expect(intToBinStr(RuleFork.enabledForksByYear(2023))).      toBe('0b01000000000111111111111111111110');
        expect(intToBinStr(RuleFork.enabledForksByYear(2023, true))).toBe('0b01000000000111111111111111111111');
        expect(intToBinStr(RuleFork.enabledForksByYear(2024))).      toBe('0b01000000001111111111111111111110');
        expect(intToBinStr(RuleFork.enabledForksByYear(2024, true))).toBe('0b01000000001111111111111111111111');
        expect(intToBinStr(RuleFork.enabledForksByYear(2025))).      toBe('0b01000000011111111111111111111110');
        expect(intToBinStr(RuleFork.enabledForksByYear(2025, true))).toBe('0b01000000011111111111111111111111');
        expect(intToBinStr(RuleFork.enabledForksByYear(2026))).      toBe('0b01000000111111111111111111111110');
        expect(intToBinStr(RuleFork.enabledForksByYear(2026, true))).toBe('0b01000000111111111111111111111111');

        expect(intToBinStr(RuleFork.enabledForksByYear(2027))).      toBe('0b01000000111111111111111111111110');
        expect(intToBinStr(RuleFork.enabledForksByYear(2027, true))).toBe('0b01000000111111111111111111111111');
    });

    it('should return the correct integer for enabled forks by date', () => {
        expect(intToBinStr(RuleFork.baseForks())).                 toBe('0b01000000000000000000011111111110');

        expect(intToBinStr(RuleFork.enabledForksByDate(2017, 7))). toBe('0b01000000000000000000011111111110');
        expect(intToBinStr(RuleFork.enabledForksByDate(2017, 8))). toBe('0b01000000000000000000111111111110');
        expect(intToBinStr(RuleFork.enabledForksByDate(2017, 10))).toBe('0b01000000000000000000111111111110');
        expect(intToBinStr(RuleFork.enabledForksByDate(2017, 11))).toBe('0b01000000000000000001111111111110');

        expect(intToBinStr(RuleFork.enabledForksByDate(2018, 4))). toBe('0b01000000000000000001111111111110');
        expect(intToBinStr(RuleFork.enabledForksByDate(2018, 5))). toBe('0b01000000000000000011111111111110');
        expect(intToBinStr(RuleFork.enabledForksByDate(2018, 10))).toBe('0b01000000000000000011111111111110');
        expect(intToBinStr(RuleFork.enabledForksByDate(2018, 11))).toBe('0b01000000000000000111111111111110');

        expect(intToBinStr(RuleFork.enabledForksByDate(2019, 4))). toBe('0b01000000000000000111111111111110');
        expect(intToBinStr(RuleFork.enabledForksByDate(2019, 5))). toBe('0b01000000000000001111111111111110');
        expect(intToBinStr(RuleFork.enabledForksByDate(2019, 10))).toBe('0b01000000000000001111111111111110');
        expect(intToBinStr(RuleFork.enabledForksByDate(2019, 11))).toBe('0b01000000000000011111111111111110');

        expect(intToBinStr(RuleFork.enabledForksByDate(2020, 4))). toBe('0b01000000000000011111111111111110');
        expect(intToBinStr(RuleFork.enabledForksByDate(2020, 5))). toBe('0b01000000000000111111111111111110');
        expect(intToBinStr(RuleFork.enabledForksByDate(2020, 10))).toBe('0b01000000000000111111111111111110');
        expect(intToBinStr(RuleFork.enabledForksByDate(2020, 11))).toBe('0b01000000000001111111111111111110');

        expect(intToBinStr(RuleFork.enabledForksByDate(2021, 4))). toBe('0b01000000000001111111111111111110');
        expect(intToBinStr(RuleFork.enabledForksByDate(2021, 5))). toBe('0b01000000000001111111111111111110');
        expect(intToBinStr(RuleFork.enabledForksByDate(2021, 10))).toBe('0b01000000000001111111111111111110');
        expect(intToBinStr(RuleFork.enabledForksByDate(2021, 11))).toBe('0b01000000000001111111111111111110');

        expect(intToBinStr(RuleFork.enabledForksByDate(2022, 4))). toBe('0b01000000000001111111111111111110');
        expect(intToBinStr(RuleFork.enabledForksByDate(2022, 5))). toBe('0b01000000000011111111111111111110');

        expect(intToBinStr(RuleFork.enabledForksByDate(2023, 4))). toBe('0b01000000000011111111111111111110');
        expect(intToBinStr(RuleFork.enabledForksByDate(2023, 5))). toBe('0b01000000000111111111111111111110');

        expect(intToBinStr(RuleFork.enabledForksByDate(2024, 4))). toBe('0b01000000000111111111111111111110');
        expect(intToBinStr(RuleFork.enabledForksByDate(2024, 5))). toBe('0b01000000001111111111111111111110');

        expect(intToBinStr(RuleFork.enabledForksByDate(2025, 4))). toBe('0b01000000001111111111111111111110');
        expect(intToBinStr(RuleFork.enabledForksByDate(2025, 5))). toBe('0b01000000011111111111111111111110');

        expect(intToBinStr(RuleFork.enabledForksByDate(2026, 4))). toBe('0b01000000011111111111111111111110');
        expect(intToBinStr(RuleFork.enabledForksByDate(2026, 5))). toBe('0b01000000111111111111111111111110');

        expect(intToBinStr(RuleFork.enabledForksByDate(2027, 4))). toBe('0b01000000111111111111111111111110');
        expect(intToBinStr(RuleFork.enabledForksByDate(2027, 5))). toBe('0b01000000111111111111111111111110');
    });

    it('should return the correct integer for all forks', () => {
        expect(RuleFork.allForks()).toBe(0x40fffffe);
        expect(RuleFork.allForks(true)).toBe(0x40ffffff);
    });
});
