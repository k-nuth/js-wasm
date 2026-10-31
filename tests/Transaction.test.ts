// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { Transaction, RuleFork, decodeHash, Utxo, PaymentAddress, TokenDataFungible, Script } from '..';
import { bytesToHexStr, hexStrToBytes, encodeHash } from '..';
import { bitcoinToSatoshis } from '..';
import { Transaction as SecurityTransaction } from '..';

const noRules = RuleFork.noRules;
const allRules = RuleFork.allRules;
const bip16_rule = RuleFork.bip16Rule;
const bip30_rule = RuleFork.bip30Rule;
const bip34_rule = RuleFork.bip34Rule;
const bip65_rule = RuleFork.bip65Rule;
const bip66_rule = RuleFork.bip66Rule;
const bip112_rule = RuleFork.bip112Rule;


describe('Transaction', () => {
    const signingFixtureHex = '0100000001c997a5e56e104102fa209c6a852dd90660a20b2d9c352423edce25857fcd3704000000004847304402204e45e16932b8af514961a1d3a1a25fdf3f4f7732e9d624c6c61548ab5fb8cd410220181522ec8eca07de4860a4acdd12909d831cc56cbbac4622082221a8768d1d0901ffffffff0200ca9a3b00000000434104ae1a62fe09c5f51b13905f07f06b99a2f7159b2225f374cd378d71302fa28414e7aab37397f554a7df5f142c21c1b7303b8a0626f1baded5c72a704f7e6cd84cac00286bee0000000043410411db93e1dcdb8a016b49840f8c53bc1eb68a382e97b1482ecad7b148a6909a5cb2e0eaddfb84ccf9744464f82e160bfa9b8b64f9d4c03f999b8643f656b412a3ac00000000';

    it('accepts a signing response that only changes unlocking bytecode', () => {
        const template = Transaction.fromData(hexStrToBytes(signingFixtureHex))!;
        const signed = template.clone()!;
        signed.inputs![0].script = Script.fromData(hexStrToBytes('0151'), false);
        expect(SecurityTransaction.hasSameSigningStructure(
            template as unknown as SecurityTransaction,
            signed as unknown as SecurityTransaction,
        )).toBe(true);
    });

    it.each([
        ['version', (tx: Transaction) => { tx.version = (tx.version ?? 0) + 1; }],
        ['locktime', (tx: Transaction) => { tx.locktime = (tx.locktime ?? 0) + 1; }],
        ['outpoint', (tx: Transaction) => { tx.inputs![0].previousOutput!.index! += 1; }],
        ['sequence', (tx: Transaction) => { tx.inputs![0].seq! -= 1; }],
        ['output value', (tx: Transaction) => { tx.outputs![0].value! += 1n; }],
        ['output script', (tx: Transaction) => { tx.outputs![0].script = Script.fromData(hexStrToBytes('51'), false); }],
    ])('rejects a wallet response with a modified %s', (_name, mutate) => {
        const template = Transaction.fromData(hexStrToBytes(signingFixtureHex))!;
        const signed = template.clone()!;
        mutate(signed);
        expect(SecurityTransaction.hasSameSigningStructure(
            template as unknown as SecurityTransaction,
            signed as unknown as SecurityTransaction,
        )).toBe(false);
    });

    it('Should return false if the transaction is not valid', () => {
        const tx = new Transaction();
        expect(tx.valid).toBe(false);
    });

    it('Should parse successfully a transaction', () => {
        const bytes = hexStrToBytes('0100000001c997a5e56e104102fa209c6a852dd90660a20b2d9c352423edce25857fcd3704000000004847304402204e45e16932b8af514961a1d3a1a25fdf3f4f7732e9d624c6c61548ab5fb8cd410220181522ec8eca07de4860a4acdd12909d831cc56cbbac4622082221a8768d1d0901ffffffff0200ca9a3b00000000434104ae1a62fe09c5f51b13905f07f06b99a2f7159b2225f374cd378d71302fa28414e7aab37397f554a7df5f142c21c1b7303b8a0626f1baded5c72a704f7e6cd84cac00286bee0000000043410411db93e1dcdb8a016b49840f8c53bc1eb68a382e97b1482ecad7b148a6909a5cb2e0eaddfb84ccf9744464f82e160bfa9b8b64f9d4c03f999b8643f656b412a3ac00000000');
        const tx = Transaction.fromData(bytes);
        expect(tx).not.toBeUndefined();
        if ( ! tx) return;
        expect(encodeHash(tx.hash)).toEqual('f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16');
        expect(tx.serializedSize(true)).toEqual(275);
        expect(tx.toData(true)).toEqual(bytes);
    });

    it('Should parse a transaction data with a fungible token', () => {
        const bytes = hexStrToBytes('0200000002dfccfc001e26de8a7bc721da137be217fcc23ed0c8f7571cd162652a04370f68100000006441950ff94a98b3afc0584bc9f92fbacdf1630f8e68d3efc7cc736785a496e3229704781fca48cd024d526a70daff20b49c685d7c7c7c9ec563afef2a666c2e772f61210294fe08ca0714a6f1cd85aafccce6b209479f5b2b62654d7811234f4fdcec91ffffffffffdfccfc001e26de8a7bc721da137be217fcc23ed0c8f7571cd162652a04370f681100000064417ad534797fe37dcc4b99002469e76dc74ce4a230f6f015832f991d2a94aa37f734cc8245a572e32acb7a30178cb59a087d239c54e6dfede08b5142e06cc9d72761210294fe08ca0714a6f1cd85aafccce6b209479f5b2b62654d7811234f4fdcec91ffffffffff032aca4b000000000048ef67bf363c2417af7fed5514fa1f489f845222f93d8a044a21b2706bba3c91464010fdc107aa20ed2817a9e00bb93f37f5ba30234d86fada217e08cdf6d5f9dfd230df9dccb75a8700000000000000001d6a0653554d4d4f4e14775392eea219e69f9278a0d634a87fc1852f17dec6c40000000000001976a914775392eea219e69f9278a0d634a87fc1852f17de88ac2a000000');
                                  // 0200000002dfccfc001e26de8a7bc721da137be217fcc23ed0c8f7571cd162652a04370f68100000006441950ff94a98b3afc0584bc9f92fbacdf1630f8e68d3efc7cc736785a496e3229704781fca48cd024d526a70daff20b49c685d7c7c7c9ec563afef2a666c2e772f61210294fe08ca0714a6f1cd85aafccce6b209479f5b2b62654d7811234f4fdcec91ffffffffffdfccfc001e26de8a7bc721da137be217fcc23ed0c8f7571cd162652a04370f681100000064417ad534797fe37dcc4b99002469e76dc74ce4a230f6f015832f991d2a94aa37f734cc8245a572e32acb7a30178cb59a087d239c54e6dfede08b5142e06cc9d72761210294fe08ca0714a6f1cd85aafccce6b209479f5b2b62654d7811234f4fdcec91ffffffffff032aca4b000000000023aa20ed2817a9e00bb93f37f5ba30234d86fada217e08cdf6d5f9dfd230df9dccb75a8700000000000000001d6a0653554d4d4f4e14775392eea219e69f9278a0d634a87fc1852f17dec6c40000000000001976a914775392eea219e69f9278a0d634a87fc1852f17de88ac2a000000

        // Tx: 02000000
        //     02
        //      Input0:  dfccfc001e26de8a7bc721da137be217fcc23ed0c8f7571cd162652a04370f68100000006441950ff94a98b3afc0584bc9f92fbacdf1630f8e68d3efc7cc736785a496e3229704781fca48cd024d526a70daff20b49c685d7c7c7c9ec563afef2a666c2e772f61210294fe08ca0714a6f1cd85aafccce6b209479f5b2b62654d7811234f4fdcec91ffffffffff
        //      Input1:  dfccfc001e26de8a7bc721da137be217fcc23ed0c8f7571cd162652a04370f681100000064417ad534797fe37dcc4b99002469e76dc74ce4a230f6f015832f991d2a94aa37f734cc8245a572e32acb7a30178cb59a087d239c54e6dfede08b5142e06cc9d72761210294fe08ca0714a6f1cd85aafccce6b209479f5b2b62654d7811234f4fdcec91ffffffffff
        //     03
        //      Output0: 2aca4b000000000048ef67bf363c2417af7fed5514fa1f489f845222f93d8a044a21b2706bba3c91464010fdc107aa20ed2817a9e00bb93f37f5ba30234d86fada217e08cdf6d5f9dfd230df9dccb75a87
        //      Output1: 00000000000000001d6a0653554d4d4f4e14775392eea219e69f9278a0d634a87fc1852f17de
        //      Output2: c6c40000000000001976a914775392eea219e69f9278a0d634a87fc1852f17de88ac
        //     2a000000

        // 81 + 38 + 34 = 153
        const tx = Transaction.fromData(bytes);
        expect(tx).not.toBeUndefined();
        if ( ! tx) return;
        expect(encodeHash(tx.hash)).toEqual('013981019bf8517d84126b155f2cdd1ee58a8b0c73fb7fbc9392a4797374efef');
        expect(tx.serializedSize(true)).toEqual(445);
        expect(tx.toData(true)).toEqual(bytes);

        expect(tx.inputs).not.toBeUndefined();
        if ( ! tx.inputs) return;
        expect(tx.outputs).not.toBeUndefined();
        if ( ! tx.outputs) return;

        expect(tx.inputs.length).toEqual(2);
        expect(tx.outputs?.length).toEqual(3);

        expect(bytesToHexStr(tx.inputs[0].toData(true))).toEqual('dfccfc001e26de8a7bc721da137be217fcc23ed0c8f7571cd162652a04370f68100000006441950ff94a98b3afc0584bc9f92fbacdf1630f8e68d3efc7cc736785a496e3229704781fca48cd024d526a70daff20b49c685d7c7c7c9ec563afef2a666c2e772f61210294fe08ca0714a6f1cd85aafccce6b209479f5b2b62654d7811234f4fdcec91ffffffffff');
        expect(bytesToHexStr(tx.inputs[1].toData(true))).toEqual('dfccfc001e26de8a7bc721da137be217fcc23ed0c8f7571cd162652a04370f681100000064417ad534797fe37dcc4b99002469e76dc74ce4a230f6f015832f991d2a94aa37f734cc8245a572e32acb7a30178cb59a087d239c54e6dfede08b5142e06cc9d72761210294fe08ca0714a6f1cd85aafccce6b209479f5b2b62654d7811234f4fdcec91ffffffffff')
        expect(bytesToHexStr(tx.outputs[0].toData(true))).toEqual('2aca4b000000000048ef67bf363c2417af7fed5514fa1f489f845222f93d8a044a21b2706bba3c91464010fdc107aa20ed2817a9e00bb93f37f5ba30234d86fada217e08cdf6d5f9dfd230df9dccb75a87')
        expect(bytesToHexStr(tx.outputs[1].toData(true))).toEqual('00000000000000001d6a0653554d4d4f4e14775392eea219e69f9278a0d634a87fc1852f17de')
        expect(bytesToHexStr(tx.outputs[2].toData(true))).toEqual('c6c40000000000001976a914775392eea219e69f9278a0d634a87fc1852f17de88ac')

        const output0 = tx.outputs[0];
        if ( ! output0.script) return;

        expect(output0.value).toEqual(bitcoinToSatoshis(0.04966954));
        expect(output0.tokenData).not.toBeUndefined();
        if ( ! output0.tokenData) return;
        expect(output0.tokenData.category).not.toBeUndefined();
        if ( ! output0.tokenData.category) return;
        expect(encodeHash(output0.tokenData.category)).toEqual('4046913cba6b70b2214a048a3df92252849f481ffa1455ed7faf17243c36bf67');

        expect(output0.tokenData.data).not.toBeUndefined();
        if ( ! output0.tokenData.data) return;
        expect(output0.tokenData.kind).toEqual('fungible');

        const tokenDataFungible = output0.tokenData.data as TokenDataFungible;
        expect(tokenDataFungible.amount).not.toBeUndefined();
        if ( ! tokenDataFungible.amount) return;
        expect(tokenDataFungible.amount).toEqual(1985n);

        const walletModified = tx.clone()!;
        const modifiedToken = walletModified.outputs![0].tokenData!.data as TokenDataFungible;
        modifiedToken.amount += 1n;
        expect(SecurityTransaction.hasSameSigningStructure(
            tx as unknown as SecurityTransaction,
            walletModified as unknown as SecurityTransaction,
        )).toBe(false);
    });
















});
