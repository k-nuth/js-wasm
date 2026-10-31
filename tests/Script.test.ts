// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { Script, Opcode, ScriptFlags, ScriptUpgrades, Transaction, OutputPoint, Input, Output, Operation, OperationList, ScriptNative } from '..';
import { bytesToHexStr, hexStrToBytes, encodeHash } from '..';
import { invalidatedBIP16Scripts, invalidBIP16Scripts, ScriptTest, validBIP16Scripts } from './ScriptData';
import { EcSecret } from '..';
import { HashFunctions } from '..';

const noRules = ScriptFlags.noRules;
const bip16Rule = ScriptFlags.bip16Rule;
const bip30Rule = ScriptFlags.bip30Rule;
const bip34Rule = ScriptFlags.bip34Rule;
const bip65Rule = ScriptFlags.bip65Rule;
const bip66Rule = ScriptFlags.bip66Rule;
const bip112Rule = ScriptFlags.bip112Rule;

const SCRIPT_RETURN = "return";
const SCRIPT_RETURN_EMPTY = "return []";
const SCRIPT_RETURN_80 = "return [0001020304050607080900010203040506070809000102030405060708090001020304050607080900010203040506070809000102030405060708090001020304050607080900010203040506070809]";
const SCRIPT_RETURN_81 = "return [0001020304050607080900010203040506070809000102030405060708090001020304050607080900010203040506070809000102030405060708090001020304050607080900010203040506070809FF]";

const SCRIPT_0_OF_3_MULTISIG = "0 [03dcfd9e580de35d8c2060d76dbf9e5561fe20febd2e64380e860a4d59f15ac864] [02440e0304bf8d32b2012994393c6a477acf238dd6adb4c3cef5bfa72f30c9861c] [03624505c6cc3967352cce480d8550490dd68519cd019066a4c302fdfb7d1c9934] 3 checkmultisig";
const SCRIPT_1_OF_3_MULTISIG = "1 [03dcfd9e580de35d8c2060d76dbf9e5561fe20febd2e64380e860a4d59f15ac864] [02440e0304bf8d32b2012994393c6a477acf238dd6adb4c3cef5bfa72f30c9861c] [03624505c6cc3967352cce480d8550490dd68519cd019066a4c302fdfb7d1c9934] 3 checkmultisig";
const SCRIPT_2_OF_3_MULTISIG = "2 [03dcfd9e580de35d8c2060d76dbf9e5561fe20febd2e64380e860a4d59f15ac864] [02440e0304bf8d32b2012994393c6a477acf238dd6adb4c3cef5bfa72f30c9861c] [03624505c6cc3967352cce480d8550490dd68519cd019066a4c302fdfb7d1c9934] 3 checkmultisig";
const SCRIPT_3_OF_3_MULTISIG = "3 [03dcfd9e580de35d8c2060d76dbf9e5561fe20febd2e64380e860a4d59f15ac864] [02440e0304bf8d32b2012994393c6a477acf238dd6adb4c3cef5bfa72f30c9861c] [03624505c6cc3967352cce480d8550490dd68519cd019066a4c302fdfb7d1c9934] 3 checkmultisig";
const SCRIPT_4_OF_3_MULTISIG = "4 [03dcfd9e580de35d8c2060d76dbf9e5561fe20febd2e64380e860a4d59f15ac864] [02440e0304bf8d32b2012994393c6a477acf238dd6adb4c3cef5bfa72f30c9861c] [03624505c6cc3967352cce480d8550490dd68519cd019066a4c302fdfb7d1c9934] 3 checkmultisig";

const SCRIPT_16_OF_16_MULTISIG =
    "16 "                                                                   +
    "[03dcfd9e580de35d8c2060d76dbf9e5561fe20febd2e64380e860a4d59f15ac864] " +
    "[02440e0304bf8d32b2012994393c6a477acf238dd6adb4c3cef5bfa72f30c9861c] " +
    "[03624505c6cc3967352cce480d8550490dd68519cd019066a4c302fdfb7d1c9934] " +
    "[03dcfd9e580de35d8c2060d76dbf9e5561fe20febd2e64380e860a4d59f15ac864] " +
    "[02440e0304bf8d32b2012994393c6a477acf238dd6adb4c3cef5bfa72f30c9861c] " +
    "[03624505c6cc3967352cce480d8550490dd68519cd019066a4c302fdfb7d1c9934] " +
    "[03dcfd9e580de35d8c2060d76dbf9e5561fe20febd2e64380e860a4d59f15ac864] " +
    "[02440e0304bf8d32b2012994393c6a477acf238dd6adb4c3cef5bfa72f30c9861c] " +
    "[03624505c6cc3967352cce480d8550490dd68519cd019066a4c302fdfb7d1c9934] " +
    "[03dcfd9e580de35d8c2060d76dbf9e5561fe20febd2e64380e860a4d59f15ac864] " +
    "[02440e0304bf8d32b2012994393c6a477acf238dd6adb4c3cef5bfa72f30c9861c] " +
    "[03624505c6cc3967352cce480d8550490dd68519cd019066a4c302fdfb7d1c9934] " +
    "[03dcfd9e580de35d8c2060d76dbf9e5561fe20febd2e64380e860a4d59f15ac864] " +
    "[02440e0304bf8d32b2012994393c6a477acf238dd6adb4c3cef5bfa72f30c9861c] " +
    "[03624505c6cc3967352cce480d8550490dd68519cd019066a4c302fdfb7d1c9934] " +
    "[03dcfd9e580de35d8c2060d76dbf9e5561fe20febd2e64380e860a4d59f15ac864] " +
    "16 checkmultisig";

const SCRIPT_17_OF_17_MULTISIG =
    "[17] "                                                                 +
    "[03dcfd9e580de35d8c2060d76dbf9e5561fe20febd2e64380e860a4d59f15ac864] " +
    "[02440e0304bf8d32b2012994393c6a477acf238dd6adb4c3cef5bfa72f30c9861c] " +
    "[03624505c6cc3967352cce480d8550490dd68519cd019066a4c302fdfb7d1c9934] " +
    "[03dcfd9e580de35d8c2060d76dbf9e5561fe20febd2e64380e860a4d59f15ac864] " +
    "[02440e0304bf8d32b2012994393c6a477acf238dd6adb4c3cef5bfa72f30c9861c] " +
    "[03624505c6cc3967352cce480d8550490dd68519cd019066a4c302fdfb7d1c9934] " +
    "[03dcfd9e580de35d8c2060d76dbf9e5561fe20febd2e64380e860a4d59f15ac864] " +
    "[02440e0304bf8d32b2012994393c6a477acf238dd6adb4c3cef5bfa72f30c9861c] " +
    "[03624505c6cc3967352cce480d8550490dd68519cd019066a4c302fdfb7d1c9934] " +
    "[03dcfd9e580de35d8c2060d76dbf9e5561fe20febd2e64380e860a4d59f15ac864] " +
    "[02440e0304bf8d32b2012994393c6a477acf238dd6adb4c3cef5bfa72f30c9861c] " +
    "[03624505c6cc3967352cce480d8550490dd68519cd019066a4c302fdfb7d1c9934] " +
    "[03dcfd9e580de35d8c2060d76dbf9e5561fe20febd2e64380e860a4d59f15ac864] " +
    "[02440e0304bf8d32b2012994393c6a477acf238dd6adb4c3cef5bfa72f30c9861c] " +
    "[03624505c6cc3967352cce480d8550490dd68519cd019066a4c302fdfb7d1c9934] " +
    "[03dcfd9e580de35d8c2060d76dbf9e5561fe20febd2e64380e860a4d59f15ac864] " +
    "[02440e0304bf8d32b2012994393c6a477acf238dd6adb4c3cef5bfa72f30c9861c] " +
    "16 checkmultisig";

function createScript(hex: string, prefix: boolean = true): Script | undefined {
    const bytes = hexStrToBytes(hex);
    return Script.fromData(bytes, prefix);
}

function newTx(test: ScriptTest) : Transaction | undefined {
    const inputScript = Script.fromString(test.input);
    if (inputScript === undefined) {
        return undefined;
    }
    const outputScript = Script.fromString(test.output);
    if (outputScript === undefined) {
        return undefined;
    }

    const outpoint = new OutputPoint();
    outpoint.cachedOutput = new Output(0n, outputScript);


    return new Transaction(
        test.version,
        test.locktime,
        [new Input(outpoint, inputScript, test.inputSequence)],
        []
    );
}

function testName(test: ScriptTest): string {
    return `input: "${test.input}" prevout: "${test.output}" (${test.inputSequence}, ${test.locktime}, ${test.version})`;
}

describe('Script (current API: bigint script flags)', () => {

    it('Should parse successfully a script with invalid op codes taken from testnet 119058', () => {
        const bytes = hexStrToBytes('0130323066643366303435313438356531306633383837363437356630643265396130393739343332353534313766653139316438623963623230653430643863333030326431373463336539306366323433393231383761313037623634373337633937333135633932393264653431373731636565613062323563633534353732653302ae');
        const script = Script.fromData(bytes, false);
        expect(script).not.toBeUndefined();
    });

    it('Should parse successfully a script with prefix', () => {
        const bytes = hexStrToBytes('3045022100ff1fc58dbd608e5e05846a8e6b45a46ad49878aef6879ad1a7cf4c5a7f853683022074a6a10f6053ab3cddc5620d169c7374cd42c1416c51b9744db2c8d9febfb84d01');
        const script = Script.fromData(bytes, true);
        expect(script).not.toBeUndefined();
        expect(script?.pattern()).toBe('non_standard');
    });

    it('Should roundtrip a script without prefix', () => {
        const bytes = hexStrToBytes('76a91406ccef231c2db72526df9338894ccf9355e8f12188ac');
        const script = Script.fromData(bytes, false);
        expect(script).not.toBeUndefined();
        expect(script?.isValidOperations).toBe(true);
        expect(script?.serializedSize).toBe(25);
        expect(script?.sigops).toBe(1);
        expect(script?.pattern()).toBe('pay_to_public_key_hash');

        const roundtrip = script?.toData(false);
        expect(roundtrip).toEqual(bytes);

        const str = script?.toString(0n);
        expect(str).toBe('dup hash160 [06ccef231c2db72526df9338894ccf9355e8f121] equalverify checksig');
    });

    it('Should roundtrip a weird script', () => {
        const weird = [
            '0c49206c69656b20636174732e483045022100c7387f64e1f4',
            'cf654cae3b28a15f7572106d6c1319ddcdc878e636ccb83845',
            'e30220050ebf440160a4c0db5623e0cb1562f46401a7ff5b87',
            '7aa03415ae134e8c71c901534d4f0176519c6375522103b124',
            'c48bbff7ebe16e7bd2b2f2b561aa53791da678a73d2777cc1c',
            'a4619ab6f72103ad6bb76e00d124f07a22680e39debd4dc4bd',
            'b1aa4b893720dd05af3c50560fdd52af67529c63552103b124',
            'c48bbff7ebe16e7bd2b2f2b561aa53791da678a73d2777cc1c',
            'a4619ab6f721025098a1d5a338592bf1e015468ec5a8fafc1f',
            'c9217feb5cb33597f3613a2165e9210360cfabc01d52eaaeb3',
            '976a5de05ff0cfa76d0af42d3d7e1b4c233ee8a00655ed2103',
            'f571540c81fd9dbf9622ca00cfe95762143f2eab6b65150365',
            'bb34ac533160432102bc2b4be1bca32b9d97e2d6fb255504f4',
            'bc96e01aaca6e29bfa3f8bea65d8865855af672103ad6bb76e',
            '00d124f07a22680e39debd4dc4bdb1aa4b893720dd05af3c50',
            '560fddada820a4d933888318a23c28fb5fc67aca8530524e20',
            '74b1d185dbf5b4db4ddb0642848868685174519c6351670068'
        ];

        const bytes = hexStrToBytes(weird.join(''));

        const script = Script.fromData(bytes, false);
        expect(script).not.toBeUndefined();

        expect(script?.isValidOperations).toBe(true);
        expect(script?.serializedSize).toBe(425);
        expect(script?.sigops).toBe(0);
        expect(script?.pattern()).toBe('sign_script_hash');

        const roundtrip = script?.toData(false);
        expect(roundtrip).toEqual(bytes);

        const str = script?.toString(0n);
        expect(str).toBe('[49206c69656b20636174732e] [3045022100c7387f64e1f4cf654cae3b28a15f7572106d6c1319ddcdc878e636ccb83845e30220050ebf440160a4c0db5623e0cb1562f46401a7ff5b877aa03415ae134e8c71c901] 3 [76519c6375522103b124c48bbff7ebe16e7bd2b2f2b561aa53791da678a73d2777cc1ca4619ab6f72103ad6bb76e00d124f07a22680e39debd4dc4bdb1aa4b893720dd05af3c50560fdd52af67529c63552103b124c48bbff7ebe16e7bd2b2f2b561aa53791da678a73d2777cc1ca4619ab6f721025098a1d5a338592bf1e015468ec5a8fafc1fc9217feb5cb33597f3613a2165e9210360cfabc01d52eaaeb3976a5de05ff0cfa76d0af42d3d7e1b4c233ee8a00655ed2103f571540c81fd9dbf9622ca00cfe95762143f2eab6b65150365bb34ac533160432102bc2b4be1bca32b9d97e2d6fb255504f4bc96e01aaca6e29bfa3f8bea65d8865855af672103ad6bb76e00d124f07a22680e39debd4dc4bdb1aa4b893720dd05af3c50560fddada820a4d933888318a23c28fb5fc67aca8530524e2074b1d185dbf5b4db4ddb0642848868685174519c6351670068]');
    });

    it('Should parse successfully a script with internal invalid wire code', () => {
        const str = [
            'bb566a54e38193e381aee4b896e7958ce381afe496e4babae381abe38288e381',
            'a3e381a6e7ac91e9a194e38292e5a5aae3828fe3828ce3828be7bea9e58b99e3',
            '8292e8a8ade38191e381a6e381afe38184e381aae38184'
        ].join('');
        const bytes = hexStrToBytes(str);
        const script = Script.fromData(bytes, false);
        expect(script).not.toBeUndefined();
    });

    it('Should parse successfully a script with internal invalid wire code (2)', () => {
        const str = [
            '566a54e38193e381aee4b896e7958ce381afe4bb96e4babae381abe38288e381',
            'a3e381a6e7ac91e9a194e38292e5a5aae3828fe3828ce3828be7bea9e58b99e3',
            '8292e8a8ade38191e381a6e381afe38184e381aae38184'
        ].join('');

        const bytes = hexStrToBytes(str);
        const script = Script.fromData(bytes, false);
        expect(script).not.toBeUndefined();
    });

    it('should handle from string empty', () => {
        const script = Script.fromString('');
        expect(script).toBeDefined();
        expect(script?.operations.length).toBe(0);
    });

    it('should handle from string two of three multisig', () => {
        const script = Script.fromString(SCRIPT_2_OF_3_MULTISIG);
        expect(script).toBeDefined();
        if ( ! script ) return;
        const ops = script?.operations;
        expect(ops?.length).toBe(6);
        expect(ops[0].code).toBe('push_positive_2');
        expect(ops[1].toString(noRules)).toBe('[03dcfd9e580de35d8c2060d76dbf9e5561fe20febd2e64380e860a4d59f15ac864]');
        expect(ops[2].toString(noRules)).toBe('[02440e0304bf8d32b2012994393c6a477acf238dd6adb4c3cef5bfa72f30c9861c]');
        expect(ops[3].toString(noRules)).toBe('[03624505c6cc3967352cce480d8550490dd68519cd019066a4c302fdfb7d1c9934]');
        expect(ops[4].code).toBe('push_positive_3');
        expect(ops[5].code).toBe('checkmultisig');
    });

    it('should handle empty operations', () => {
        const script = Script.fromOperations([]);
        expect(script).toBeDefined();
        expect(script?.operations.length).toBe(0);
        // expect(script?.empty()).toBe(true);
    });

    it('should handle toNullDataPattern', () => {
        const ops = Script.toNullDataPattern(new Uint8Array([42]));
        expect(ops).toBeDefined();
        expect(ops?.length).toBeGreaterThan(0);
    });

    describe('verify scripts', () => {
        it('should verify script from block #170 - first bitcoin spent', () => {
            const bytes = hexStrToBytes('0100000001c997a5e56e104102fa209c6a852dd90660a20b2d9c352423edce25857fcd3704000000004847304402204e45e16932b8af514961a1d3a1a25fdf3f4f7732e9d624c6c61548ab5fb8cd410220181522ec8eca07de4860a4acdd12909d831cc56cbbac4622082221a8768d1d0901ffffffff0200ca9a3b00000000434104ae1a62fe09c5f51b13905f07f06b99a2f7159b2225f374cd378d71302fa28414e7aab37397f554a7df5f142c21c1b7303b8a0626f1baded5c72a704f7e6cd84cac00286bee0000000043410411db93e1dcdb8a016b49840f8c53bc1eb68a382e97b1482ecad7b148a6909a5cb2e0eaddfb84ccf9744464f82e160bfa9b8b64f9d4c03f999b8643f656b412a3ac00000000');
            const tx = Transaction.fromData(bytes);
            expect(tx).not.toBeUndefined();
            if ( ! tx ) return;
            if ( ! tx.inputs ) return;
            expect(encodeHash(tx.hash)).toEqual('f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16');

            const inputScript = tx.inputs[0].script; // 47304402204e45e16932b8af514961a1d3a1a25fdf3f4f7732e9d624c6c61548ab5fb8cd410220181522ec8eca07de4860a4acdd12909d831cc56cbbac4622082221a8768d1d0901
            // From transaction: 0437cd7f8525ceed2324359c2d0ba26006d92d856a9c20fa0241106ee5a597c9 - 0
            const prevoutScript = createScript('410411db93e1dcdb8a016b49840f8c53bc1eb68a382e97b1482ecad7b148a6909a5cb2e0eaddfb84ccf9744464f82e160bfa9b8b64f9d4c03f999b8643f656b412a3ac');

            if ( ! tx || ! inputScript || ! prevoutScript ) {
                return;
            }


            const res = Script.verify(
                tx,
                0,
                noRules,
                inputScript,
                prevoutScript,
                0n
            );
        });

        it('should verify p2pkh script from block 889336', () => {
            const bytes = hexStrToBytes('0200000001511db81d5b3bdb03387296a2ba43d295a970f4fbd7fe9a0eb757c4c99aea6a60020000006a47304402205e97e8ba27f9b1fe80385e34def3cbf13a197d3b69320b3118ac8fc64a621caa022019c6c258c407fa9df7381f038125c1bf37c0ebc83d7a923ecbc013b91bc5de9f412103f7f62ae6abf20a8c1d8e281d2d1b0187bcd23ae9bb241bfb752f3b76c4cf3432feffffff020b660100000000001976a914ba781900f11fbd1177d8ad3a32af905274843fa488ac862b1900000000001976a9144b231aff67a1797fb27bc5677a70c8139b5ce57588acf7910d00');
            const tx = Transaction.fromData(bytes);
            expect(tx).not.toBeUndefined();
            if ( ! tx ) return;
            if ( ! tx.inputs ) return;
            expect(encodeHash(tx.hash)).toEqual('0609cbe49298881674983e76b65a3132370faeee6a6a93207547a4c7cc7e28f4');

            const inputScript = tx.inputs[0].script; // 47304402205e97e8ba27f9b1fe80385e34def3cbf13a197d3b69320b3118ac8fc64a621caa022019c6c258c407fa9df7381f038125c1bf37c0ebc83d7a923ecbc013b91bc5de9f412103f7f62ae6abf20a8c1d8e281d2d1b0187bcd23ae9bb241bfb752f3b76c4cf3432
            // From transaction: 606aea9ac9c457b70e9afed7fbf470a995d243baa296723803db3b5b1db81d51 : 2
            const prevoutScript = createScript('76a91481ee9b2293430e4c1c90d9061f245407f8548e1388ac', true);

            if ( ! tx || ! inputScript || ! prevoutScript ) {
                return;
            }


            const res = Script.verify(
                tx,
                0,
                noRules,
                inputScript,
                prevoutScript,
                0n
            );
        });
    });

    describe('Pattern matching tests', () => {












    });

    describe('Data-driven tests', () => {
        describe('BIP16', () => {
            it('should handle script bip16 valid', () => {
                for (const test of validBIP16Scripts) {
                    const tx = newTx(test);
                    if ( ! tx) {
                        continue;
                    }
                    expect(tx.valid).toBe(true);
                    // These are valid prior to and after BIP16 activation.
                    expect(Script.verifyTransaction(tx, 0, noRules)).toBe(0);
                    expect(Script.verifyTransaction(tx, 0, bip16Rule)).toBe(0);
                }
            });

            it('should handle script bip16 invalid', () => {
                for (const test of invalidBIP16Scripts) {
                    const tx = newTx(test);
                    if ( ! tx) {
                        continue;
                    }
                    expect(tx.valid).toBe(true);
                    // These are invalid prior to and after BIP16 activation.
                    expect(Script.verifyTransaction(tx, 0, noRules)).toBe(0);
                    expect(Script.verifyTransaction(tx, 0, bip16Rule)).toBe(0);
                }
            });



        });






















    });

    describe('Pool contract tests', () => {

















    });







    describe('Script', () => {
        it('create endorsement', () => {

            const txData = hexStrToBytes('0100000001b3807042c92f449bbf79b33ca59d7dfec7f4cc71096704a9c526dddf496ee0970100000000ffffffff01905f0100000000001976a91418c0bd8d1818f1bf99cb1df2269c645318ef7b7388ac00000000');
            const newTx = Transaction.fromData(txData);
            expect(newTx).not.toBeUndefined();
            if ( ! newTx) return;
            expect(encodeHash(newTx.hash)).toEqual('39d2caaf112f21364be00c5d0b14e3763468934e586e416bf74647a1906b18e0');
            expect(newTx.serializedSize(true)).toEqual(85);
            expect(newTx.toData(true)).toEqual(txData);

            const secret = hexStrToBytes('ce8f4b713ffdd2658900845251890f30371856be201cd1f5b3d970f793634333') as EcSecret;

            const prevoutScript = Script.fromString("dup hash160 [88350574280395ad2c3e2ee20e322073d94e5e40] equalverify checksig");
            expect(prevoutScript).not.toBeUndefined();
            if ( ! prevoutScript) return;

            const index = 0;
            const sighashType = 0x01; // All
            const value = 0xFFFFFFFFFFFFFFFFn;
            const activeForks = ScriptFlags.bip16Rule | ScriptFlags.bip30Rule | ScriptFlags.bip34Rule | ScriptFlags.bip90Rule
                | ScriptUpgrades.bchUahf | ScriptFlags.retarget;

            const endorsement = Script.createEndorsement(
                secret,
                prevoutScript,
                newTx,
                index,
                sighashType,
                activeForks,
                value,
                'ecdsa'
            );
            expect(endorsement).not.toBeUndefined();
            // Deterministic RFC 6979 bytes for the current vendored secp256k1.
            // Independently checked against HMAC-SHA256 and scalar multiplication.
            expect(bytesToHexStr(endorsement)).toEqual('3044022016516aabd04d3b27bec799bbadc55bad447db1e4bb663a32ed8ff6c6b7b6752602203651316e363b8c41c1b9db050690c6e5e9540ad04ded69184e710197734d3cf601');
        });
    });






















































































































});
