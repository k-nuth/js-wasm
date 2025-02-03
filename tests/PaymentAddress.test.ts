// Copyright (c) 2016-2025 Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { PaymentAddress, Script, HashFunctions } from '..';

describe('PaymentAddress', () => {

    it('Should convert address to script hash', () => {
        //TODO: implement addressToScriptHash somewhere
        function addressToScriptHash(address: string): string | undefined {
            // console.log(`addressToScriptHash() - address: ${address}`);
            const addr = PaymentAddress.fromString(address);
            if ( ! addr) return undefined;
            const pubKeyHash = addr.hash;
            const scriptPubKeyOps = Script.toPayKeyHashPattern(pubKeyHash);
            const scriptPubKey = Script.fromOperations(scriptPubKeyOps);
            if ( ! scriptPubKey) return undefined;
            const scriptPubKeyBytes = scriptPubKey.toBytes();
            // sha256 the bytes, do not use knuth for it
            const hashStr = HashFunctions.sha256ReversedStr(scriptPubKeyBytes);
            // console.log(`hashStr: ${hashStr}`)
            return hashStr;
        }
        // const address = "bitcoincash:qz2kc5e0hn0jn4kcak99zvyl9zzvq9cpcceuq5ns70";
        // const hashStr = addressToScriptHash(address);
        // console.log(`hashStr: ${hashStr}`)
        // expect(hashStr).toBe('e866ff20723e8f5eab8b380e2f2272e925dfe3b79de9d555a42d194e3a5d77f8');

        const address = "bitcoincash:qrtq2f2mktjuvufj5pwqyyp0u4twp5zhss0f3a5wwn";
        const hashStr = addressToScriptHash(address);
        // console.log(`hashStr: ${hashStr}`)
        expect(hashStr).toBe('bc35b02e5eb33d145136f456c0ff818024cde479be833d0786ad3fae8b418588');
        // console.log(`----------------------------------------------------------------`)

        const hashStr2 = addressToScriptHash(address);
        // console.log(`hashStr2: ${hashStr2}`)
        expect(hashStr2).toBe('bc35b02e5eb33d145136f456c0ff818024cde479be833d0786ad3fae8b418588');
        // console.log(`----------------------------------------------------------------`)

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
        expect(addr?.encodedLegacy()).toBe('34frpCV2v6wtzig9xx4Z9XJ6s4jU3zqwR7');// In fact a 32-byte address is not representable in legacy encoding.
    });

    // it('Should parse and encode CashAddr correctly for testnet', () => {
    //     const addr = PaymentAddress.fromString('bchtest:qpzz8n7jp6847yyx8t33matrgcsdx6c0cvleatp707');
    //     expect(addr).not.toBeUndefined();
    //     expect(addr?.encodedCashAddr()).toBe('bchtest:qpzz8n7jp6847yyx8t33matrgcsdx6c0cvleatp707');
    //     expect(addr?.encodedCashTokens()).toBe('bchtest:qpzz8n7jp6847yyx8t33matrgcsdx6c0cvleatp707');
    //     expect(addr?.encodedLegacy()).toBe('mmjF9M1saNs7vjCGaSDaDHvFAtTgUNtfrJ');
    // });

    // it('Should construct from secret and match expected legacy address', () => {
    //     const secret = '002688cc350a5333a87fa622eacec626c3d1c0ebf9f3793de3885fa254d7e393';
    //     const addr = PaymentAddress.fromSecret(secret);
    //     expect(addr).not.toBeUndefined();
    //     expect(addr?.encodedLegacy()).toBe('1PeChFbhxDD9NLbU21DfD55aQBC4ZTR3tE');
    // });

    // it('Should construct from secret (testnet) and match expected legacy address', () => {
    //     const secret = '002688cc350a5333a87fa622eacec626c3d1c0ebf9f3793de3885fa254d7e393';
    //     const addr = PaymentAddress.fromSecret(secret, 'testnet');
    //     expect(addr).not.toBeUndefined();
    //     expect(addr?.encodedLegacy()).toBe('n4A9zJggmEeQ9T55jaC32zHuGAnmSzPU2L');
    // });

    // it('Should construct from public key (compressed) and match expected legacy address', () => {
    //     const compressed = '03d24123978d696a6c964f2dcb1d1e000d4150102fbbcc37f020401e35fb4cb745';
    //     const addr = PaymentAddress.fromPublicKey(compressed);
    //     expect(addr).not.toBeUndefined();
    //     expect(addr?.encodedLegacy()).toBe('1PeChFbhxDD9NLbU21DfD55aQBC4ZTR3tE');
    // });

    // it('Should construct from public key (uncompressed) and match expected legacy address', () => {
    //     const uncompressed = '04d24123978d696a6c964f2dcb1d1e000d4150102fbbcc37f020401e35fb4cb74561a3362716303b0469f04c3d0e3cbc4b5b62a2da7add6ecc3b254404b12d2f83';
    //     const addr = PaymentAddress.fromPublicKey(uncompressed);
    //     expect(addr).not.toBeUndefined();
    //     expect(addr?.encodedLegacy()).toBe('1Em1SX7qQq1pTmByqLRafhL1ypx2V786tP');
    // });

    // it('Should construct from hash and match expected legacy address', () => {
    //     const hash = 'f85beb6356d0813ddb0dbb14230a249fe931a135';
    //     const addr = PaymentAddress.fromHash(hash);
    //     expect(addr).not.toBeUndefined();
    //     expect(addr?.encodedLegacy()).toBe('1PeChFbhxDD9NLbU21DfD55aQBC4ZTR3tE');
    // });

    // it('Should construct from script and match expected script address', () => {
    //     const script = 'dup hash160 [18c0bd8d1818f1bf99cb1df2269c645318ef7b73] equalverify checksig';
    //     const addr = PaymentAddress.fromScript(script);
    //     expect(addr).not.toBeUndefined();
    //     expect(addr?.encodedLegacy()).toBe('3CPSWnCGjkePffNyVptkv45Bx35SaAwm7d');
    // });
});
