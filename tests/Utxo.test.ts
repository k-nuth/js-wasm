// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { Utxo, RuleFork, TokenData, TokenDataFungible } from '..';
import { decodeHash } from '..';

const noRules = RuleFork.noRules;
const allRules = RuleFork.allRules;
const bip16_rule = RuleFork.bip16Rule;
const bip30_rule = RuleFork.bip30Rule;
const bip34_rule = RuleFork.bip34Rule;
const bip65_rule = RuleFork.bip65Rule;
const bip66_rule = RuleFork.bip66Rule;
const bip112_rule = RuleFork.bip112Rule;

const hash1 = decodeHash('000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f');
const valid_raw_output_point = '000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f00000015';

describe('Utxo', () => {

    it('Should be invalid by default', () => {
        const point = new Utxo();
        expect(point.valid).toBe(false);
    });

    it('Should be valid if hash is not 32\'s zero', () => {
        const index = 1234;
        const point = new Utxo(hash1, index, 100000000n);
        expect(point.valid).toBe(true);
        expect(point.hash).toBe(hash1);
        expect(point.index).toBe(index);
        expect(point.amount).toBe(100000000n);
    });

    it('Should be valid if token data is set', () => {
        const point = new Utxo(hash1, 1234, 100000000n);
        expect(point.valid).toBe(true);
        expect(point.tokenData).toBeUndefined();
        point.tokenData = new TokenData(
            hash1,
            new TokenDataFungible(100000000n)
        );
        expect(point.tokenData).toBeDefined();
        if ( ! point.tokenData) return;
        expect(point.tokenData.category).toBe(hash1);
        expect((point.tokenData.data as TokenDataFungible).amount).toBe(100000000n);
    });

});
