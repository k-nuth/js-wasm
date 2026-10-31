// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

export declare const ScriptFlags: Readonly<{
    noRules: 0n;
    easyBlocks: 1n;
    bip16Rule: 2n;
    bip30Rule: 4n;
    bip34Rule: 8n;
    bip66Rule: 16n;
    bip65Rule: 32n;
    bip90Rule: 64n;
    allowCollisions: 128n;
    bip68Rule: 256n;
    bip112Rule: 512n;
    bip113Rule: 1024n;
    bchStrictenc: 2048n;
    bchSighashForkid: 4096n;
    bchLowS: 8192n;
    bchNullfail: 16384n;
    bchReactivatedOpcodes: 32768n;
    bchSigpushonly: 65536n;
    bchCleanstack: 131072n;
    bchSchnorrMultisig: 262144n;
    bchMinimaldata: 524288n;
    bchEnforceSigchecks: 1048576n;
    bch64bitIntegers: 2097152n;
    bchNativeIntrospection: 4194304n;
    bchP2sh32: 8388608n;
    bchTokens: 16777216n;
    bchVmLimits: 33554432n;
    bchBigint: 67108864n;
    bchLoops: 134217728n;
    bchSubroutines: 268435456n;
    bchBitwiseOps: 536870912n;
    bchP2s: 1073741824n;
    bch2027May: 2147483648n;
    bchVmLimitsStandard: 144115188075855872n;
    bchMinimalif: 288230376151711744n;
    bchInputSigchecks: 576460752303423488n;
    bchDiscourageUpgradableNops: 1152921504606846976n;
    bchDisallowSegwitRecovery: 2305843009213693952n;
    retarget: 4611686018427387904n;
    unverified: 9223372036854775808n;
    allPolicyFlags: 4467570830351532032n;
    allRules: 144115188075855871n;
    allBits: 18446744073709551615n;
    standardPolicyFlags: 4467570830351532032n;
}>;
export declare const ScriptUpgrades: Readonly<{
    bip34Activations: 56n;
    bchUahf: 6144n;
    bchDaaCw144: 30720n;
    bchPythagoras: 63488n;
    bchEuclid: 260096n;
    bchPisano: 260096n;
    bchMersenne: 1046528n;
    bchFermat: 2095104n;
    bchEuler: 2095104n;
    bchGauss: 8386560n;
    bchDescartes: 33552384n;
    bchLobachevski: 33552384n;
    bchGalois: 134215680n;
    bchLeibniz: 2147481600n;
    bchCantor: 4294965248n;
}>;
