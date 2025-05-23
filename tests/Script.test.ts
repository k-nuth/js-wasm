// Copyright (c) 2016-2025 Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { Script, Opcode, RuleFork, Transaction, OutputPoint, Input, Output, Operation, OperationList, ScriptNative } from '..';
import { bytesToHexStr, hexStrToBytes, encodeHash } from '..';
import { invalidatedBIP16Scripts, invalidBIP16Scripts, ScriptTest, validBIP16Scripts } from './ScriptData';
import { EcSecret } from '..';
import { HashFunctions } from '..';

const noRules = RuleFork.noRules;
const allRules = RuleFork.allRules;
const bip16Rule = RuleFork.bip16Rule;
const bip30Rule = RuleFork.bip30Rule;
const bip34Rule = RuleFork.bip34Rule;
const bip65Rule = RuleFork.bip65Rule;
const bip66Rule = RuleFork.bip66Rule;
const bip112Rule = RuleFork.bip112Rule;

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

function createScript(hex: string): Script | undefined {
    const bytes = hexStrToBytes(hex);
    return Script.fromData(bytes, true);
}

function newTx(test: ScriptTest) : Transaction | undefined {
    const inputScript = Script.fromString(test.input);
    if (inputScript === undefined) {
        // console.log(`inputScript is undefined for test: ${test.input}`);
        return undefined;
    }
    const outputScript = Script.fromString(test.output);
    if (outputScript === undefined) {
        // console.log(`outputScript is undefined for test: ${test.output}`);
        return undefined;
    }

    const outpoint = new OutputPoint();
    outpoint.cachedOutput = new Output(0n, outputScript);

    // const nativeOps = OperationList.toNative(outputScript.operations);
    // console.log(`nativeOps.count(): ${nativeOps.count()}`);
    // const isP2SH = ScriptNative.isPayScriptHashPattern(nativeOps);
    // console.log(`isP2SH: ${isP2SH}`);

    // Construct transaction with one input and no outputs.
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

describe('Script', () => {

    it('Should parse successfully a script with invalid op codes taken from testnet 119058', () => {
        const bytes = hexStrToBytes('0130323066643366303435313438356531306633383837363437356630643265396130393739343332353534313766653139316438623963623230653430643863333030326431373463336539306366323433393231383761313037623634373337633937333135633932393264653431373731636565613062323563633534353732653302ae');
        const script = Script.fromData(bytes, false);
        expect(script).not.toBeUndefined();
    });

    it('Should parse successfully a script with prefix', () => {
        const bytes = hexStrToBytes('3045022100ff1fc58dbd608e5e05846a8e6b45a46ad49878aef6879ad1a7cf4c5a7f853683022074a6a10f6053ab3cddc5620d169c7374cd42c1416c51b9744db2c8d9febfb84d01');
        const script = Script.fromData(bytes, true);
        expect(script).not.toBeUndefined();
        expect(script?.type).toBe('non_standard');
    });

    it('Should roundtrip a script without prefix', () => {
        const bytes = hexStrToBytes('76a91406ccef231c2db72526df9338894ccf9355e8f12188ac');
        const script = Script.fromData(bytes, false);
        expect(script).not.toBeUndefined();
        expect(script?.isValidOperations).toBe(true);
        expect(script?.satoshiContentSize).toBe(25);
        expect(script?.serializedSize).toBe(25);
        expect(script?.sigops).toBe(1);
        expect(script?.type).toBe('pay_public_key_hash');

        const roundtrip = script?.toData(false);
        expect(roundtrip).toEqual(bytes);

        const str = script?.toString(0);
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
        expect(script?.satoshiContentSize).toBe(425);
        expect(script?.serializedSize).toBe(425);
        expect(script?.sigops).toBe(0);
        expect(script?.type).toBe('sign_script_hash');

        const roundtrip = script?.toData(false);
        expect(roundtrip).toEqual(bytes);

        const str = script?.toString(0);
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
        expect(ops.length).toBe(6);
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
        expect(ops.length).toBeGreaterThan(0);
    });

    describe('verify scripts', () => {
        it('should verify script from block #170 - first bitcoin spent', () => {
            const bytes = hexStrToBytes('0100000001c997a5e56e104102fa209c6a852dd90660a20b2d9c352423edce25857fcd3704000000004847304402204e45e16932b8af514961a1d3a1a25fdf3f4f7732e9d624c6c61548ab5fb8cd410220181522ec8eca07de4860a4acdd12909d831cc56cbbac4622082221a8768d1d0901ffffffff0200ca9a3b00000000434104ae1a62fe09c5f51b13905f07f06b99a2f7159b2225f374cd378d71302fa28414e7aab37397f554a7df5f142c21c1b7303b8a0626f1baded5c72a704f7e6cd84cac00286bee0000000043410411db93e1dcdb8a016b49840f8c53bc1eb68a382e97b1482ecad7b148a6909a5cb2e0eaddfb84ccf9744464f82e160bfa9b8b64f9d4c03f999b8643f656b412a3ac00000000');
            const tx = Transaction.fromData(bytes);
            expect(tx).not.toBeUndefined();
            if ( ! tx ) return;
            if ( ! tx.inputs ) return;
            expect(encodeHash(tx.hash)).toEqual('f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16');

            //const inputScript = createScript('47304402204e45e16932b8af514961a1d3a1a25fdf3f4f7732e9d624c6c61548ab5fb8cd410220181522ec8eca07de4860a4acdd12909d831cc56cbbac4622082221a8768d1d0901');
            const inputScript = tx.inputs[0].script; // 47304402204e45e16932b8af514961a1d3a1a25fdf3f4f7732e9d624c6c61548ab5fb8cd410220181522ec8eca07de4860a4acdd12909d831cc56cbbac4622082221a8768d1d0901
            // From transaction: 0437cd7f8525ceed2324359c2d0ba26006d92d856a9c20fa0241106ee5a597c9 - 0
            const prevoutScript = createScript('410411db93e1dcdb8a016b49840f8c53bc1eb68a382e97b1482ecad7b148a6909a5cb2e0eaddfb84ccf9744464f82e160bfa9b8b64f9d4c03f999b8643f656b412a3ac');

            if ( ! tx || ! inputScript || ! prevoutScript ) {
                return;
            }

            // console.log(inputScript.toString(0));
            // console.log(prevoutScript.toString(0));

            // static verify(tx: Transaction, input: number, forks: number, inputScript: Script, prevoutScript: Script, value: bigint): number {
            const res = Script.verify(
                tx,
                0,
                noRules,
                inputScript,
                prevoutScript,
                0n
            );
            // console.log(res);
        });

        it('should verify p2pkh script from block 889336', () => {
            const bytes = hexStrToBytes('0200000001511db81d5b3bdb03387296a2ba43d295a970f4fbd7fe9a0eb757c4c99aea6a60020000006a47304402205e97e8ba27f9b1fe80385e34def3cbf13a197d3b69320b3118ac8fc64a621caa022019c6c258c407fa9df7381f038125c1bf37c0ebc83d7a923ecbc013b91bc5de9f412103f7f62ae6abf20a8c1d8e281d2d1b0187bcd23ae9bb241bfb752f3b76c4cf3432feffffff020b660100000000001976a914ba781900f11fbd1177d8ad3a32af905274843fa488ac862b1900000000001976a9144b231aff67a1797fb27bc5677a70c8139b5ce57588acf7910d00');
            const tx = Transaction.fromData(bytes);
            expect(tx).not.toBeUndefined();
            if ( ! tx ) return;
            if ( ! tx.inputs ) return;
            expect(encodeHash(tx.hash)).toEqual('0609cbe49298881674983e76b65a3132370faeee6a6a93207547a4c7cc7e28f4');

            //const inputScript = createScript('47304402205e97e8ba27f9b1fe80385e34def3cbf13a197d3b69320b3118ac8fc64a621caa022019c6c258c407fa9df7381f038125c1bf37c0ebc83d7a923ecbc013b91bc5de9f412103f7f62ae6abf20a8c1d8e281d2d1b0187bcd23ae9bb241bfb752f3b76c4cf3432');
            const inputScript = tx.inputs[0].script; // 47304402205e97e8ba27f9b1fe80385e34def3cbf13a197d3b69320b3118ac8fc64a621caa022019c6c258c407fa9df7381f038125c1bf37c0ebc83d7a923ecbc013b91bc5de9f412103f7f62ae6abf20a8c1d8e281d2d1b0187bcd23ae9bb241bfb752f3b76c4cf3432
            // From transaction: 606aea9ac9c457b70e9afed7fbf470a995d243baa296723803db3b5b1db81d51 : 2
            const prevoutScript = createScript('76a91481ee9b2293430e4c1c90d9061f245407f8548e1388ac');

            if ( ! tx || ! inputScript || ! prevoutScript ) {
                return;
            }

            // console.log(inputScript.toString(0));
            // console.log(prevoutScript.toString(0));

            // static verify(tx: Transaction, input: number, forks: number, inputScript: Script, prevoutScript: Script, value: bigint): number {
            const res = Script.verify(
                tx,
                0,
                noRules,
                inputScript,
                prevoutScript,
                0n
            );
            // console.log(res);
        });
    });

    describe('Pattern matching tests', () => {
        // TODO: not implemented yet
        // it('should handle script pattern null data return only non standard', () => {
        //     const script = Script.fromString(SCRIPT_RETURN);
        //     expect(script).toBeDefined();
        //     expect(script?.outputPattern).toBe('non_standard');
        //     expect(script?.inputPattern).toBe('non_standard');
        //     expect(script?.pattern).toBe('non_standard');
        // });
        // TEST_CASE("script pattern  null data return only  non standard", "[script]") {
        //     script instance;
        //     instance.from_string(SCRIPT_RETURN);
        //     REQUIRE(instance.is_valid());
        //     REQUIRE(instance.output_pattern() == infrastructure::machine::script_pattern::non_standard);
        //     REQUIRE(instance.input_pattern() == infrastructure::machine::script_pattern::non_standard);
        //     REQUIRE(instance.pattern() == infrastructure::machine::script_pattern::non_standard);
        // }

        // TEST_CASE("script pattern  null data empty  null data", "[script]") {
        //     script instance;
        //     instance.from_string(SCRIPT_RETURN_EMPTY);
        //     REQUIRE(instance.is_valid());
        //     REQUIRE(instance.output_pattern() == infrastructure::machine::script_pattern::null_data);
        //     REQUIRE(instance.input_pattern() == infrastructure::machine::script_pattern::non_standard);
        //     REQUIRE(instance.pattern() == infrastructure::machine::script_pattern::null_data);
        // }

        // TEST_CASE("script pattern  null data 80 bytes  null data", "[script]") {
        //     script instance;
        //     instance.from_string(SCRIPT_RETURN_80);
        //     REQUIRE(instance.is_valid());
        //     REQUIRE(instance.output_pattern() == infrastructure::machine::script_pattern::null_data);
        //     REQUIRE(instance.input_pattern() == infrastructure::machine::script_pattern::non_standard);
        //     REQUIRE(instance.pattern() == infrastructure::machine::script_pattern::null_data);
        // }

        // TEST_CASE("script pattern  null data 81 bytes  non standard", "[script]") {
        //     script instance;
        //     instance.from_string(SCRIPT_RETURN_81);
        //     REQUIRE(instance.is_valid());
        //     REQUIRE(instance.output_pattern() == infrastructure::machine::script_pattern::non_standard);
        //     REQUIRE(instance.input_pattern() == infrastructure::machine::script_pattern::non_standard);
        //     REQUIRE(instance.pattern() == infrastructure::machine::script_pattern::non_standard);
        // }

        // // pay_multisig

        // TEST_CASE("script pattern  0 of 3 multisig  non standard", "[script]") {
        //     script instance;
        //     instance.from_string(SCRIPT_0_OF_3_MULTISIG);
        //     REQUIRE(instance.is_valid());
        //     REQUIRE(instance.output_pattern() == infrastructure::machine::script_pattern::non_standard);
        //     REQUIRE(instance.input_pattern() == infrastructure::machine::script_pattern::non_standard);
        //     REQUIRE(instance.pattern() == infrastructure::machine::script_pattern::non_standard);
        // }

        // TEST_CASE("script pattern  1 of 3 multisig  pay multisig", "[script]") {
        //     script instance;
        //     instance.from_string(SCRIPT_1_OF_3_MULTISIG);
        //     REQUIRE(instance.is_valid());
        //     REQUIRE(instance.output_pattern() == infrastructure::machine::script_pattern::pay_multisig);
        //     REQUIRE(instance.input_pattern() == infrastructure::machine::script_pattern::non_standard);
        //     REQUIRE(instance.pattern() == infrastructure::machine::script_pattern::pay_multisig);
        // }

        // TEST_CASE("script pattern  2 of 3 multisig  pay multisig", "[script]") {
        //     script instance;
        //     instance.from_string(SCRIPT_2_OF_3_MULTISIG);
        //     REQUIRE(instance.is_valid());
        //     REQUIRE(instance.output_pattern() == infrastructure::machine::script_pattern::pay_multisig);
        //     REQUIRE(instance.input_pattern() == infrastructure::machine::script_pattern::non_standard);
        //     REQUIRE(instance.pattern() == infrastructure::machine::script_pattern::pay_multisig);
        // }

        // TEST_CASE("script pattern  3 of 3 multisig  pay multisig", "[script]") {
        //     script instance;
        //     instance.from_string(SCRIPT_3_OF_3_MULTISIG);
        //     REQUIRE(instance.is_valid());
        //     REQUIRE(instance.output_pattern() == infrastructure::machine::script_pattern::pay_multisig);
        //     REQUIRE(instance.input_pattern() == infrastructure::machine::script_pattern::non_standard);
        //     REQUIRE(instance.pattern() == infrastructure::machine::script_pattern::pay_multisig);
        // }

        // TEST_CASE("script pattern  4 of 3 multisig  non standard", "[script]") {
        //     script instance;
        //     instance.from_string(SCRIPT_4_OF_3_MULTISIG);
        //     REQUIRE(instance.is_valid());
        //     REQUIRE(instance.output_pattern() == infrastructure::machine::script_pattern::non_standard);
        //     REQUIRE(instance.input_pattern() == infrastructure::machine::script_pattern::non_standard);
        //     REQUIRE(instance.pattern() == infrastructure::machine::script_pattern::non_standard);
        // }

        // TEST_CASE("script pattern  16 of 16 multisig  pay multisig", "[script]") {
        //     script instance;
        //     instance.from_string(SCRIPT_16_OF_16_MULTISIG);
        //     REQUIRE(instance.is_valid());
        //     REQUIRE(instance.output_pattern() == infrastructure::machine::script_pattern::pay_multisig);
        //     REQUIRE(instance.input_pattern() == infrastructure::machine::script_pattern::non_standard);
        //     REQUIRE(instance.pattern() == infrastructure::machine::script_pattern::pay_multisig);
        // }

        // TEST_CASE("script pattern  17 of 17 multisig  non standard", "[script]") {
        //     script instance;
        //     instance.from_string(SCRIPT_17_OF_17_MULTISIG);
        //     REQUIRE(instance.is_valid());
        //     REQUIRE(instance.output_pattern() == infrastructure::machine::script_pattern::non_standard);
        //     REQUIRE(instance.input_pattern() == infrastructure::machine::script_pattern::non_standard);
        //     REQUIRE(instance.pattern() == infrastructure::machine::script_pattern::non_standard);
        // }

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
                    expect(Script.verifyTransaction(tx, 0, allRules)).toBe(0);
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
                    expect(Script.verifyTransaction(tx, 0, allRules)).toBe(0);
                }
            });

            // it('should handle script bip16 invalidated', () => {
            //     //TODO: check invalidatedBIP16Scripts array
            //     expect(1).toEqual(2);
            //     for (const test of invalidatedBIP16Scripts) {
            //         const tx = newTx(test);
            //         if ( ! tx) {
            //             continue;
            //         }
            //         expect(tx.valid).toBe(true);
            //         // These are valid prior to BIP16 activation and invalid after.
            //         expect(Script.verifyTransaction(tx, 0, noRules)).toBe(0);
            //         expect(Script.verifyTransaction(tx, 0, bip16Rule)).toBe(0);
            //         expect(Script.verifyTransaction(tx, 0, allRules)).toBe(0);
            //     }
            // });

            // TEST_CASE("script bip16 invalidated", "[script]") {
            //     for (auto const& test : invalidated_bip16_scripts) {
            //         auto const tx = new_tx(test);
            //         auto const name = test_name(test);
            //         REQUIRE_MESSAGE(tx.is_valid(), name);

            //         // These are valid prior to BIP16 activation and invalid after.
            //         CHECK_MESSAGE(verify(tx, 0, rule_fork::no_rules) == error::success, name);
            //         CHECK_MESSAGE(verify(tx, 0, rule_fork::bip16_rule) != error::success, name);
            //         CHECK_MESSAGE(verify(tx, 0, rule_fork::all_rules) != error::success, name);
            //     }
            // }
        });

        // // bip65

        // TEST_CASE("script bip65 valid", "[script]") {
        //     for (auto const& test : valid_bip65_scripts) {
        //         auto const tx = new_tx(test);
        //         auto const name = test_name(test);
        //         REQUIRE_MESSAGE(tx.is_valid(), name);

        //         // These are valid prior to and after BIP65 activation.
        //         CHECK_MESSAGE(verify(tx, 0, rule_fork::no_rules) == error::success, name);
        //         CHECK_MESSAGE(verify(tx, 0, rule_fork::bip65_rule) == error::success, name);
        //         CHECK_MESSAGE(verify(tx, 0, rule_fork::all_rules) == error::success, name);
        //     }
        // }

        // TEST_CASE("script bip65 invalid", "[script]") {
        //     for (auto const& test : invalid_bip65_scripts) {
        //         auto const tx = new_tx(test);
        //         auto const name = test_name(test);
        //         REQUIRE_MESSAGE(tx.is_valid(), name);

        //         // These are invalid prior to and after BIP65 activation.
        //         CHECK_MESSAGE(verify(tx, 0, rule_fork::no_rules) != error::success, name);
        //         CHECK_MESSAGE(verify(tx, 0, rule_fork::bip65_rule) != error::success, name);
        //         CHECK_MESSAGE(verify(tx, 0, rule_fork::all_rules) != error::success, name);
        //     }
        // }

        // TEST_CASE("script bip65 invalidated", "[script]") {
        //     for (auto const& test : invalidated_bip65_scripts) {
        //         auto const tx = new_tx(test);
        //         auto const name = test_name(test);
        //         REQUIRE_MESSAGE(tx.is_valid(), name);

        //         // These are valid prior to BIP65 activation and invalid after.
        //         CHECK_MESSAGE(verify(tx, 0, rule_fork::no_rules) == error::success, name);
        //         CHECK_MESSAGE(verify(tx, 0, rule_fork::bip65_rule) != error::success, name);
        //         CHECK_MESSAGE(verify(tx, 0, rule_fork::all_rules) != error::success, name);
        //     }
        // }

        // // bip112
        // TEST_CASE("script bip112 valid", "[script]") {
        //     for (auto const& test : valid_bip112_scripts) {
        //         auto const tx = new_tx(test);
        //         auto const name = test_name(test);
        //         REQUIRE_MESSAGE(tx.is_valid(), name);

        //         // These are valid prior to and after BIP112 activation.
        //         CHECK_MESSAGE(verify(tx, 0, rule_fork::no_rules) == error::success, name);
        //         CHECK_MESSAGE(verify(tx, 0, rule_fork::bip112_rule) == error::success, name);
        //         CHECK_MESSAGE(verify(tx, 0, rule_fork::all_rules) == error::success, name);
        //     }
        // }

        // TEST_CASE("script bip112 invalid", "[script]") {
        //     for (auto const& test : invalid_bip112_scripts) {
        //         auto const tx = new_tx(test);
        //         auto const name = test_name(test);
        //         REQUIRE_MESSAGE(tx.is_valid(), name);

        //         // These are invalid prior to and after BIP112 activation.
        //         CHECK_MESSAGE(verify(tx, 0, rule_fork::no_rules) != error::success, name);
        //         CHECK_MESSAGE(verify(tx, 0, rule_fork::bip112_rule) != error::success, name);
        //         CHECK_MESSAGE(verify(tx, 0, rule_fork::all_rules) != error::success, name);
        //     }
        // }

        // TEST_CASE("script bip112 invalidated", "[script]") {
        //     for (auto const& test : invalidated_bip112_scripts) {
        //         auto const tx = new_tx(test);
        //         auto const name = test_name(test);
        //         REQUIRE_MESSAGE(tx.is_valid(), name);

        //         // These are valid prior to BIP112 activation and invalid after.
        //         CHECK_MESSAGE(verify(tx, 0, rule_fork::no_rules) == error::success, name);
        //         CHECK_MESSAGE(verify(tx, 0, rule_fork::bip112_rule) != error::success, name);
        //         CHECK_MESSAGE(verify(tx, 0, rule_fork::all_rules) != error::success, name);
        //     }
        // }

        // // context free: multisig
        // TEST_CASE("script multisig valid", "[script]") {
        //     for (auto const& test : valid_multisig_scripts) {
        //         auto const tx = new_tx(test);
        //         auto const name = test_name(test);
        //         REQUIRE_MESSAGE(tx.is_valid(), name);

        //         // These are always valid.
        //         // These are scripts potentially affected by bip66 (but should not be).
        //         CHECK_MESSAGE(verify(tx, 0, rule_fork::no_rules) == error::success, name);
        //         CHECK_MESSAGE(verify(tx, 0, rule_fork::bip66_rule) == error::success, name);
        //         CHECK_MESSAGE(verify(tx, 0, rule_fork::all_rules) == error::success, name);
        //     }
        // }

        // TEST_CASE("script multisig invalid", "[script]") {
        //     for (auto const& test : invalid_multisig_scripts) {
        //         auto const tx = new_tx(test);
        //         auto const name = test_name(test);
        //         REQUIRE_MESSAGE(tx.is_valid(), name);

        //         // These are always invalid.
        //         // These are scripts potentially affected by bip66 (but should not be).
        //         CHECK_MESSAGE(verify(tx, 0, rule_fork::no_rules) != error::success, name);
        //         CHECK_MESSAGE(verify(tx, 0, rule_fork::bip66_rule) != error::success, name);
        //         CHECK_MESSAGE(verify(tx, 0, rule_fork::all_rules) != error::success, name);
        //     }
        // }

        // // context free: other

        // TEST_CASE("script context free valid", "[script]") {
        //     for (auto const& test : valid_context_free_scripts) {
        //         auto const tx = new_tx(test);
        //         auto const name = test_name(test);
        //         REQUIRE_MESSAGE(tx.is_valid(), name);

        //         // These are always valid.
        //         CHECK_MESSAGE(verify(tx, 0, rule_fork::no_rules) == error::success, name);
        //         CHECK_MESSAGE(verify(tx, 0, rule_fork::all_rules) == error::success, name);
        //     }
        // }

        // TEST_CASE("script context free invalid", "[script]") {
        //     for (auto const& test : invalid_context_free_scripts) {
        //         auto const tx = new_tx(test);
        //         auto const name = test_name(test);
        //         REQUIRE_MESSAGE(tx.is_valid(), name);

        //         // These are always invalid.
        //         CHECK_MESSAGE(verify(tx, 0, rule_fork::no_rules) != error::success, name);
        //         CHECK_MESSAGE(verify(tx, 0, rule_fork::all_rules) != error::success, name);
        //     }
        // }
    });

    describe('Pool contract tests', () => {
        // it.only('should create a pool contract', () => {

        //     // const withdrawPkhStr = '775392eea219e69f9278a0d634a87fc1852f17de';
        //     const withdrawPkhStr = '2a18ef06b1b71b2e3797a96ace90a04b9b28c12b';

        //     const withdrawPkh = hexStrToBytes(withdrawPkhStr);
        //     // console.log(withdrawPkh);

        //     const contractOps : Array<Operation> = [
        //         Operation.fromString('depth')!,
        //         Operation.fromString('if')!,
        //     // It's a withdrawal
        //         Operation.fromString('dup')!,
        //         Operation.fromString('hash160')!,

        //         new Operation(withdrawPkh),

        //         Operation.fromString('equalverify')!,
        //         Operation.fromString('checksig')!,
        //         Operation.fromString('else')!,
        //     // It's a trade
        //         // Verify it is the correct category ID.
        //         Operation.fromString('input_index')!,
        //         Operation.fromString('output_token_category')!,
        //         Operation.fromString('input_index')!,
        //         Operation.fromString('utxo_token_category')!,
        //         Operation.fromString('equalverify')!,

        //         // Enforce version 2. Enforcing version is to make sure that tools that use this
        //         // contract stay compatible, when and if transaction format changes in the future.
        //         Operation.fromString('tx_version')!,
        //         Operation.fromString('2')!,
        //         Operation.fromString('equalverify')!,

        //         // Verify that this contract lives on on the output with the same input as this contract.
        //         Operation.fromString('input_index')!,
        //         Operation.fromString('output_bytecode')!,
        //         Operation.fromString('input_index')!,
        //         Operation.fromString('utxo_bytecode')!,
        //         Operation.fromString('equalverify')!,

        //         // Calculate target K
        //         Operation.fromString('input_index')!,
        //         Operation.fromString('utxo_value')!,
        //         Operation.fromString('input_index')!,
        //         Operation.fromString('utxo_token_amount')!,
        //         Operation.fromString('mul')!,

        //         // On stack: K
        //         // Calculate fee for trade. Fee is ~0.3%.
        //         // (abs(bch out - bch in) * 3) / 1000

        //         Operation.fromString('input_index')!,
        //         Operation.fromString('utxo_value')!,
        //         Operation.fromString('input_index')!,
        //         Operation.fromString('output_value')!,
        //         Operation.fromString('sub')!,
        //         Operation.fromString('abs')!,
        //         Operation.fromString('3')!,
        //         Operation.fromString('mul')!,
        //         Operation.fromString('1000')!,
        //         Operation.fromString('div')!,               // On stack: BCH FEE, target K

        //         // Get effective output K when including the fee.
        //         Operation.fromString('input_index')!,
        //         Operation.fromString('output_value')!,

        //         // Subtract fee
        //         Operation.fromString('swap')!,
        //         Operation.fromString('sub')!,

        //         Operation.fromString('input_index')!,
        //         Operation.fromString('output_token_amount')!,
        //         Operation.fromString('mul')!,

        //         // Verify that effective K > target K
        //         Operation.fromString('swap')!,
        //         Operation.fromString('greaterthanorequal')!,
        //         Operation.fromString('endif')!
        //     ];

        //     const contractScript = Script.fromOperations(contractOps);
        //     expect(contractScript).not.toBeUndefined();
        //     if ( ! contractScript) return;
        //     // expect(contractScript.toData(true)).toEqual(contractOps);

        //     const scriptBytes = contractScript.toData(false);
        //     const scriptStr = bytesToHexStr(scriptBytes);
        //     // expect(scriptStr).toEqual('746376a988ac67c0d1c0ce88c25288c0cdc0c788c0c6c0d095c0c6c0cc9490539502e80396c0cc7c94c0d3957ca268');
        //     expect(scriptStr).toEqual('746376a9142a18ef06b1b71b2e3797a96ace90a04b9b28c12b88ac67c0d1c0ce88c25288c0cdc0c788c0c6c0d095c0c6c0cc9490539502e80396c0cc7c94c0d3957ca268');

        //     const doubleHash = HashFunctions.sha256(HashFunctions.sha256(scriptBytes));
        //     const hashStr = bytesToHexStr(doubleHash);
        //     expect(hashStr).toEqual('20b05b74ab56c9848032e9ba4fd094275ccc7f3628ad1886fce56e930d1273cd');
        // });
    });

    // TEST_CASE("script create endorsement  single input single output  expected", "[script]") {
    //     data_chunk tx_data;
    //     decode_base16(tx_data, "0100000001b3807042c92f449bbf79b33ca59d7dfec7f4cc71096704a9c526dddf496ee0970100000000ffffffff01905f0100000000001976a91418c0bd8d1818f1bf99cb1df2269c645318ef7b7388ac00000000");
    //     transaction new_tx;
    //     REQUIRE(entity_from_data(new_tx, tx_data));

    //     script prevout_script;
    //     REQUIRE(prevout_script.from_string("dup hash160 [88350574280395ad2c3e2ee20e322073d94e5e40] equalverify checksig"));

    //     ec_secret const secret = hash_literal("ce8f4b713ffdd2658900845251890f30371856be201cd1f5b3d970f793634333");

    //     endorsement out;
    //     auto const index = 0u;
    //     auto const sighash_type = sighash_algorithm::all;
    //     REQUIRE(script::create_endorsement(out, secret, prevout_script, new_tx, index, sighash_type));

    //     auto const result = encode_base16(out);
    //     // auto const expected = "3045022100e428d3cc67a724cb6cfe8634aa299e58f189d9c46c02641e936c40cc16c7e8ed0220083949910fe999c21734a1f33e42fca15fb463ea2e08f0a1bccd952aacaadbb801";
    //     auto const expected = "304402200245ea46be39d72fed03c899aabc446b3c9baf93f57c2b382757856c3209854b0220795946074804a08c0053116eafe851c1a37b24414199afecf286f1eb4d82167801";

    //     REQUIRE(result == expected);
    // }

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
            // const version = 'unversioned';
            const value = BigInt(0xFFFFFFFFFFFFFFFF);
            const activeForks = 1073742030;

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
            // 304402200245ea46be39d72fed03c899aabc446b3c9baf93f57c2b382757856c3209854b0220795946074804a08c0053116eafe851c1a37b24414199afecf286f1eb4d82167801
            expect(bytesToHexStr(endorsement)).toEqual('3045022100cd687e8bae20f6f96e35923e0f3210c1a93f9222a16059f12b0346dc486b955702204899e9999090051233cd62d142b986d7390186c5b4f6265621c5f48f2053ddba01');
        });
    });



    // // Checksig tests.
    // //------------------------------------------------------------------------------

    // TEST_CASE("script checksig  single  uses one hash", "[script]") {
    //     // input 315ac7d4c26d69668129cc352851d9389b4a6868f1509c6c8b66bead11e2619f:1
    //     data_chunk tx_data;
    //     decode_base16(tx_data, "0100000002dc38e9359bd7da3b58386204e186d9408685f427f5e513666db735aa8a6b2169000000006a47304402205d8feeb312478e468d0b514e63e113958d7214fa572acd87079a7f0cc026fc5c02200fa76ea05bf243af6d0f9177f241caf606d01fcfd5e62d6befbca24e569e5c27032102100a1a9ca2c18932d6577c58f225580184d0e08226d41959874ac963e3c1b2feffffffffdc38e9359bd7da3b58386204e186d9408685f427f5e513666db735aa8a6b2169010000006b4830450220087ede38729e6d35e4f515505018e659222031273b7366920f393ee3ab17bc1e022100ca43164b757d1a6d1235f13200d4b5f76dd8fda4ec9fc28546b2df5b1211e8df03210275983913e60093b767e85597ca9397fb2f418e57f998d6afbbc536116085b1cbffffffff0140899500000000001976a914fcc9b36d38cf55d7d5b4ee4dddb6b2c17612f48c88ac00000000");
    //     transaction parent_tx;
    //     REQUIRE(entity_from_data(parent_tx, tx_data));

    //     data_chunk distinguished;
    //     decode_base16(distinguished, "30450220087ede38729e6d35e4f515505018e659222031273b7366920f393ee3ab17bc1e022100ca43164b757d1a6d1235f13200d4b5f76dd8fda4ec9fc28546b2df5b1211e8df");

    //     data_chunk pubkey;
    //     decode_base16(pubkey, "0275983913e60093b767e85597ca9397fb2f418e57f998d6afbbc536116085b1cb");

    //     data_chunk script_data;
    //     decode_base16(script_data, "76a91433cef61749d11ba2adf091a5e045678177fe3a6d88ac");

    //     script script_code;
    //     REQUIRE(entity_from_data(script_code, script_data, false));

    //     ec_signature signature;
    //     static auto const index = 1u;
    //     static auto const strict = true;
    //     REQUIRE(parse_signature(signature, distinguished, strict));
    //     REQUIRE(script::check_signature(signature, sighash_algorithm::single, pubkey, script_code, parent_tx, index));
    // }

    // TEST_CASE("script checksig  normal  success", "[script]") {
    //     // input 315ac7d4c26d69668129cc352851d9389b4a6868f1509c6c8b66bead11e2619f:0
    //     data_chunk tx_data;
    //     decode_base16(tx_data, "0100000002dc38e9359bd7da3b58386204e186d9408685f427f5e513666db735aa8a6b2169000000006a47304402205d8feeb312478e468d0b514e63e113958d7214fa572acd87079a7f0cc026fc5c02200fa76ea05bf243af6d0f9177f241caf606d01fcfd5e62d6befbca24e569e5c27032102100a1a9ca2c18932d6577c58f225580184d0e08226d41959874ac963e3c1b2feffffffffdc38e9359bd7da3b58386204e186d9408685f427f5e513666db735aa8a6b2169010000006b4830450220087ede38729e6d35e4f515505018e659222031273b7366920f393ee3ab17bc1e022100ca43164b757d1a6d1235f13200d4b5f76dd8fda4ec9fc28546b2df5b1211e8df03210275983913e60093b767e85597ca9397fb2f418e57f998d6afbbc536116085b1cbffffffff0140899500000000001976a914fcc9b36d38cf55d7d5b4ee4dddb6b2c17612f48c88ac00000000");
    //     transaction parent_tx;
    //     REQUIRE(entity_from_data(parent_tx, tx_data));

    //     data_chunk distinguished;
    //     decode_base16(distinguished, "304402205d8feeb312478e468d0b514e63e113958d7214fa572acd87079a7f0cc026fc5c02200fa76ea05bf243af6d0f9177f241caf606d01fcfd5e62d6befbca24e569e5c27");

    //     data_chunk pubkey;
    //     decode_base16(pubkey, "02100a1a9ca2c18932d6577c58f225580184d0e08226d41959874ac963e3c1b2fe");

    //     data_chunk script_data;
    //     decode_base16(script_data, "76a914fcc9b36d38cf55d7d5b4ee4dddb6b2c17612f48c88ac");

    //     script script_code;
    //     REQUIRE(entity_from_data(script_code, script_data, false));

    //     ec_signature signature;
    //     static auto const index = 0u;
    //     REQUIRE(parse_signature(signature, distinguished, true));
    //     REQUIRE(script::check_signature(signature, sighash_algorithm::single, pubkey, script_code, parent_tx, index));
    // }

    // TEST_CASE("script create endorsement  single input single output  expected", "[script]") {
    //     data_chunk tx_data;
    //     decode_base16(tx_data, "0100000001b3807042c92f449bbf79b33ca59d7dfec7f4cc71096704a9c526dddf496ee0970100000000ffffffff01905f0100000000001976a91418c0bd8d1818f1bf99cb1df2269c645318ef7b7388ac00000000");
    //     transaction new_tx;
    //     REQUIRE(entity_from_data(new_tx, tx_data));

    //     script prevout_script;
    //     REQUIRE(prevout_script.from_string("dup hash160 [88350574280395ad2c3e2ee20e322073d94e5e40] equalverify checksig"));

    //     ec_secret const secret = hash_literal("ce8f4b713ffdd2658900845251890f30371856be201cd1f5b3d970f793634333");

    //     endorsement out;
    //     auto const index = 0u;
    //     auto const sighash_type = sighash_algorithm::all;
    //     REQUIRE(script::create_endorsement(out, secret, prevout_script, new_tx, index, sighash_type));

    //     auto const result = encode_base16(out);
    //     // auto const expected = "3045022100e428d3cc67a724cb6cfe8634aa299e58f189d9c46c02641e936c40cc16c7e8ed0220083949910fe999c21734a1f33e42fca15fb463ea2e08f0a1bccd952aacaadbb801";
    //     auto const expected = "304402200245ea46be39d72fed03c899aabc446b3c9baf93f57c2b382757856c3209854b0220795946074804a08c0053116eafe851c1a37b24414199afecf286f1eb4d82167801";

    //     REQUIRE(result == expected);
    // }

    // TEST_CASE("script create endorsement  single input no output  expected", "[script]") {
    //     data_chunk tx_data;
    //     decode_base16(tx_data, "0100000001b3807042c92f449bbf79b33ca59d7dfec7f4cc71096704a9c526dddf496ee0970000000000ffffffff0000000000");
    //     transaction new_tx;
    //     REQUIRE(entity_from_data(new_tx, tx_data));

    //     script prevout_script;
    //     REQUIRE(prevout_script.from_string("dup hash160 [88350574280395ad2c3e2ee20e322073d94e5e40] equalverify checksig"));

    //     ec_secret const secret = hash_literal("ce8f4b713ffdd2658900845251890f30371856be201cd1f5b3d970f793634333");

    //     endorsement out;
    //     auto const index = 0u;
    //     auto const sighash_type = sighash_algorithm::all;
    //     REQUIRE(script::create_endorsement(out, secret, prevout_script, new_tx, index, sighash_type));

    //     auto const result = encode_base16(out);
    //     // auto const expected = "3045022100ba57820be5f0b93a0d5b880fbf2a86f819d959ecc24dc31b6b2d4f6ed286f253022071ccd021d540868ee10ca7634f4d270dfac7aea0d5912cf2b104111ac9bc756b01";
    //     auto const expected = "304402202d32085880e02b7f58a23db8a01eebfe105b6efda19e426960148d152ae67c76022028868ba8d97a4983252b247ae7f3203106c691a6ff83cc0f9b11289115ce4f3801";
    //     REQUIRE(result == expected);
    // }

    // TEST_CASE("script generate signature hash  all  expected", "[script]") {
    //     data_chunk tx_data;
    //     decode_base16(tx_data, "0100000001b3807042c92f449bbf79b33ca59d7dfec7f4cc71096704a9c526dddf496ee0970000000000ffffffff0000000000");
    //     transaction new_tx;
    //     REQUIRE(entity_from_data(new_tx, tx_data));

    //     script prevout_script;
    //     REQUIRE(prevout_script.from_string("dup hash160 [88350574280395ad2c3e2ee20e322073d94e5e40] equalverify checksig"));

    //     endorsement out;
    //     auto const index = 0u;
    //     auto const sighash_type = sighash_algorithm::all;
    //     auto const sighash = script::generate_signature_hash(new_tx, index, prevout_script, sighash_type);
    //     auto const result = encode_base16(sighash);
    //     auto const expected = "f89572635651b2e4f89778350616989183c98d1a721c911324bf9f17a0cf5bf0";
    //     REQUIRE(result == expected);
    // }

    // // Ad-hoc test cases.
    // //-----------------------------------------------------------------------------

    // TEST_CASE("script native  block 290329 tx valid", "[script]") {
    //     //// DEBUG [blockchain] Verify failed [290329] : stack false (find and delete).
    //     //// libconsensus : false
    //     //// forks        : 1073742030
    //     //// outpoint     : ab9805c6d57d7070d9a42c5176e47bb705023e6b67249fb6760880548298e742:0
    //     //// script       : a914d8dacdadb7462ae15cd906f1878706d0da8660e687
    //     //// inpoint      : 5df1375ffe61ac35ca178ebb0cab9ea26dedbd0e96005dfcee7e379fa513232f:1
    //     //// transaction  : 0100000002f9cbafc519425637ba4227f8d0a0b7160b4e65168193d5af39747891de98b5b5000000006b4830450221008dd619c563e527c47d9bd53534a770b102e40faa87f61433580e04e271ef2f960220029886434e18122b53d5decd25f1f4acb2480659fea20aabd856987ba3c3907e0121022b78b756e2258af13779c1a1f37ea6800259716ca4b7f0b87610e0bf3ab52a01ffffffff42e7988254800876b69f24676b3e0205b77be476512ca4d970707dd5c60598ab00000000fd260100483045022015bd0139bcccf990a6af6ec5c1c52ed8222e03a0d51c334df139968525d2fcd20221009f9efe325476eb64c3958e4713e9eefe49bf1d820ed58d2112721b134e2a1a53034930460221008431bdfa72bc67f9d41fe72e94c88fb8f359ffa30b33c72c121c5a877d922e1002210089ef5fc22dd8bfc6bf9ffdb01a9862d27687d424d1fefbab9e9c7176844a187a014c9052483045022015bd0139bcccf990a6af6ec5c1c52ed8222e03a0d51c334df139968525d2fcd20221009f9efe325476eb64c3958e4713e9eefe49bf1d820ed58d2112721b134e2a1a5303210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c7153aeffffffff01a08601000000000017a914d8dacdadb7462ae15cd906f1878706d0da8660e68700000000

    //     static auto const index = 1u;
    //     static auto const forks = static_cast<rule_fork>(1073742030);
    //     static auto const encoded_script = "a914d8dacdadb7462ae15cd906f1878706d0da8660e687";
    //     static auto const encoded_tx = "0100000002f9cbafc519425637ba4227f8d0a0b7160b4e65168193d5af39747891de98b5b5000000006b4830450221008dd619c563e527c47d9bd53534a770b102e40faa87f61433580e04e271ef2f960220029886434e18122b53d5decd25f1f4acb2480659fea20aabd856987ba3c3907e0121022b78b756e2258af13779c1a1f37ea6800259716ca4b7f0b87610e0bf3ab52a01ffffffff42e7988254800876b69f24676b3e0205b77be476512ca4d970707dd5c60598ab00000000fd260100483045022015bd0139bcccf990a6af6ec5c1c52ed8222e03a0d51c334df139968525d2fcd20221009f9efe325476eb64c3958e4713e9eefe49bf1d820ed58d2112721b134e2a1a53034930460221008431bdfa72bc67f9d41fe72e94c88fb8f359ffa30b33c72c121c5a877d922e1002210089ef5fc22dd8bfc6bf9ffdb01a9862d27687d424d1fefbab9e9c7176844a187a014c9052483045022015bd0139bcccf990a6af6ec5c1c52ed8222e03a0d51c334df139968525d2fcd20221009f9efe325476eb64c3958e4713e9eefe49bf1d820ed58d2112721b134e2a1a5303210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c7153aeffffffff01a08601000000000017a914d8dacdadb7462ae15cd906f1878706d0da8660e68700000000";

    //     data_chunk decoded_tx;
    //     REQUIRE(decode_base16(decoded_tx, encoded_tx));

    //     data_chunk decoded_script;
    //     REQUIRE(decode_base16(decoded_script, encoded_script));

    //     transaction tx;
    //     REQUIRE(entity_from_data(tx, decoded_tx));
    //     REQUIRE(tx.inputs().size() > index);

    //     auto const& input = tx.inputs()[index];
    //     auto& prevout = input.previous_output().validation.cache;

    //     prevout.set_script(create<script>(decoded_script, false));
    //     REQUIRE(prevout.script().is_valid());

    //     ////std::cout << prevout.script().to_string(forks) << std::endl;
    //     ////std::cout << input.script().to_string(forks) << std::endl;
    //     ////std::cout << input.witness().to_string() << std::endl;

    //     auto const result = verify(tx, index, forks);
    //     REQUIRE(result.value() == error::success);
    // }

    // TEST_CASE("script native  block 438513 tx valid", "[script]") {
    //     //// DEBUG [blockchain] Input validation failed (stack false)
    //     //// libconsensus : false
    //     //// forks        : 62
    //     //// outpoint     : 8e51d775e0896e03149d585c0655b3001da0c55068b0885139ac6ec34cf76ba0:0
    //     //// script       : a914faa558780a5767f9e3be14992a578fc1cbcf483087
    //     //// inpoint      : 6b7f50afb8448c39f4714a73d2b181d3e3233e84670bdfda8f141db668226c54:0
    //     //// transaction  : 0100000001a06bf74cc36eac395188b06850c5a01d00b355065c589d14036e89e075d7518e000000009d483045022100ba555ac17a084e2a1b621c2171fa563bc4fb75cd5c0968153f44ba7203cb876f022036626f4579de16e3ad160df01f649ffb8dbf47b504ee56dc3ad7260af24ca0db0101004c50632102768e47607c52e581595711e27faffa7cb646b4f481fe269bd49691b2fbc12106ad6704355e2658b1756821028a5af8284a12848d69a25a0ac5cea20be905848eb645fd03d3b065df88a9117cacfeffffff0158920100000000001976a9149d86f66406d316d44d58cbf90d71179dd8162dd388ac355e2658

    //     static auto const index = 0u;
    //     static auto const forks = static_cast<rule_fork>(62);
    //     static auto const encoded_script = "a914faa558780a5767f9e3be14992a578fc1cbcf483087";
    //     static auto const encoded_tx = "0100000001a06bf74cc36eac395188b06850c5a01d00b355065c589d14036e89e075d7518e000000009d483045022100ba555ac17a084e2a1b621c2171fa563bc4fb75cd5c0968153f44ba7203cb876f022036626f4579de16e3ad160df01f649ffb8dbf47b504ee56dc3ad7260af24ca0db0101004c50632102768e47607c52e581595711e27faffa7cb646b4f481fe269bd49691b2fbc12106ad6704355e2658b1756821028a5af8284a12848d69a25a0ac5cea20be905848eb645fd03d3b065df88a9117cacfeffffff0158920100000000001976a9149d86f66406d316d44d58cbf90d71179dd8162dd388ac355e2658";

    //     data_chunk decoded_tx;
    //     REQUIRE(decode_base16(decoded_tx, encoded_tx));

    //     data_chunk decoded_script;
    //     REQUIRE(decode_base16(decoded_script, encoded_script));

    //     transaction tx;
    //     REQUIRE(entity_from_data(tx, decoded_tx));
    //     REQUIRE(tx.inputs().size() > index);

    //     auto const& input = tx.inputs()[index];
    //     auto& prevout = input.previous_output().validation.cache;

    //     prevout.set_script(create<script>(decoded_script, false));
    //     REQUIRE(prevout.script().is_valid());

    //     auto const result = verify(tx, index, forks);
    //     REQUIRE(result.value() == error::success);
    // }

    // #if defined(KTH_SEGWIT_ENABLED)
    // // SEGWIT TESTS
    // TEST_CASE("script native  block 481824 tx valid", "[script]") {
    //     //// DEBUG [blockchain] Verify failed [481824] : stack false
    //     //// libconsensus : false
    //     //// forks        : 1073758206
    //     //// outpoint     : 42f7d0545ef45bd3b9cfee6b170cf6314a3bd8b3f09b610eeb436d92993ad440:1
    //     //// script       : a9142928f43af18d2d60e8a843540d8086b30534133987
    //     //// value        : 100200000
    //     //// inpoint      : c586389e5e4b3acb9d6c8be1c19ae8ab2795397633176f5a6442a261bbdefc3a:0
    //     //// transaction  : 0200000000010140d43a99926d43eb0e619bf0b3d83b4a31f60c176beecfb9d35bf45e54d0f7420100000017160014a4b4ca48de0b3fffc15404a1acdc8dbaae226955ffffffff0100e1f5050000000017a9144a1154d50b03292b3024370901711946cb7cccc387024830450221008604ef8f6d8afa892dee0f31259b6ce02dd70c545cfcfed8148179971876c54a022076d771d6e91bed212783c9b06e0de600fab2d518fad6f15a2b191d7fbd262a3e0121039d25ab79f41f75ceaf882411fd41fa670a4c672c23ffaf0e361a969cde0692e800000000

    //     static auto const index = 0u;
    //     static auto const value = 100200000u;
    //     static auto const forks = 1073758206u;
    //     static auto const encoded_script = "a9142928f43af18d2d60e8a843540d8086b30534133987";
    //     static auto const encoded_tx = "0200000000010140d43a99926d43eb0e619bf0b3d83b4a31f60c176beecfb9d35bf45e54d0f7420100000017160014a4b4ca48de0b3fffc15404a1acdc8dbaae226955ffffffff0100e1f5050000000017a9144a1154d50b03292b3024370901711946cb7cccc387024830450221008604ef8f6d8afa892dee0f31259b6ce02dd70c545cfcfed8148179971876c54a022076d771d6e91bed212783c9b06e0de600fab2d518fad6f15a2b191d7fbd262a3e0121039d25ab79f41f75ceaf882411fd41fa670a4c672c23ffaf0e361a969cde0692e800000000";

    //     data_chunk decoded_tx;
    //     REQUIRE(decode_base16(decoded_tx, encoded_tx));

    //     data_chunk decoded_script;
    //     REQUIRE(decode_base16(decoded_script, encoded_script));

    //     transaction tx;
    //     REQUIRE(entity_from_data(tx, decoded_tx, true, true));
    //     REQUIRE(tx.inputs().size() > index);

    //     auto const& input = tx.inputs()[index];
    //     auto& prevout = input.previous_output().validation.cache;

    //     prevout.set_value(value);
    //     prevout.set_script(create<script>(decoded_script, false));
    //     REQUIRE(prevout.script().is_valid());

    //     auto const result = verify(tx, index, forks);
    //     REQUIRE(result.value() == error::success);
    // }

    // TEST_CASE("script native  testnet block 892321 tx missing witness  invalid witness", "[script]") {
    //     //// DEBUG [blockchain] Verify failed [892321] : invalid witness
    //     //// libconsensus : false
    //     //// forks        : 1073758207
    //     //// outpoint     : fca5e8f5d6ce5201f45230268dfe6cbf8472932e63a001216e9002993acd08f5:0
    //     //// script       : 0020925fe0a6cde95bdc7a21b08925c246cae17005f8a013efffdb5e5cb7b7f8d0c2
    //     //// value        : 194445
    //     //// inpoint      : feecd68efcbbf1b81a99ca7b58410aa1477a46b0a03e4cfcea11b9dc538eb713:0
    //     //// transaction  : 0200000001f508cd3a9902906e2101a0632e937284bf6cfe8d263052f40152ced6f5e8a5fc0000000000ffffffff0105e4020000000000160014b6aa463696df9140b1191fa2cc1891cf9b5da6d900000000
    //     static auto const index = 0u;
    //     static auto const value = 194445u;
    //     static auto const forks = 1073758207u;
    //     static auto const encoded_script = "0020925fe0a6cde95bdc7a21b08925c246cae17005f8a013efffdb5e5cb7b7f8d0c2";
    //     static auto const encoded_tx = "0200000001f508cd3a9902906e2101a0632e937284bf6cfe8d263052f40152ced6f5e8a5fc0000000000ffffffff0105e4020000000000160014b6aa463696df9140b1191fa2cc1891cf9b5da6d900000000";

    //     data_chunk decoded_tx;
    //     REQUIRE(decode_base16(decoded_tx, encoded_tx));

    //     data_chunk decoded_script;
    //     REQUIRE(decode_base16(decoded_script, encoded_script));

    //     transaction tx;
    //     REQUIRE(entity_from_data(tx, decoded_tx, true, true));
    //     REQUIRE(tx.inputs().size() > index);

    //     auto const& input = tx.inputs()[index];
    //     auto& prevout = input.previous_output().validation.cache;

    //     prevout.set_value(value);
    //     prevout.set_script(create<script>(decoded_script, false));
    //     REQUIRE(prevout.script().is_valid());

    //     auto const result = verify(tx, index, forks);
    //     REQUIRE(result.value() == error::invalid_witness);
    // }

    // // bip143 test cases.
    // //-----------------------------------------------------------------------------

    // TEST_CASE("script native  bip143 native p2wpkh tx valid", "[script]") {
    //     transaction tx;
    //     data_chunk decoded_tx;
    //     data_chunk decoded_script;
    //     REQUIRE(decode_base16(decoded_tx, "01000000000102fff7f7881a8099afa6940d42d1e7f6362bec38171ea3edf433541db4e4ad969f00000000494830450221008b9d1dc26ba6a9cb62127b02742fa9d754cd3bebf337f7a55d114c8e5cdd30be022040529b194ba3f9281a99f2b1c0a19c0489bc22ede944ccf4ecbab4cc618ef3ed01eeffffffef51e1b804cc89d182d279655c3aa89e815b1b309fe287d9b2b55d57b90ec68a0100000000ffffffff02202cb206000000001976a9148280b37df378db99f66f85c95a783a76ac7a6d5988ac9093510d000000001976a9143bde42dbee7e4dbe6a21b2d50ce2f0167faa815988ac000247304402203609e17b84f6a7d30c80bfa610b5b4542f32a8a0d5447a12fb1366d7f01cc44a0220573a954c4518331561406f90300e8f3358f51928d43c212a8caed02de67eebee0121025476c2e83188368da1ff3e292e7acafcdb3566bb0ad253f62fc70f07aeee635711000000"));
    //     REQUIRE(entity_from_data(tx, decoded_tx, true, true));
    //     REQUIRE(tx.inputs().size() == 2u);

    //     auto& prevout0 = tx.inputs()[0].previous_output().validation.cache;
    //     REQUIRE(decode_base16(decoded_script, "2103c9f4836b9a4f77fc0d81f7bcb01b7f1b35916864b9476c241ce9fc198bd25432ac"));
    //     prevout0.set_script(create<script>(decoded_script, false));
    //     prevout0.set_value(625000000);
    //     REQUIRE(prevout0.script().is_valid());

    //     auto& prevout1 = tx.inputs()[1].previous_output().validation.cache;
    //     REQUIRE(decode_base16(decoded_script, "00141d0f172a0ecb48aee1be1f2687d2963ae33f71a1"));
    //     prevout1.set_script(create<script>(decoded_script, false));
    //     prevout1.set_value(600000000);
    //     REQUIRE(prevout1.script().is_valid());

    //     // ordinary P2PK (no rules required).
    //     auto result0 = verify(tx, 0, rule_fork::no_rules);
    //     REQUIRE(result0.value() == error::success);

    //     // P2WPKH witness program.
    //     auto result1 = verify(tx, 1, rule_fork::bip141_rule | rule_fork::bip143_rule);
    //     REQUIRE(result1.value() == error::success);

    //     // extra rules (okay).
    //     result0 = verify(tx, 0, rule_fork::bip141_rule | rule_fork::bip143_rule);
    //     REQUIRE(result0.value() == error::success);

    //     // missing bip143 (invalid sighash).
    //     result1 = verify(tx, 1, rule_fork::bip141_rule);
    //     REQUIRE(result1.value() == error::stack_false);

    //     // missing bip141 (witness not allowed).
    //     result1 = verify(tx, 1, rule_fork::bip143_rule);
    //     REQUIRE(result1.value() == error::unexpected_witness);

    //     // missing bip141 (witness not allowed).
    //     result1 = verify(tx, 1, rule_fork::no_rules);
    //     REQUIRE(result1.value() == error::unexpected_witness);
    // }

    // TEST_CASE("script native  bip143 p2sh p2wpkh tx valid", "[script]") {
    //     transaction tx;
    //     data_chunk decoded_tx;
    //     data_chunk decoded_script;
    //     REQUIRE(decode_base16(decoded_tx, "01000000000101db6b1b20aa0fd7b23880be2ecbd4a98130974cf4748fb66092ac4d3ceb1a5477010000001716001479091972186c449eb1ded22b78e40d009bdf0089feffffff02b8b4eb0b000000001976a914a457b684d7f0d539a46a45bbc043f35b59d0d96388ac0008af2f000000001976a914fd270b1ee6abcaea97fea7ad0402e8bd8ad6d77c88ac02473044022047ac8e878352d3ebbde1c94ce3a10d057c24175747116f8288e5d794d12d482f0220217f36a485cae903c713331d877c1f64677e3622ad4010726870540656fe9dcb012103ad1d8e89212f0b92c74d23bb710c00662ad1470198ac48c43f7d6f93a2a2687392040000"));
    //     REQUIRE(entity_from_data(tx, decoded_tx, true, true));
    //     REQUIRE(tx.inputs().size() == 1u);

    //     auto& prevout0 = tx.inputs()[0].previous_output().validation.cache;
    //     REQUIRE(decode_base16(decoded_script, "a9144733f37cf4db86fbc2efed2500b4f4e49f31202387"));
    //     prevout0.set_script(create<script>(decoded_script, false));
    //     prevout0.set_value(1000000000);
    //     REQUIRE(prevout0.script().is_valid());

    //     // P2SH-P2WPKH witness program.
    //     auto result0 = verify(tx, 0, rule_fork::bip16_rule | rule_fork::bip141_rule | rule_fork::bip143_rule);
    //     REQUIRE(result0.value() == error::success);

    //     // missing bip16 (required for p2sh, embedded witness not consumed).
    //     result0 = verify(tx, 0, rule_fork::bip141_rule | rule_fork::bip143_rule);
    //     REQUIRE(result0.value() == error::unexpected_witness);

    //     // missing bip141 (witness not allowed).
    //     result0 = verify(tx, 0, rule_fork::bip16_rule | rule_fork::bip143_rule);
    //     REQUIRE(result0.value() == error::unexpected_witness);

    //     // missing bip143 (invalid sighash).
    //     result0 = verify(tx, 0, rule_fork::bip16_rule | rule_fork::bip141_rule);
    //     REQUIRE(result0.value() == error::stack_false);
    // }

    // TEST_CASE("script native  bip143 native p2wsh 1 tx valid", "[script]") {
    //     transaction tx;
    //     data_chunk decoded_tx;
    //     data_chunk decoded_script;
    //     REQUIRE(decode_base16(decoded_tx, "01000000000102fe3dc9208094f3ffd12645477b3dc56f60ec4fa8e6f5d67c565d1c6b9216b36e000000004847304402200af4e47c9b9629dbecc21f73af989bdaa911f7e6f6c2e9394588a3aa68f81e9902204f3fcf6ade7e5abb1295b6774c8e0abd94ae62217367096bc02ee5e435b67da201ffffffff0815cf020f013ed6cf91d29f4202e8a58726b1ac6c79da47c23d1bee0a6925f80000000000ffffffff0100f2052a010000001976a914a30741f8145e5acadf23f751864167f32e0963f788ac000347304402200de66acf4527789bfda55fc5459e214fa6083f936b430a762c629656216805ac0220396f550692cd347171cbc1ef1f51e15282e837bb2b30860dc77c8f78bc8501e503473044022027dc95ad6b740fe5129e7e62a75dd00f291a2aeb1200b84b09d9e3789406b6c002201a9ecd315dd6a0e632ab20bbb98948bc0c6fb204f2c286963bb48517a7058e27034721026dccc749adc2a9d0d89497ac511f760f45c47dc5ed9cf352a58ac706453880aeadab210255a9626aebf5e29c0e6538428ba0d1dcf6ca98ffdf086aa8ced5e0d0215ea465ac00000000"));
    //     REQUIRE(entity_from_data(tx, decoded_tx, true, true));
    //     REQUIRE(tx.inputs().size() == 2u);

    //     auto& prevout0 = tx.inputs()[0].previous_output().validation.cache;
    //     REQUIRE(decode_base16(decoded_script, "21036d5c20fa14fb2f635474c1dc4ef5909d4568e5569b79fc94d3448486e14685f8ac"));
    //     prevout0.set_script(create<script>(decoded_script, false));
    //     prevout0.set_value(156250000);
    //     REQUIRE(prevout0.script().is_valid());

    //     auto& prevout1 = tx.inputs()[1].previous_output().validation.cache;
    //     REQUIRE(decode_base16(decoded_script, "00205d1b56b63d714eebe542309525f484b7e9d6f686b3781b6f61ef925d66d6f6a0"));
    //     prevout1.set_script(create<script>(decoded_script, false));
    //     prevout1.set_value(4900000000);
    //     REQUIRE(prevout1.script().is_valid());

    //     // ordinary P2PK (no rules required).
    //     auto result0 = verify(tx, 0, rule_fork::no_rules);
    //     REQUIRE(result0.value() == error::success);

    //     // native P2WSH witness program.
    //     auto result1 = verify(tx, 1, rule_fork::bip141_rule | rule_fork::bip143_rule);
    //     REQUIRE(result1.value() == error::success);

    //     // extra rules (okay).
    //     result0 = verify(tx, 0, rule_fork::bip16_rule | rule_fork::bip141_rule | rule_fork::bip143_rule);
    //     REQUIRE(result0.value() == error::success);

    //     // missing bip143 (code-seperator treatment).
    //     result1 = verify(tx, 1, rule_fork::bip141_rule);
    //     REQUIRE(result1.value() == error::incorrect_signature);

    //     // missing bip141 (witness not allowed).
    //     result1 = verify(tx, 1, rule_fork::bip143_rule);
    //     REQUIRE(result1.value() == error::unexpected_witness);
    // }

    // TEST_CASE("script native  bip143 native p2wsh 2 tx valid", "[script]") {
    //     transaction tx;
    //     data_chunk decoded_tx;
    //     data_chunk decoded_script;
    //     REQUIRE(decode_base16(decoded_tx, "01000000000102e9b542c5176808107ff1df906f46bb1f2583b16112b95ee5380665ba7fcfc0010000000000ffffffff80e68831516392fcd100d186b3c2c7b95c80b53c77e77c35ba03a66b429a2a1b0000000000ffffffff0280969800000000001976a914de4b231626ef508c9a74a8517e6783c0546d6b2888ac80969800000000001976a9146648a8cd4531e1ec47f35916de8e259237294d1e88ac02483045022100f6a10b8604e6dc910194b79ccfc93e1bc0ec7c03453caaa8987f7d6c3413566002206216229ede9b4d6ec2d325be245c5b508ff0339bf1794078e20bfe0babc7ffe683270063ab68210392972e2eb617b2388771abe27235fd5ac44af8e61693261550447a4c3e39da98ac024730440220032521802a76ad7bf74d0e2c218b72cf0cbc867066e2e53db905ba37f130397e02207709e2188ed7f08f4c952d9d13986da504502b8c3be59617e043552f506c46ff83275163ab68210392972e2eb617b2388771abe27235fd5ac44af8e61693261550447a4c3e39da98ac00000000"));
    //     REQUIRE(entity_from_data(tx, decoded_tx, true, true));

    //     auto& prevout0 = tx.inputs()[0].previous_output().validation.cache;
    //     REQUIRE(decode_base16(decoded_script, "0020ba468eea561b26301e4cf69fa34bde4ad60c81e70f059f045ca9a79931004a4d"));
    //     prevout0.set_script(create<script>(decoded_script, false));
    //     prevout0.set_value(16777215);
    //     REQUIRE(prevout0.script().is_valid());

    //     auto& prevout1 = tx.inputs()[1].previous_output().validation.cache;
    //     REQUIRE(decode_base16(decoded_script, "0020d9bbfbe56af7c4b7f960a70d7ea107156913d9e5a26b0a71429df5e097ca6537"));
    //     prevout1.set_script(create<script>(decoded_script, false));
    //     prevout1.set_value(16777215);
    //     REQUIRE(prevout1.script().is_valid());

    //     // native P2WSH witness program.
    //     auto result0 = verify(tx, 0, rule_fork::bip141_rule | rule_fork::bip143_rule);
    //     REQUIRE(result0.value() == error::success);

    //     // native P2WSH witness program.
    //     auto result1 = verify(tx, 1, rule_fork::bip141_rule | rule_fork::bip143_rule);
    //     REQUIRE(result1.value() == error::success);

    //     // extra rules (okay).
    //     result0 = verify(tx, 0, rule_fork::bip16_rule | rule_fork::bip141_rule | rule_fork::bip143_rule);
    //     REQUIRE(result0.value() == error::success);

    //     // extra rules (okay).
    //     result1 = verify(tx, 1, rule_fork::bip16_rule | rule_fork::bip141_rule | rule_fork::bip143_rule);
    //     REQUIRE(result1.value() == error::success);

    //     // missing bip143 (code-seperator treatment).
    //     result0 = verify(tx, 0, rule_fork::bip141_rule);
    //     REQUIRE(result0.value() == error::stack_false);

    //     // missing bip143 (code-seperator treatment).
    //     result1 = verify(tx, 1, rule_fork::bip141_rule);
    //     REQUIRE(result1.value() == error::stack_false);

    //     // missing bip141 (witness not allowed).
    //     result0 = verify(tx, 0, rule_fork::bip143_rule);
    //     REQUIRE(result0.value() == error::unexpected_witness);

    //     // missing bip141 (witness not allowed).
    //     result1 = verify(tx, 1, rule_fork::bip143_rule);
    //     REQUIRE(result1.value() == error::unexpected_witness);

    //     // This example shows how SINGLE|ANYONECANPAY does not commit to the input index (swap input indexes).
    //     REQUIRE(decode_base16(decoded_tx, "0100000000010280e68831516392fcd100d186b3c2c7b95c80b53c77e77c35ba03a66b429a2a1b0000000000ffffffffe9b542c5176808107ff1df906f46bb1f2583b16112b95ee5380665ba7fcfc0010000000000ffffffff0280969800000000001976a9146648a8cd4531e1ec47f35916de8e259237294d1e88ac80969800000000001976a914de4b231626ef508c9a74a8517e6783c0546d6b2888ac024730440220032521802a76ad7bf74d0e2c218b72cf0cbc867066e2e53db905ba37f130397e02207709e2188ed7f08f4c952d9d13986da504502b8c3be59617e043552f506c46ff83275163ab68210392972e2eb617b2388771abe27235fd5ac44af8e61693261550447a4c3e39da98ac02483045022100f6a10b8604e6dc910194b79ccfc93e1bc0ec7c03453caaa8987f7d6c3413566002206216229ede9b4d6ec2d325be245c5b508ff0339bf1794078e20bfe0babc7ffe683270063ab68210392972e2eb617b2388771abe27235fd5ac44af8e61693261550447a4c3e39da98ac00000000"));
    //     REQUIRE(entity_from_data(tx, decoded_tx, true, true));
    //     REQUIRE(tx.inputs().size() == 2u);

    //     auto& prevout2 = tx.inputs()[0].previous_output().validation.cache;
    //     REQUIRE(decode_base16(decoded_script, "0020d9bbfbe56af7c4b7f960a70d7ea107156913d9e5a26b0a71429df5e097ca6537"));
    //     prevout2.set_script(create<script>(decoded_script, false));
    //     prevout2.set_value(16777215);
    //     REQUIRE(prevout2.script().is_valid());

    //     auto& prevout3 = tx.inputs()[1].previous_output().validation.cache;
    //     REQUIRE(decode_base16(decoded_script, "0020ba468eea561b26301e4cf69fa34bde4ad60c81e70f059f045ca9a79931004a4d"));
    //     prevout3.set_script(create<script>(decoded_script, false));
    //     prevout3.set_value(16777215);
    //     REQUIRE(prevout3.script().is_valid());

    //     // native P2WSH witness program.
    //     result0 = verify(tx, 0, rule_fork::bip141_rule | rule_fork::bip143_rule);
    //     REQUIRE(result0.value() == error::success);

    //     // native P2WSH witness program.
    //     result1 = verify(tx, 1, rule_fork::bip141_rule | rule_fork::bip143_rule);
    //     REQUIRE(result1.value() == error::success);
    // }

    // TEST_CASE("script native  bip143 p2sh p2wsh tx valid", "[script]") {
    //     transaction tx;
    //     data_chunk decoded_tx;
    //     data_chunk decoded_script;
    //     REQUIRE(decode_base16(decoded_tx, "0100000000010136641869ca081e70f394c6948e8af409e18b619df2ed74aa106c1ca29787b96e0100000023220020a16b5755f7f6f96dbd65f5f0d6ab9418b89af4b1f14a1bb8a09062c35f0dcb54ffffffff0200e9a435000000001976a914389ffce9cd9ae88dcc0631e88a821ffdbe9bfe2688acc0832f05000000001976a9147480a33f950689af511e6e84c138dbbd3c3ee41588ac080047304402206ac44d672dac41f9b00e28f4df20c52eeb087207e8d758d76d92c6fab3b73e2b0220367750dbbe19290069cba53d096f44530e4f98acaa594810388cf7409a1870ce01473044022068c7946a43232757cbdf9176f009a928e1cd9a1a8c212f15c1e11ac9f2925d9002205b75f937ff2f9f3c1246e547e54f62e027f64eefa2695578cc6432cdabce271502473044022059ebf56d98010a932cf8ecfec54c48e6139ed6adb0728c09cbe1e4fa0915302e022007cd986c8fa870ff5d2b3a89139c9fe7e499259875357e20fcbb15571c76795403483045022100fbefd94bd0a488d50b79102b5dad4ab6ced30c4069f1eaa69a4b5a763414067e02203156c6a5c9cf88f91265f5a942e96213afae16d83321c8b31bb342142a14d16381483045022100a5263ea0553ba89221984bd7f0b13613db16e7a70c549a86de0cc0444141a407022005c360ef0ae5a5d4f9f2f87a56c1546cc8268cab08c73501d6b3be2e1e1a8a08824730440220525406a1482936d5a21888260dc165497a90a15669636d8edca6b9fe490d309c022032af0c646a34a44d1f4576bf6a4a74b67940f8faa84c7df9abe12a01a11e2b4783cf56210307b8ae49ac90a048e9b53357a2354b3334e9c8bee813ecb98e99a7e07e8c3ba32103b28f0c28bfab54554ae8c658ac5c3e0ce6e79ad336331f78c428dd43eea8449b21034b8113d703413d57761b8b9781957b8c0ac1dfe69f492580ca4195f50376ba4a21033400f6afecb833092a9a21cfdf1ed1376e58c5d1f47de74683123987e967a8f42103a6d48b1131e94ba04d9737d61acdaa1322008af9602b3b14862c07a1789aac162102d8b661b0b3302ee2f162b09e07a55ad5dfbe673a9f01d9f0c19617681024306b56ae00000000"));
    //     REQUIRE(entity_from_data(tx, decoded_tx, true, true));
    //     REQUIRE(tx.inputs().size() == 1u);

    //     auto& prevout0 = tx.inputs()[0].previous_output().validation.cache;
    //     REQUIRE(decode_base16(decoded_script, "a9149993a429037b5d912407a71c252019287b8d27a587"));
    //     prevout0.set_script(create<script>(decoded_script, false));
    //     prevout0.set_value(987654321);
    //     REQUIRE(prevout0.script().is_valid());

    //     // P2SH-P2WSH 6-of-6 multisig witness program.
    //     auto result0 = verify(tx, 0, rule_fork::bip16_rule | rule_fork::bip141_rule | rule_fork::bip143_rule);
    //     REQUIRE(result0.value() == error::success);

    //     // missing bip16 (required for p2sh, embedded witness not consumed).
    //     result0 = verify(tx, 0, rule_fork::bip141_rule | rule_fork::bip143_rule);
    //     REQUIRE(result0.value() == error::unexpected_witness);

    //     // missing bip141 (witness not allowed).
    //     result0 = verify(tx, 0, rule_fork::bip16_rule | rule_fork::bip143_rule);
    //     REQUIRE(result0.value() == error::unexpected_witness);

    //     // missing bip143 (invalid sighash).
    //     result0 = verify(tx, 0, rule_fork::bip16_rule | rule_fork::bip141_rule);
    //     REQUIRE(result0.value() == error::stack_false);
    // }

    // TEST_CASE("script native  bip143 no find and delete tx valid", "[script]") {
    //     transaction tx;
    //     data_chunk decoded_tx;
    //     data_chunk decoded_script;
    //     REQUIRE(decode_base16(decoded_tx, "0100000000010169c12106097dc2e0526493ef67f21269fe888ef05c7a3a5dacab38e1ac8387f14c1d000000ffffffff01010000000000000000034830450220487fb382c4974de3f7d834c1b617fe15860828c7f96454490edd6d891556dcc9022100baf95feb48f845d5bfc9882eb6aeefa1bc3790e39f59eaa46ff7f15ae626c53e012102a9781d66b61fb5a7ef00ac5ad5bc6ffc78be7b44a566e3c87870e1079368df4c4aad4830450220487fb382c4974de3f7d834c1b617fe15860828c7f96454490edd6d891556dcc9022100baf95feb48f845d5bfc9882eb6aeefa1bc3790e39f59eaa46ff7f15ae626c53e0100000000"));
    //     REQUIRE(entity_from_data(tx, decoded_tx, true, true));
    //     REQUIRE(tx.inputs().size() == 1u);

    //     auto& prevout0 = tx.inputs()[0].previous_output().validation.cache;
    //     REQUIRE(decode_base16(decoded_script, "00209e1be07558ea5cc8e02ed1d80c0911048afad949affa36d5c3951e3159dbea19"));
    //     prevout0.set_script(create<script>(decoded_script, false));
    //     prevout0.set_value(200000);
    //     REQUIRE(prevout0.script().is_valid());

    //     // P2WSH witness program.
    //     auto result0 = verify(tx, 0, rule_fork::bip141_rule | rule_fork::bip143_rule);
    //     REQUIRE(result0.value() == error::success);

    //     // missing bip141, extra bip16 (witness not allowed).
    //     result0 = verify(tx, 0, rule_fork::bip16_rule | rule_fork::bip143_rule);
    //     REQUIRE(result0.value() == error::unexpected_witness);

    //     // missing bip143, extra bip16 (find-and-delete treatment).
    //     result0 = verify(tx, 0, rule_fork::bip16_rule | rule_fork::bip141_rule);
    //     REQUIRE(result0.value() == error::incorrect_signature);
    // }
    // #endif
    // // End Test Suite



// Pending:

    // TEST_CASE("script empty  default  true", "[script]") {
    //     script instance;
    //     REQUIRE(instance.empty());
    // }

});
