// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

// Ports the "ripemd hash test" case of src/infrastructure/test/math/hash.cpp. ripemd160_hash is HashFunctions.ripemd160;
// bitcoin_short_hash (HASH160) has no binding of its own and is composed as RIPEMD-160(SHA-256(data)), which is its
// upstream definition. The table and the expected digests are the upstream ones (fixtures/ripemd_tests.json).
import { HashFunctions, bytesToHexStr, hexStrToBytes } from '../..';
import { loadFixture } from './support/fixtures';
import { describeSource, sourceCase } from './support/sourceCase';

const table = loadFixture<Array<[string, string]>>('ripemd_tests.json');
const hash160 = (data: Uint8Array) => HashFunctions.ripemd160(HashFunctions.sha256(data));

describeSource('src/infrastructure/test/math/hash.cpp', () => {
    sourceCase('ripemd hash test', () => {
        expect(table.length).toBeGreaterThan(0);
        for (const [input, expected] of table) {
            expect(bytesToHexStr(HashFunctions.ripemd160(input === '' ? new Uint8Array(0) : hexStrToBytes(input)))).toBe(expected);
        }
        expect(bytesToHexStr(hash160(Uint8Array.of(110)))).toBe('17d040b739d639c729daaf627eaff88cfe4207f4');
        expect(bytesToHexStr(hash160(hexStrToBytes('020641fde3a85beb8321033516de7ec01c35de96e945bf76c3768784a905471986'))))
            .toBe('c23e37c6fad06deab545f952992c8f28cb02bbe5');
    });
});
