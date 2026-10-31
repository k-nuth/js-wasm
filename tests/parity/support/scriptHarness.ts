// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { HashFunctions, Input, Output, OutputPoint, Script, Transaction, hexStrToBytes } from '../../..';

// Parse a script the way the upstream parse_script_string helper does: "raw:<hex>" bypasses the mnemonic parser.
export function parseScript(text: string): Script | undefined {
    if (text.startsWith('RAW:') || text.startsWith('raw:')) {
        return Script.fromData(hexStrToBytes(text.substring(4)), false);
    }
    return Script.fromString(text);
}

export interface BchnVector {
    sig: string;
    pub: string;
    flags: string;
    expected: string;
    amount: string;
}

// Port of new_tx_bchn + run_bchn_test (src/domain/test/chain/script.cpp): the crediting transaction pays `amount` to the
// scriptPubKey, the spending transaction consumes it with the scriptSig, and input 0 is verified under the vector flags.
export function runBchnVector(vector: BchnVector): number {
    const sig = parseScript(vector.sig);
    const pub = parseScript(vector.pub);
    if (sig === undefined || pub === undefined) {
        throw new Error('vector script does not parse: ' + vector.sig + ' / ' + vector.pub);
    }
    const amount = BigInt(vector.amount);
    const creditInput = new Input(new OutputPoint(HashFunctions.nullHash, 0xffffffff), Script.fromString('0 0')!, 0xffffffff);
    const credit = new Transaction(1, 0, [creditInput], [new Output(amount, pub)]);
    const spend = new Transaction(1, 0,
        [new Input(new OutputPoint(credit.hash, 0), sig, 0xffffffff)],
        [new Output(amount, new Script(new Uint8Array(0), false))]);
    return Script.verify(spend, 0, BigInt(vector.flags), sig, pub, amount);
}

// Split the "count + count * CTxOut" UTXO blob used by the VMB vectors into serialized outputs.
export function splitUtxos(blob: Uint8Array): Array<Uint8Array> {
    let position = 0;
    const readVarint = (): number => {
        const first = blob[position++];
        if (first < 0xfd) {
            return first;
        }
        const width = first === 0xfd ? 2 : 4;
        let value = 0;
        for (let i = 0; i < width; ++i) {
            value += blob[position + i] * 2 ** (8 * i);
        }
        position += width;
        return value;
    };
    const count = readVarint();
    const outputs: Array<Uint8Array> = [];
    for (let i = 0; i < count; ++i) {
        const start = position;
        position += 8;
        const scriptLength = readVarint();
        position += scriptLength;
        outputs.push(blob.slice(start, position));
    }
    return outputs;
}
