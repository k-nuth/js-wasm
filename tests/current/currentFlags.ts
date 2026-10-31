// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { ScriptFlags, ScriptUpgrades } from '../..';

// The consensus rules every supported year has (the old RuleFork.baseForks list, spelled with the current flags).
export const baseFlags: bigint = ScriptFlags.bip16Rule | ScriptFlags.bip30Rule | ScriptFlags.bip34Rule | ScriptFlags.bip66Rule
    | ScriptFlags.bip65Rule | ScriptFlags.bip90Rule | ScriptFlags.allowCollisions | ScriptFlags.bip68Rule
    | ScriptFlags.bip112Rule | ScriptFlags.bip113Rule;

// The latest cumulative upgrade mask in force at the start of a year (2017 UAHF + DAA, ... 2026 Leibniz).
const upgradeByYear: Array<[number, bigint]> = [
    [2017, ScriptUpgrades.bchDaaCw144], [2018, ScriptUpgrades.bchEuclid], [2019, ScriptUpgrades.bchMersenne],
    [2020, ScriptUpgrades.bchFermat], [2022, ScriptUpgrades.bchGauss], [2023, ScriptUpgrades.bchDescartes],
    [2024, ScriptUpgrades.bchLobachevski], [2025, ScriptUpgrades.bchGalois], [2026, ScriptUpgrades.bchLeibniz]
];

export function activeFlagsForYear(year: number): bigint {
    let flags = baseFlags;
    for (const [from, mask] of upgradeByYear) {
        if (year >= from) {
            flags |= mask;
        }
    }
    return flags;
}
