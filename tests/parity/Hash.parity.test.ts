// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

// Ports the one case of src/infrastructure/test/math/hash.cpp that HashFunctions can express. The package exposes SHA-256,
// SHA-256 with reversed byte order and RIPEMD-160; SHA-1, SHA-512, the HMACs, PBKDF2 and the hash160 helper
// (bitcoin_short_hash) have no binding, which is what keeps the other cases of that file blocked.
import { HashFunctions, bytesToHexStr } from '../..';
import { describeSource, sourceCase } from './support/sourceCase';

describeSource('src/infrastructure/test/math/hash.cpp', () => {
    sourceCase('sha256 hash test', () => {
        const chunk = new TextEncoder().encode('data');
        expect(bytesToHexStr(HashFunctions.sha256(chunk))).toBe('3a6eb0790f39ac87c94f3856b2dd2c5d110e6811602261a9a923d3bb23adc8b7');
    });
});
