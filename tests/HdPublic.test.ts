// Copyright (c) 2016-2025 Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { HdPublic, EcPublic } from '..';

const MAINNET_P2KH = 0x00;

describe('HdPublic', () => {

    it('Should fail with empty string', () => {
        // m/44'/145'/0'
        const xpubStr  = 'xpub6CAemD8S648fre9X1e1YwQwWnumAjaXX7t7BxrN7mJRNFm6cwFusodAeyM6GaZXMVbALsYj7m6yf4SGHnoW6NojroW9MxspnUpNEeA6wWPV'
        const xpubStr2 = 'xpub6FMojX6j83AkovffdfxdGcTXhmZ5Wvaed5L39eNyzQ5oK1CGiP2Gbaht8yTEBM2rfGMpNnkkXiQkhUKJnnrc31yLgvmimYWEhXdGXwy16eW';
        const addr = 'bitcoincash:qr9sawzzmstkluq9nqefsu7eqya4zk2w7udune2pmf';

        const m44h145h0h = HdPublic.fromString(xpubStr);
        expect(m44h145h0h?.encoded).toBe(xpubStr);

        const m44h145h0h0 = m44h145h0h?.derivePublic(0);
        expect(m44h145h0h0?.encoded).toBe(xpubStr2);

        const m44h145h0h00 = m44h145h0h0?.derivePublic(0);

        const point = m44h145h0h00?.point;

        if ( ! point) {
            console.error('point is undefined');
            return;
        }
        const ecp = new EcPublic(point, true);
        const pa = ecp.toPaymentAddress(MAINNET_P2KH);
        expect(pa.encodedCashAddr()).toBe(addr);
    });
});
