// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

// The Jest tsconfig only loads the jest types, so the CommonJS module global is declared here.
declare const __dirname: string;

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const fixtureRoot = path.join(__dirname, '..', 'fixtures');

// Upstream vectors copied verbatim by tools/test-parity/extract_vectors.py.
export function loadFixture<T>(relativePath: string): T {
    const file = path.join(fixtureRoot, relativePath);
    if (file.endsWith('.gz')) {
        return JSON.parse(zlib.gunzipSync(fs.readFileSync(file)).toString('utf8')) as T;
    }
    return JSON.parse(fs.readFileSync(file, 'utf8')) as T;
}

let literalTable: Record<string, Array<string>> | undefined;

// The index-th hex literal (source order) of an upstream test case, copied from the upstream source by the extractor.
export function sourceHex(file: string, caseName: string, index: number): string {
    literalTable = literalTable || loadFixture<Record<string, Array<string>>>('hex_literals.json');
    const found = literalTable[file + '::' + caseName];
    if (found === undefined || found[index] === undefined) {
        throw new Error('no hex literal ' + index + ' for ' + file + '::' + caseName);
    }
    return found[index];
}

// A file-level hex constant of an upstream test file (constexpr auto name = "..."_base16 / _hash), as written in the source.
export function namedHex(file: string, constant: string): string {
    literalTable = literalTable || loadFixture<Record<string, Array<string>>>('hex_literals.json');
    const found = literalTable[file + '::#' + constant];
    if (found === undefined) {
        throw new Error('no hex constant ' + constant + ' in ' + file);
    }
    return found[0];
}

export function listFixtures(relativeDirectory: string): Array<string> {
    return fs.readdirSync(path.join(fixtureRoot, relativeDirectory)).sort();
}
