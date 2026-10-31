// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

// Ports src/domain/test/chain/script_vm_auto_0..17.cpp: the BCHN script_tests.json vectors, one TEST_CASE each, run
// through run_bchn_test. The vectors and the expected error codes are the upstream ones (fixtures/script_vm_auto.json and
// fixtures/error_codes.json, copied from the upstream sources and enum by tools/test-parity/extract_vectors.py).
import { loadFixture } from './support/fixtures';
import { describeSource, sourceCase } from './support/sourceCase';
import { BchnVector, runBchnVector } from './support/scriptHarness';

interface Vector extends BchnVector {
    file: string;
    name: string;
}

const vectors = loadFixture<Array<Vector>>('script_vm_auto.json');
const errorCodes = loadFixture<Record<string, number>>('error_codes.json');

const files = Array.from(new Set(vectors.map(v => v.file)));

describe('script_vm_auto fixture', () => {
    it('keeps all 18 upstream files and 1758 vectors', () => {
        expect(files).toHaveLength(18);
        expect(vectors).toHaveLength(1758);
    });

    it('resolves every expected error name to an upstream error code', () => {
        for (const v of vectors) {
            expect(errorCodes[v.expected]).toBeDefined();
        }
    });
});

for (const file of files) {
    describeSource('src/domain/test/chain/' + file, () => {
        for (const v of vectors.filter(x => x.file === file)) {
            sourceCase(v.name, () => {
                expect(runBchnVector(v)).toBe(errorCodes[v.expected]);
            });
        }
    });
}
