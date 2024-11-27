// Copyright (c) 2016-2024 Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { PaymentAddress } from '..';

describe('PaymentAddress', () => {

    it('Should fail with empty string', () => {
        const result = PaymentAddress.fromString('');
        expect(result).toBeUndefined();
    });

    it('Should fail with whitepace', () => {
        const result = PaymentAddress.fromString(' ');
        expect(result).toBeUndefined();
    });

    it('Should fail for invalid string input', () => {
        const addr = PaymentAddress.fromString('bogus');
        expect(addr).toBeUndefined();
    });

    it('Should parse and encode CashAddr correctly for mainnet', () => {
        const isVal = PaymentAddress.isValid('bitcoincash:qrcuqadqrzp2uztjl9wn5sthepkg22majyxw4gmv6p');
        expect(isVal).toBe(true);

        const addr = PaymentAddress.fromString('bitcoincash:qrcuqadqrzp2uztjl9wn5sthepkg22majyxw4gmv6p');
        expect(addr).not.toBeUndefined();

        expect(addr?.encoded()).toBe('bitcoincash:qrcuqadqrzp2uztjl9wn5sthepkg22majyxw4gmv6p');
        expect(addr?.encodedCashAddr()).toBe('bitcoincash:qrcuqadqrzp2uztjl9wn5sthepkg22majyxw4gmv6p');
        expect(addr?.encodedCashTokens()).toBe('bitcoincash:zrcuqadqrzp2uztjl9wn5sthepkg22majypyxk429j');
        expect(addr?.encodedLegacy()).toBe('1P3GQYtcWgZHrrJhUa4ctoQ3QoCU2F65nz');
    });

    it('Should parse and encode CashAddr (without prefix) correctly for mainnet', () => {
        const isVal = PaymentAddress.isValid('qrcuqadqrzp2uztjl9wn5sthepkg22majyxw4gmv6p');
        expect(isVal).toBe(true);

        const addr = PaymentAddress.fromString('qrcuqadqrzp2uztjl9wn5sthepkg22majyxw4gmv6p');
        expect(addr).not.toBeUndefined();

        expect(addr?.encoded()).toBe('bitcoincash:qrcuqadqrzp2uztjl9wn5sthepkg22majyxw4gmv6p');
        expect(addr?.encodedCashAddr()).toBe('bitcoincash:qrcuqadqrzp2uztjl9wn5sthepkg22majyxw4gmv6p');
        expect(addr?.encodedCashTokens()).toBe('bitcoincash:zrcuqadqrzp2uztjl9wn5sthepkg22majypyxk429j');
        expect(addr?.encodedLegacy()).toBe('1P3GQYtcWgZHrrJhUa4ctoQ3QoCU2F65nz');
    });

    it('Should parse and encode legacy address correctly for mainnet', () => {
        const isVal = PaymentAddress.isValid('1P3GQYtcWgZHrrJhUa4ctoQ3QoCU2F65nz');
        expect(isVal).toBe(true);

        const addr = PaymentAddress.fromString('1P3GQYtcWgZHrrJhUa4ctoQ3QoCU2F65nz');
        expect(addr).not.toBeUndefined();

        expect(addr?.encoded()).toBe('bitcoincash:qrcuqadqrzp2uztjl9wn5sthepkg22majyxw4gmv6p');
        expect(addr?.encodedCashAddr()).toBe('bitcoincash:qrcuqadqrzp2uztjl9wn5sthepkg22majyxw4gmv6p');
        expect(addr?.encodedCashTokens()).toBe('bitcoincash:zrcuqadqrzp2uztjl9wn5sthepkg22majypyxk429j');
        expect(addr?.encodedLegacy()).toBe('1P3GQYtcWgZHrrJhUa4ctoQ3QoCU2F65nz');
    });

    it('Should handle 32-byte CashAddr correctly for mainnet', () => {
        const addr = PaymentAddress.fromString('bitcoincash:pvstqkm54dtvnpyqxt5m5n7sjsn4enrlxc526xyxlnjkaycdzfeu69reyzmqx');
        expect(addr).not.toBeUndefined();
        expect(addr?.encodedCashAddr()).toBe('bitcoincash:pvstqkm54dtvnpyqxt5m5n7sjsn4enrlxc526xyxlnjkaycdzfeu69reyzmqx');
        expect(addr?.encodedCashTokens()).toBe('bitcoincash:rvstqkm54dtvnpyqxt5m5n7sjsn4enrlxc526xyxlnjkaycdzfeu6hs99m6ed');
        expect(addr?.encodedLegacy()).toBe('34frpCV2v6wtzig9xx4Z9XJ6s4jU3zqwR7');// In fact a 32-byte address is not representable in legacy encoding.
    });

});
