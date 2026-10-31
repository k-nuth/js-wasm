// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { HashFunctions, Script, ScriptNative, Transaction, bytesToHexStr, decodeHash, free, hexStrToBytes } from '../..';
import { upgrade } from './support/flags';
import { sourceHex } from './support/fixtures';
import { signEcdsaDer } from './support/rfc6979';
import { compressedPublicKey, derToNativeSignature } from './support/secp256k1';
import { describeSource, sourceCase } from './support/sourceCase';

const DOMAIN = 'src/domain/test/chain/script.cpp';
const PREVOUT = 'dup hash160 [88350574280395ad2c3e2ee20e322073d94e5e40] equalverify checksig';
const CASES = ['script create endorsement - single input single output', 'script create endorsement - single input no output'];
function endorse(name: string): { endorsement: Uint8Array; expected: string } {
    const tx = Transaction.fromData(hexStrToBytes(sourceHex(DOMAIN, name, 0)))!;
    const secret = decodeHash(sourceHex(DOMAIN, name, 1));
    const endorsement = Script.createEndorsement(secret, Script.fromString(PREVOUT)!, tx, 0, 1, upgrade('bch_uahf'), 0n, 'ecdsa');
    return { endorsement, expected: sourceHex(DOMAIN, name, 2) };
}

describeSource(DOMAIN, () => {
    for (const name of CASES) {
        sourceCase(name, () => {
            const { endorsement, expected } = endorse(name);
            expect(bytesToHexStr(endorsement)).toBe(expected);
        });
    }
});

describe('endorsement diagnostics', () => {
    for (const name of CASES) {
        it('both the artifact and the upstream endorsement verify against the library digest for ' + name, () => {
            const { endorsement, expected } = endorse(name);
            const tx = Transaction.fromData(hexStrToBytes(sourceHex(DOMAIN, name, 0)))!;
            const publicKey = compressedPublicKey(decodeHash(sourceHex(DOMAIN, name, 1)));
            const nativeTx = tx.toNative();
            const nativeScript = Script.fromString(PREVOUT)!.toNative();
            try {
                for (const candidate of [endorsement, hexStrToBytes(expected)]) {
                    const signature = HashFunctions.toNative(derToNativeSignature(candidate.slice(0, candidate.length - 1)) as any);
                    try {
                        const [valid] = ScriptNative.checkSignature(signature as any, 1, publicKey, nativeScript, nativeTx, 0, upgrade('bch_uahf'), 0n);
                        expect(valid).toBe(true);
                    } finally {
                        free(signature);
                    }
                }
            } finally {
                free(nativeScript);
                free(nativeTx);
            }
        });

        it('independent RFC 6979 signing matches the upstream and native endorsements for ' + name, () => {
            const { endorsement, expected } = endorse(name);
            const tx = Transaction.fromData(hexStrToBytes(sourceHex(DOMAIN, name, 0)))!;
            const nativeTx = tx.toNative();
            const nativeScript = Script.fromString(PREVOUT)!.toNative();
            try {
                const [digest] = ScriptNative.generateSignatureHash(nativeTx, 0, nativeScript, 1, upgrade('bch_uahf'), 0n);
                const hash = HashFunctions.fromNative(digest, true);
                const der = bytesToHexStr(signEcdsaDer(decodeHash(sourceHex(DOMAIN, name, 1)), hash)) + '01';
                expect(der).toBe(expected);
                expect(der).toBe(bytesToHexStr(endorsement));
            } finally {
                free(nativeScript);
                free(nativeTx);
            }
        });
    }
});
