// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { activeFlagsForYear } from './current/currentFlags';

import { encodeHash, PaymentAddress, hexStrToBytes, Script, bytesToHexStr, Operation, Opcode } from '..';
import { Wallet } from '..';
import { Transaction } from '..';
import { bitcoinToSatoshis, satoshisToBitcoin } from '..';
import { SighashAlgorithm } from '..';
import { ScriptFlags } from '..';

describe('Wallet (current API: bigint script flags)', () => {
    const TEST_MNEMONIC = [
        'car', 'slab', 'tail', 'dirt', 'wife', 'custom', 'front',
        'shield', 'diet', 'pear', 'skull', 'vapor', 'gorilla', 'token', 'yard'
    ];

    const TEST_DERIVATION_PATH = "m/44'/145'/0'/0";
    const TEST_NETWORK = 'MAINNET';     //'TESTNET';

    let wallet: Wallet;

    beforeAll(async () => {
        wallet = new Wallet(TEST_MNEMONIC, TEST_DERIVATION_PATH, TEST_NETWORK);
    });

    it('should correctly instantiate with given mnemonic, derivation path, and network', () => {
        expect(wallet).toBeInstanceOf(Wallet);
    });




    it('getAddress should return PaymentAddress instance for given index', async () => {
        const address = await wallet.getAddress(0);
        expect(address).toBeInstanceOf(PaymentAddress);
        expect(address.encoded()).toBe('bitcoincash:qr9sawzzmstkluq9nqefsu7eqya4zk2w7udune2pmf');
    });

    it('getAddresses should return array of PaymentAddress instances', async () => {
        const addresses = await wallet.getAddresses(5);
        expect(Array.isArray(addresses)).toBeTruthy();
        expect(addresses).toHaveLength(5);

        expect(addresses.map(a => a.encoded())).toStrictEqual([
            'bitcoincash:qr9sawzzmstkluq9nqefsu7eqya4zk2w7udune2pmf',
            'bitcoincash:qpvmwrhxcdyyq64ar6kz46rejp0r2tjcwg8d462hum',
            'bitcoincash:qqftgwpz0wm45z3sumncfrzm0s3n7x5rcqq9350gd6',
            'bitcoincash:qrwelh5dw56rjnr3nnttfc45j0p0yv2a3vtuwu9nlt',
            'bitcoincash:qpawyf7fp6lhvhld5gtz74smm969fx2j2546uj60l0'])

        const addresses2nd = await wallet.getAddresses(5, 5);
        expect(Array.isArray(addresses2nd)).toBeTruthy();
        expect(addresses2nd).toHaveLength(5);

        expect(addresses2nd.map(a => a.encoded())).toStrictEqual([
            'bitcoincash:qqzhz2m6cg6au7r3hntjraqj4aj8akg3gvakarc69v',
            'bitcoincash:qpzf4kuq03js0tnug5z6e5q7zcfse6guagmhktuzcd',
            'bitcoincash:qr6jhutnh6jk7aphlyu9sq5f6zu2epj8uqpynlacwk',
            'bitcoincash:qrlfnn7f03n020yyvgyfqtq9fcu35wussq4ev4glfv',
            'bitcoincash:qrmn9ss3dsu79rws6j4jwa9qhdxrr4rqcqxxxvlnwx'])
    });







    it('...', async () => {

        const TEST_MNEMONIC = [
            'idea',
            'helmet',
            'affair',
            'produce',
            'stage',
            'orbit',
            'record',
            'cat',
            'family',
            'nation',
            'media',
            'hurry'
        ];

        const TEST_DERIVATION_PATH = "m/44'/145'/0'/0";
        const TEST_NETWORK = 'MAINNET';     //'TESTNET';
        const activeForks = activeFlagsForYear(2023); // 2023 Descartes-Upgrade9-CashTokens

        const wallet = new Wallet(TEST_MNEMONIC, TEST_DERIVATION_PATH, TEST_NETWORK);
        const addresses = await wallet.getAddresses(5);
        expect(Array.isArray(addresses)).toBeTruthy();
        expect(addresses).toHaveLength(5);
        const publicKeys = wallet.getPublicKeys(5);
        expect(Array.isArray(publicKeys)).toBeTruthy();
        expect(publicKeys).toHaveLength(5);

        expect(addresses.map(a => a.encoded())).toStrictEqual([
            'bitcoincash:qpm48yhw5gv7d8uj0zsdvd9g0lqc2tchmc865rk3k3',
            'bitcoincash:qrpre5fyhqqkvn7e3zc9x66cgaz5tz96lcsswazhcg',
            'bitcoincash:qzmgjenedksaxkr07hmx064xctl0nmt36y4l8pmcuz',
            'bitcoincash:qrnkcf4hhz7fjyrshkxac2dj39vqhupmkqfksmhqn6',
            'bitcoincash:qzvpgc232875pnpvx35mjrqc8pcedkwfrs7yx3nu5h'])

        expect(publicKeys.map(a => a.encoded)).toStrictEqual([
            '0294fe08ca0714a6f1cd85aafccce6b209479f5b2b62654d7811234f4fdcec91ff',
            '02378d9fbe840d7bde24844e992be485e9e52b1df409a36e9c74012cba9bf30466',
            '02b9b50bc872180c9afc592a7cc45100da1a127a5c65cb4fdc5cb34e6df4d4e202',
            '02a01aedc7da8d33b78c5697039a670653976bb639fa5adcebb6b4ce470de830a6',
            '03d49c795bcc06e9230cfd122800788a6cef5a5075d4b52c1908760625802324a6'])

        const realTxBytes = hexStrToBytes('0200000002dfccfc001e26de8a7bc721da137be217fcc23ed0c8f7571cd162652a04370f68100000006441950ff94a98b3afc0584bc9f92fbacdf1630f8e68d3efc7cc736785a496e3229704781fca48cd024d526a70daff20b49c685d7c7c7c9ec563afef2a666c2e772f61210294fe08ca0714a6f1cd85aafccce6b209479f5b2b62654d7811234f4fdcec91ffffffffffdfccfc001e26de8a7bc721da137be217fcc23ed0c8f7571cd162652a04370f681100000064417ad534797fe37dcc4b99002469e76dc74ce4a230f6f015832f991d2a94aa37f734cc8245a572e32acb7a30178cb59a087d239c54e6dfede08b5142e06cc9d72761210294fe08ca0714a6f1cd85aafccce6b209479f5b2b62654d7811234f4fdcec91ffffffffff032aca4b000000000048ef67bf363c2417af7fed5514fa1f489f845222f93d8a044a21b2706bba3c91464010fdc107aa20ed2817a9e00bb93f37f5ba30234d86fada217e08cdf6d5f9dfd230df9dccb75a8700000000000000001d6a0653554d4d4f4e14775392eea219e69f9278a0d634a87fc1852f17dec6c40000000000001976a914775392eea219e69f9278a0d634a87fc1852f17de88ac2a000000');

        const tx = Transaction.fromData(realTxBytes);
        expect(tx).not.toBeUndefined();
        if ( ! tx) return;
        expect(encodeHash(tx.hash)).toEqual('013981019bf8517d84126b155f2cdd1ee58a8b0c73fb7fbc9392a4797374efef');
        expect(tx.serializedSize(true)).toEqual(445);
        expect(tx.toData(true)).toEqual(realTxBytes);
        expect(tx?.inputs?.length).toEqual(2);
        expect(tx?.outputs?.length).toEqual(3);

        if ( ! tx.inputs) return;

        const prevTxBytes = hexStrToBytes('020000001153fd8159f0a37a8da0a7447ff65aeebbddfa0a2425899359eecf926c92fc9760000000004544746376a9142a18ef06b1b71b2e3797a96ace90a04b9b28c12b88ac67c0d1c0ce88c25288c0cdc0c788c0c6c0d095c0c6c0cc9490539502e80396c0cc7c94c0d3957ca268ffffffff53fd8159f0a37a8da0a7447ff65aeebbddfa0a2425899359eecf926c92fc9760010000004544746376a91446d705806989a61d22130bb8e347875954e586b688ac67c0d1c0ce88c25288c0cdc0c788c0c6c0d095c0c6c0cc9490539502e80396c0cc7c94c0d3957ca268ffffffff53fd8159f0a37a8da0a7447ff65aeebbddfa0a2425899359eecf926c92fc9760020000004544746376a91446d705806989a61d22130bb8e347875954e586b688ac67c0d1c0ce88c25288c0cdc0c788c0c6c0d095c0c6c0cc9490539502e80396c0cc7c94c0d3957ca268ffffffff4e4ee7e30ed696099531fa7d01122589e39b75d4e7fdbe7b7eefb7bd3354bbd10e0000004544746376a914a787a2774cb1c3b587f9048f66e7dc9f5743447388ac67c0d1c0ce88c25288c0cdc0c788c0c6c0d095c0c6c0cc9490539502e80396c0cc7c94c0d3957ca268ffffffff53fd8159f0a37a8da0a7447ff65aeebbddfa0a2425899359eecf926c92fc9760030000004544746376a9142a18ef06b1b71b2e3797a96ace90a04b9b28c12b88ac67c0d1c0ce88c25288c0cdc0c788c0c6c0d095c0c6c0cc9490539502e80396c0cc7c94c0d3957ca268ffffffff4e4ee7e30ed696099531fa7d01122589e39b75d4e7fdbe7b7eefb7bd3354bbd1080000004544746376a914828dc41d5ad55c56fd30ce3ab44829776f04241c88ac67c0d1c0ce88c25288c0cdc0c788c0c6c0d095c0c6c0cc9490539502e80396c0cc7c94c0d3957ca268ffffffff53fd8159f0a37a8da0a7447ff65aeebbddfa0a2425899359eecf926c92fc9760040000004544746376a91446d705806989a61d22130bb8e347875954e586b688ac67c0d1c0ce88c25288c0cdc0c788c0c6c0d095c0c6c0cc9490539502e80396c0cc7c94c0d3957ca268ffffffff4e4ee7e30ed696099531fa7d01122589e39b75d4e7fdbe7b7eefb7bd3354bbd1050000004544746376a914a5ce0231d0e0aae9f9e5a625679803e33a34452688ac67c0d1c0ce88c25288c0cdc0c788c0c6c0d095c0c6c0cc9490539502e80396c0cc7c94c0d3957ca268ffffffff4e4ee7e30ed696099531fa7d01122589e39b75d4e7fdbe7b7eefb7bd3354bbd1150000004544746376a9142a18ef06b1b71b2e3797a96ace90a04b9b28c12b88ac67c0d1c0ce88c25288c0cdc0c788c0c6c0d095c0c6c0cc9490539502e80396c0cc7c94c0d3957ca268ffffffff53fd8159f0a37a8da0a7447ff65aeebbddfa0a2425899359eecf926c92fc9760050000004544746376a91467e27c7fdcd270148f00119ca668298fc3cab14f88ac67c0d1c0ce88c25288c0cdc0c788c0c6c0d095c0c6c0cc9490539502e80396c0cc7c94c0d3957ca268ffffffff4e4ee7e30ed696099531fa7d01122589e39b75d4e7fdbe7b7eefb7bd3354bbd1040000004544746376a91445dc1424888bc49b34bed98023303cef1e08fb7088ac67c0d1c0ce88c25288c0cdc0c788c0c6c0d095c0c6c0cc9490539502e80396c0cc7c94c0d3957ca268ffffffff4e4ee7e30ed696099531fa7d01122589e39b75d4e7fdbe7b7eefb7bd3354bbd1100000004544746376a91445dc1424888bc49b34bed98023303cef1e08fb7088ac67c0d1c0ce88c25288c0cdc0c788c0c6c0d095c0c6c0cc9490539502e80396c0cc7c94c0d3957ca268ffffffff53fd8159f0a37a8da0a7447ff65aeebbddfa0a2425899359eecf926c92fc9760070000004544746376a91445dc1424888bc49b34bed98023303cef1e08fb7088ac67c0d1c0ce88c25288c0cdc0c788c0c6c0d095c0c6c0cc9490539502e80396c0cc7c94c0d3957ca268ffffffff53fd8159f0a37a8da0a7447ff65aeebbddfa0a2425899359eecf926c92fc9760060000004544746376a91445dc1424888bc49b34bed98023303cef1e08fb7088ac67c0d1c0ce88c25288c0cdc0c788c0c6c0d095c0c6c0cc9490539502e80396c0cc7c94c0d3957ca268ffffffff53fd8159f0a37a8da0a7447ff65aeebbddfa0a2425899359eecf926c92fc9760080000004544746376a9142a18ef06b1b71b2e3797a96ace90a04b9b28c12b88ac67c0d1c0ce88c25288c0cdc0c788c0c6c0d095c0c6c0cc9490539502e80396c0cc7c94c0d3957ca268ffffffff4e4ee7e30ed696099531fa7d01122589e39b75d4e7fdbe7b7eefb7bd3354bbd1070000004544746376a914a787a2774cb1c3b587f9048f66e7dc9f5743447388ac67c0d1c0ce88c25288c0cdc0c788c0c6c0d095c0c6c0cc9490539502e80396c0cc7c94c0d3957ca268ffffffff5eaf152fd2e936500a945c34408e6080c7e7377dda5b93d313406093563d61d5010000006441fff1552c961848acff9416e61b0af2ce74cd6bf30adca4102b8c3f67c1225681a760f9f0f94a5fa43867b751cda82f747061ef67746930341eec6949e3fe1a3861210294fe08ca0714a6f1cd85aafccce6b209479f5b2b62654d7811234f4fdcec91ffffffffff129fddd869000000004aef67bf363c2417af7fed5514fa1f489f845222f93d8a044a21b2706bba3c91464010fe59d30a00aa2020b05b74ab56c9848032e9ba4fd094275ccc7f3628ad1886fce56e930d1273cd87a153bf34000000004aef67bf363c2417af7fed5514fa1f489f845222f93d8a044a21b2706bba3c91464010fe10650500aa202485d28b822c7398883aefbb838c8e7c26cf15f73f3f04401e4fef9dd36a3adb87ce073423000000004aef67bf363c2417af7fed5514fa1f489f845222f93d8a044a21b2706bba3c91464010feb7990300aa202485d28b822c7398883aefbb838c8e7c26cf15f73f3f04401e4fef9dd36a3adb87da31e50a000000004aef67bf363c2417af7fed5514fa1f489f845222f93d8a044a21b2706bba3c91464010fe331d0100aa203bb24ff90b2219a260d0ee0a16867fd33469cf704f4902231b14e963ecbae3c4876d0f961c000000004aef67bf363c2417af7fed5514fa1f489f845222f93d8a044a21b2706bba3c91464010fe75ec0200aa2020b05b74ab56c9848032e9ba4fd094275ccc7f3628ad1886fce56e930d1273cd870e4267090000000048ef67bf363c2417af7fed5514fa1f489f845222f93d8a044a21b2706bba3c91464010fd25f6aa2090505755682059c0b7d9e2afefe15a33ce050e037dfccf73494f7494ff20273287f0b7c817000000004aef67bf363c2417af7fed5514fa1f489f845222f93d8a044a21b2706bba3c91464010feba6e0200aa202485d28b822c7398883aefbb838c8e7c26cf15f73f3f04401e4fef9dd36a3adb8715ed5a080000000048ef67bf363c2417af7fed5514fa1f489f845222f93d8a044a21b2706bba3c91464010fdb6daaa207d10cb2c6df2baa15fcd2f73ec32b4dab63d6300afa37db1647135bb7c1d14e38700365f070000000048ef67bf363c2417af7fed5514fa1f489f845222f93d8a044a21b2706bba3c91464010fdf9c0aa2020b05b74ab56c9848032e9ba4fd094275ccc7f3628ad1886fce56e930d1273cd8753450012000000004aef67bf363c2417af7fed5514fa1f489f845222f93d8a044a21b2706bba3c91464010fe50d70100aa20b106d48c4cab45a679c39e25435741e87e92dded910410c3099d8b8b8613447c87c6b89c060000000048ef67bf363c2417af7fed5514fa1f489f845222f93d8a044a21b2706bba3c91464010fd16adaa20512d166ae28eb78988a3fe38f2db595860850dc0d25e8238e535f6c02437eaea876671ae060000000048ef67bf363c2417af7fed5514fa1f489f845222f93d8a044a21b2706bba3c91464010fde6aeaa20512d166ae28eb78988a3fe38f2db595860850dc0d25e8238e535f6c02437eaea874a072210000000004aef67bf363c2417af7fed5514fa1f489f845222f93d8a044a21b2706bba3c91464010fe67a60100aa20512d166ae28eb78988a3fe38f2db595860850dc0d25e8238e535f6c02437eaea879d1b2210000000004aef67bf363c2417af7fed5514fa1f489f845222f93d8a044a21b2706bba3c91464010fe69a60100aa20512d166ae28eb78988a3fe38f2db595860850dc0d25e8238e535f6c02437eaea87a00d9e0e000000004aef67bf363c2417af7fed5514fa1f489f845222f93d8a044a21b2706bba3c91464010feb87e0100aa2020b05b74ab56c9848032e9ba4fd094275ccc7f3628ad1886fce56e930d1273cd87db3c1d050000000048ef67bf363c2417af7fed5514fa1f489f845222f93d8a044a21b2706bba3c91464010fde085aa203bb24ff90b2219a260d0ee0a16867fd33469cf704f4902231b14e963ecbae3c48720030000000000003eef67bf363c2417af7fed5514fa1f489f845222f93d8a044a21b2706bba3c91464010fdc10776a914775392eea219e69f9278a0d634a87fc1852f17de88ac8d8d4c00000000001976a914775392eea219e69f9278a0d634a87fc1852f17de88ac2a000000');
        const prevTx = Transaction.fromData(prevTxBytes);

        tx.inputs[0].script = Script.fromData(new Uint8Array(), false);
        tx.inputs[1].script = Script.fromData(new Uint8Array(), false);

        let outputPoint0 = tx.inputs[0].previousOutput;
        expect(outputPoint0).not.toBeUndefined();
        if ( ! outputPoint0) return;
        expect(outputPoint0.cachedOutput).toBeUndefined();
        expect(outputPoint0.index).toEqual(16);
        outputPoint0.cachedOutput = prevTx?.outputs?.[outputPoint0.index ?? 0];
        expect(outputPoint0.cachedOutput).not.toBeUndefined();
        const prevOut = outputPoint0.cachedOutput;

        // SIGHASH_UTXOS commits to EVERY input's prevout, so input 1 MUST also be
        // cached (previously only input 0 was, which produced a partial/invalid
        // sighash — see the native wallet_sighash_forensic tests). Cache input 1's
        // prevout (prevTx.outputs[17]) and require both to be present.
        let outputPoint1 = tx.inputs[1].previousOutput;
        expect(outputPoint1).not.toBeUndefined();
        if ( ! outputPoint1) return;
        expect(outputPoint1.index).toEqual(17);
        outputPoint1.cachedOutput = prevTx?.outputs?.[outputPoint1.index ?? 0];
        expect(outputPoint1.cachedOutput).not.toBeUndefined();
        const secret = wallet.getSecret(0);

        const prevoutScriptTest = Script.fromString("dup hash160 [775392eea219e69f9278a0d634a87fc1852f17de] equalverify checksig");
        const prevoutScript = prevOut?.script;
        expect(prevoutScript).not.toBeUndefined();
        if ( ! prevoutScript) return;

        expect(prevoutScript.toString(activeForks)).toEqual(prevoutScriptTest?.toString(activeForks));

        const index = 0;
        const sighashType = SighashAlgorithm.forkid | SighashAlgorithm.all | SighashAlgorithm.utxos;
        const bch = 0.000008;
        const value = bitcoinToSatoshis(bch);

        outputPoint1.cachedOutput = undefined;
        expect(Script.createEndorsementResult(
            secret, prevoutScript, tx, index, sighashType, activeForks, value, 'ecdsa'
        )).toEqual({ success: false, errorCode: 1001 });
        outputPoint1.cachedOutput = prevTx?.outputs?.[outputPoint1.index ?? 0];
        expect(outputPoint1.cachedOutput).not.toBeUndefined();

        // A pre-CashTokens upgrade cannot safely use SIGHASH_UTXOS: the native
        // guard must cross the same boundary as error 1002.
        expect(Script.createEndorsementResult(
            secret,
            prevoutScript,
            tx,
            index,
            sighashType,
            activeFlagsForYear(2022),
            value,
            'ecdsa'
        )).toEqual({ success: false, errorCode: 1002 });

        // The complete prevouts cannot reach the public C API (input.previous_output().validation.cache has no setter
        // there), so the endorsement is refused with its own code instead of signing an invalid digest.
        expect(Script.createEndorsementResult(
            secret, prevoutScript, tx, index, sighashType, activeForks, value, 'ecdsa'
        )).toEqual({ success: false, errorCode: 1003 });

        // A sighash that does not commit to the prevouts signs: deterministic, 64 bytes for schnorr.
        const plainSighash = SighashAlgorithm.forkid | SighashAlgorithm.all;
        const first = Script.createEndorsementResult(secret, prevoutScript, tx, index, plainSighash, activeForks, value, 'ecdsa');
        const second = Script.createEndorsementResult(secret, prevoutScript, tx, index, plainSighash, activeForks, value, 'ecdsa');
        expect(first.success).toBe(true);
        expect(second).toEqual(first);
        const schnorr = Script.createEndorsementResult(secret, prevoutScript, tx, index, plainSighash, activeForks, value, 'schnorr');
        expect(schnorr.success).toBe(true);
        expect(schnorr.success && schnorr.data.length).toBe(65);
    });

});
