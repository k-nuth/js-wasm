// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

export interface ScriptTest {
    input: string;
    output: string;
    description: string;
    inputSequence?: number;
    locktime?: number;
    version?: number;
}

export type ScriptTestList = ScriptTest[];

// BIP16
//------------------------------------------------------------------------------

// These are valid prior to and after BIP16 activation.
export const validBIP16Scripts: ScriptTestList = [{
    input: "0 [51]",
    output: "hash160 [da1745e9b549bd0bfa1a569971c77eba30cd5a4b] equal",
    description: "trivial p2sh",
    inputSequence: 0,
    locktime: 0,
    version: 0
}, {
    input: "[1.] [0.51]",
    output: "hash160 [da1745e9b549bd0bfa1a569971c77eba30cd5a4b] equal",
    description: "basic p2sh",
    inputSequence: 0,
    locktime: 0,
    version: 0
}];

// These are invalid prior to and after BIP16 activation.
export const invalidBIP16Scripts: ScriptTestList = [];

// These are valid prior to BIP16 activation and invalid after.
export const invalidatedBIP16Scripts: ScriptTestList = [];
