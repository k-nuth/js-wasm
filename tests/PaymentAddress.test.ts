// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { PaymentAddress, Script, HashFunctions, hexStrToBytes, decodeHash, Hash } from '..';

describe('PaymentAddress', () => {

    it('Should convert address to script hash', () => {
        //TODO: implement addressToScriptHash somewhere
        function addressToScriptHash(address: string): string | undefined {
            const addr = PaymentAddress.fromString(address);
            if ( ! addr) return undefined;
            const pubKeyHash = addr.hash;
            const scriptPubKeyOps = Script.toPayPublicKeyHashPattern(pubKeyHash);
            const scriptPubKey = Script.fromOperations(scriptPubKeyOps);
            if ( ! scriptPubKey) return undefined;
            const scriptPubKeyBytes = scriptPubKey.toBytes();
            // sha256 the bytes, do not use knuth for it
            const hashStr = HashFunctions.sha256ReversedStr(scriptPubKeyBytes);
            return hashStr;
        }

        const address = "bitcoincash:qrtq2f2mktjuvufj5pwqyyp0u4twp5zhss0f3a5wwn";
        const hashStr = addressToScriptHash(address);
        expect(hashStr).toBe('bc35b02e5eb33d145136f456c0ff818024cde479be833d0786ad3fae8b418588');

        const hashStr2 = addressToScriptHash(address);
        expect(hashStr2).toBe('bc35b02e5eb33d145136f456c0ff818024cde479be833d0786ad3fae8b418588');

    });

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
        expect(addr?.encodedLegacy()).toBe('');// In fact a 32-byte address is not representable in legacy encoding.
    });

    it('Should handle 32-byte CashAddr correctly for mainnet', () => {
        const addr0 = PaymentAddress.fromString('bitcoincash:pdqkjcax9f3cjgcw9d4mypv8n9q4lzmlgpuuaxtfpm2s0y2klrn5zkz2ht9gj');
        expect(addr0?.encodedCashAddr()).toBe('bitcoincash:pdqkjcax9f3cjgcw9d4mypv8n9q4lzmlgpuuaxtfpm2s0y2klrn5zkz2ht9gj');


        const hash = hexStrToBytes('416963a62a6389230e2b6bb2058799415f8b7f4079ce99690ed5079156f8e741') as Hash;
        const addr = PaymentAddress.fromHash(hash, PaymentAddress.mainnetP2sh);
        expect(addr).not.toBeUndefined();
        expect(addr?.encodedCashAddr()).toBe('bitcoincash:pdqkjcax9f3cjgcw9d4mypv8n9q4lzmlgpuuaxtfpm2s0y2klrn5zkz2ht9gj');
        // bitcoincash:qdqkjcax9f3cjgcw9d4mypv8n9q4lzmlgpuuaxtfpm2s0y2klrn5zllyrn3sr
        // expect(addr?.encodedCashTokens()).toBe('bitcoincash:rvstqkm54dtvnpyqxt5m5n7sjsn4enrlxc526xyxlnjkaycdzfeu6hs99m6ed');
        // expect(addr?.encodedLegacy()).toBe('');// In fact a 32-byte address is not representable in legacy encoding.
    });








});
