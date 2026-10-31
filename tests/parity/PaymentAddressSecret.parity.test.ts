// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

// Ports the four "payment_address construct secret" cases of src/domain/test/wallet/payment_address.cpp. They build the
// address from an EcPrivate (secret, version, compress). No public call returns an EcPrivateNative, so the key pair is
// derived the way the library defines it: the public key of the secret (computed by the independent secp256k1 in
// support/secp256k1.ts, compressed or uncompressed according to `compress`) and the address version carried by the
// WIF version word (0x806f -> address version 0x6f). The expected legacy addresses are the upstream constants.
import { hexStrToBytes } from '../..';
import { namedHex } from './support/fixtures';
import { ecPublicClass, paymentAddressClass } from './support/natives';
import { compressedPublicKey, uncompressedPublicKey } from './support/secp256k1';
import { describeSource, sourceCase } from './support/sourceCase';

const FILE = 'src/domain/test/wallet/payment_address.cpp';

function legacyAddressOf(version: number, compress: boolean): string {
    const secret = hexStrToBytes(namedHex(FILE, 'secret_hex'));
    const point = compress ? compressedPublicKey(secret) : uncompressedPublicKey(secret);
    const publicKey = ecPublicClass().fromVerifiedPoint(compressedPublicKey(secret), compress);
    expect(Array.from(publicKey.toData())).toEqual(Array.from(point));
    return paymentAddressClass().fromEcPublic(publicKey, version).encodedLegacy();
}

describeSource(FILE, () => {
    sourceCase('payment_address construct secret valid expected', () => {
        expect(legacyAddressOf(0x00, true)).toBe(namedHex(FILE, 'address_compressed'));
    });

    sourceCase('payment_address construct secret testnet valid expected', () => {
        expect(legacyAddressOf(0x6f, true)).toBe(namedHex(FILE, 'address_compressed_testnet'));
    });

    sourceCase('payment_address construct secret mainnet uncompressed valid expected', () => {
        expect(legacyAddressOf(0x00, false)).toBe(namedHex(FILE, 'address_uncompressed'));
    });

    sourceCase('payment_address construct secret testnet uncompressed valid expected', () => {
        expect(legacyAddressOf(0x6f, false)).toBe(namedHex(FILE, 'address_uncompressed_testnet'));
    });
});
