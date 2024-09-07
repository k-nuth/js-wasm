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

    it('Should fail with invalid address', () => {
        const result = PaymentAddress.fromString('abcd');
        expect(result).toBeUndefined();
    });

    it('Should parse Ok a valid mainnet cashaddr', () => {
        const isVal = PaymentAddress.isValid('bitcoincash:qrcuqadqrzp2uztjl9wn5sthepkg22majyxw4gmv6p');
        expect(isVal).toBe(true);

        const addr = PaymentAddress.fromString('bitcoincash:qrcuqadqrzp2uztjl9wn5sthepkg22majyxw4gmv6p');
        expect(addr).not.toBeUndefined();

        expect(addr?.encoded()).toBe('bitcoincash:qrcuqadqrzp2uztjl9wn5sthepkg22majyxw4gmv6p');
        expect(addr?.encodedCashAddr()).toBe('bitcoincash:qrcuqadqrzp2uztjl9wn5sthepkg22majyxw4gmv6p');
        expect(addr?.encodedCashTokens()).toBe('bitcoincash:zrcuqadqrzp2uztjl9wn5sthepkg22majypyxk429j');
        expect(addr?.encodedLegacy()).toBe('1P3GQYtcWgZHrrJhUa4ctoQ3QoCU2F65nz');
    });

    it('Should parse Ok a valid mainnet cashaddr without prefix', () => {
        const isVal = PaymentAddress.isValid('qrcuqadqrzp2uztjl9wn5sthepkg22majyxw4gmv6p');
        expect(isVal).toBe(true);

        const addr = PaymentAddress.fromString('qrcuqadqrzp2uztjl9wn5sthepkg22majyxw4gmv6p');
        expect(addr).not.toBeUndefined();

        expect(addr?.encoded()).toBe('bitcoincash:qrcuqadqrzp2uztjl9wn5sthepkg22majyxw4gmv6p');
        expect(addr?.encodedCashAddr()).toBe('bitcoincash:qrcuqadqrzp2uztjl9wn5sthepkg22majyxw4gmv6p');
        expect(addr?.encodedCashTokens()).toBe('bitcoincash:zrcuqadqrzp2uztjl9wn5sthepkg22majypyxk429j');
        expect(addr?.encodedLegacy()).toBe('1P3GQYtcWgZHrrJhUa4ctoQ3QoCU2F65nz');
    });

    it('Should parse Ok a valid mainnet legacy address', () => {
        const isVal = PaymentAddress.isValid('1P3GQYtcWgZHrrJhUa4ctoQ3QoCU2F65nz');
        expect(isVal).toBe(true);

        const addr = PaymentAddress.fromString('1P3GQYtcWgZHrrJhUa4ctoQ3QoCU2F65nz');
        expect(addr).not.toBeUndefined();

        expect(addr?.encoded()).toBe('bitcoincash:qrcuqadqrzp2uztjl9wn5sthepkg22majyxw4gmv6p');
        expect(addr?.encodedCashAddr()).toBe('bitcoincash:qrcuqadqrzp2uztjl9wn5sthepkg22majyxw4gmv6p');
        expect(addr?.encodedCashTokens()).toBe('bitcoincash:zrcuqadqrzp2uztjl9wn5sthepkg22majypyxk429j');
        expect(addr?.encodedLegacy()).toBe('1P3GQYtcWgZHrrJhUa4ctoQ3QoCU2F65nz');
    });

});
