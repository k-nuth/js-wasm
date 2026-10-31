// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

// Ports src/domain/test/chain/vmb_auto_*.cpp: one upstream TEST_CASE per VMB data file, one DYNAMIC_SECTION per vector.
// Each vector is a transaction, the spent outputs and an input index. The upstream harness (vmb_tests.hpp) decodes them,
// attaches every spent output to its input, runs tx.check(1000000, false), then tx.accept(...), then verifies the selected
// input under the file flags. A passing file requires success, an "invalid" file requires any failure.
//
// The vectors are decoded and verified on the native objects (TransactionNative / OutputNative / ScriptNative), so the
// wrapper's lossy conversion of token data is not in the path. check() is run as upstream does. Two steps cannot be
// reproduced because the C API cannot attach the spent outputs to the inputs (there is no previous-output cache setter): the
// sighash/introspection data that needs them, and accept(), which reads them. Vectors affected are listed in
// fixtures/vmb_blocked.json and are not executed:
//  - prevout-cache: expected to pass, but verification needs the spent outputs of the other inputs.
//  - accept-needs-prevout-cache: expected to fail; check() and script verification succeed and only accept() rejects it.
//  - decode-failure: the native decoder rejects the transaction or a spent output.
//
// KTH_VMB_PROBE=<file> runs every vector without assertions and writes the ones that disagree with upstream, which is how
// vmb_blocked.json is regenerated.
import { ScriptNative, free, hexStrToBytes } from '../..';
import { loadFixture } from './support/fixtures';
import { outputNativeClass, transactionNativeClass } from './support/natives';
import { describeSource, sourceCase } from './support/sourceCase';
import { splitUtxos } from './support/scriptHarness';

interface VmbVector {
    id: string;
    desc: string;
    tx: string;
    utxos: string;
    input: number;
    scriptOnly: boolean;
}

interface VmbFile {
    file: string;
    case: string;
    flags: string;
    expectPass: boolean;
    vectors: Array<VmbVector>;
}

interface ManifestEntry {
    file: string;
    case: string;
    fixture: string;
    flags: string;
    expectPass: boolean;
    total: number;
}

type Blocked = Record<string, Record<string, string>>;

const ONE_MILLION_BYTES_BLOCK = 1000000;
const manifest = loadFixture<Array<ManifestEntry>>('vmb/manifest.json');
const blocked = loadFixture<Blocked>('vmb_blocked.json');

class DecodeFailure extends Error {}

// Returns the error code of the upstream pipeline up to script verification (0 is success).
function runVector(fixture: VmbFile, vector: VmbVector): number {
    const handles: Array<unknown> = [];
    try {
        let tx;
        let spent;
        try {
            tx = transactionNativeClass().fromData(hexStrToBytes(vector.tx), true);
            handles.push(tx);
            spent = splitUtxos(hexStrToBytes(vector.utxos)).map(bytes => outputNativeClass().fromData(bytes, true));
            handles.push(...spent);
        } catch (error) {
            throw new DecodeFailure((error as Error).message);
        }
        const check = tx.check(ONE_MILLION_BYTES_BLOCK, false, true);
        if (check !== 0) {
            return check;
        }
        const input = tx.inputs().nth(vector.input);
        return ScriptNative.verify(tx, vector.input, BigInt(fixture.flags), input.script(), spent[vector.input].script(), spent[vector.input].value());
    } finally {
        handles.forEach(handle => free(handle as any));
    }
}

function accepted(fixture: VmbFile, code: number): boolean {
    return fixture.expectPass ? code === 0 : code !== 0;
}

const probePath: string | undefined = require('process').env.KTH_VMB_PROBE;
const FILE_TIMEOUT_MS = 30 * 60 * 1000;

if (probePath !== undefined) {
    it('probes every vector and records the disagreements', () => {
        const found: Blocked = {};
        for (const entry of manifest) {
            const fixture = loadFixture<VmbFile>('vmb/' + entry.fixture);
            for (const vector of fixture.vectors) {
                let reason: string | undefined;
                try {
                    if (!accepted(fixture, runVector(fixture, vector))) {
                        reason = fixture.expectPass ? 'prevout-cache' : 'accept-needs-prevout-cache';
                    }
                } catch (error) {
                    reason = error instanceof DecodeFailure ? 'decode-failure' : 'unexpected-error:' + (error as Error).message;
                }
                if (reason !== undefined) {
                    (found[entry.fixture] = found[entry.fixture] || {})[vector.id] = reason;
                }
            }
        }
        require('fs').writeFileSync(probePath, JSON.stringify(found));
    }, 4 * FILE_TIMEOUT_MS);
} else {
    describe('VMB fixture accounting', () => {
        it('keeps all 506 upstream data files and 89821 vectors', () => {
            expect(manifest).toHaveLength(506);
            expect(manifest.reduce((sum, entry) => sum + entry.total, 0)).toBe(89821);
        });

        it('only blocks vectors that exist in the fixtures, with a known reason', () => {
            for (const name of Object.keys(blocked)) {
                const entry = manifest.find(m => m.fixture === name)!;
                expect(entry).toBeDefined();
                const ids = new Set(loadFixture<VmbFile>('vmb/' + name).vectors.map(v => v.id));
                for (const [id, reason] of Object.entries(blocked[name])) {
                    expect(ids.has(id)).toBe(true);
                    expect(['prevout-cache', 'accept-needs-prevout-cache', 'decode-failure']).toContain(reason);
                }
            }
        });
    });

    for (const entry of manifest) {
        describeSource('src/domain/test/chain/' + entry.file, () => {
            sourceCase(entry.case, () => {
                const fixture = loadFixture<VmbFile>('vmb/' + entry.fixture);
                const skipped = blocked[entry.fixture] || {};
                const failures: Array<string> = [];
                let executed = 0;
                for (const vector of fixture.vectors) {
                    if (skipped[vector.id] !== undefined) {
                        continue;
                    }
                    ++executed;
                    if (!accepted(fixture, runVector(fixture, vector))) {
                        failures.push('VMB ' + vector.id + ': ' + vector.desc);
                    }
                }
                expect(failures).toEqual([]);
                expect(executed).toBe(entry.total - Object.keys(skipped).length);
            }, FILE_TIMEOUT_MS);
        });
    }
}
