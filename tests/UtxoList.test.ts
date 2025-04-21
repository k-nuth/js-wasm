// Copyright (c) 2016-2025 Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { Utxo, UtxoList } from '..';

describe('UtxoList', () => {

    it('Should convert an array of UTXOs to native and verify the count', () => {
        const utxos = [
            new Utxo(),
            new Utxo(),
            new Utxo()
        ];
        const native = UtxoList.toNative(utxos);
        expect(native.count()).toBe(3);
    });

});
