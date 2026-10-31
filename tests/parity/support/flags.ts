// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { loadFixture } from './fixtures';

interface FlagFixture {
    flags: Record<string, string>;
    upgrades: Record<string, string>;
}

const upstream = loadFixture<FlagFixture>('script_flags.json');

// Script flag by its upstream enumerator name (script_flags::bch_p2s -> flag('bch_p2s')). The values are the ones parsed
// from the upstream script_flags.hpp, never the values of the package under test.
export function flag(name: string): bigint {
    const value = upstream.flags[name];
    if (value === undefined) {
        throw new Error('unknown upstream script flag ' + name);
    }
    return BigInt(value);
}

// Cumulative upgrade mask by its upstream name (upgrade::bch_gauss -> upgrade('bch_gauss')).
export function upgrade(name: string): bigint {
    const value = upstream.upgrades[name];
    if (value === undefined) {
        throw new Error('unknown upstream upgrade ' + name);
    }
    return BigInt(value);
}

export const upstreamFlagNames: Array<string> = Object.keys(upstream.flags);
export const upstreamUpgradeNames: Array<string> = Object.keys(upstream.upgrades);
