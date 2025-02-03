// Copyright (c) 2016-2025 Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { HashFunctions, bytesToHexStr } from '..';

describe('HashFunctions', () => {

    it('Should compute sha256 hash', () => {
        const str = 'Hola';
        const bytes = new Uint8Array(str.split('').map(c => c.charCodeAt(0)));
        const hash = HashFunctions.sha256(bytes);
        expect(bytesToHexStr(hash)).toBe('e633f4fc79badea1dc5db970cf397c8248bac47cc3acf9915ba60b5d76b0e88f');
    });

    it('Should compute sha256 hash reversed', () => {
        const str = 'Hola';
        const bytes = new Uint8Array(str.split('').map(c => c.charCodeAt(0)));
        const hash = HashFunctions.sha256Reversed(bytes);
        expect(bytesToHexStr(hash)).toBe('8fe8b0765d0ba65b91f9acc37cc4ba48827c39cf70b95ddca1deba79fcf433e6');
    });


    it('Should compute sha256 hash reversed string', () => {
        const str = 'Hola';
        const bytes = new Uint8Array(str.split('').map(c => c.charCodeAt(0)));
        const hashStr = HashFunctions.sha256ReversedStr(bytes);
        expect(hashStr).toBe('8fe8b0765d0ba65b91f9acc37cc4ba48827c39cf70b95ddca1deba79fcf433e6');
    });
});
