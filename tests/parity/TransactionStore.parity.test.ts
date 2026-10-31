// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

// Ports the wire/store serialization comparison of src/domain/test/chain/transaction.cpp. The Transaction wrapper decodes
// wire data only; the store format is reached with TransactionNative.fromData(data, wire), whose class comes from the
// native a wrapper returns (support/natives.ts).
import { bytesToHexStr, hexStrToBytes } from '../..';
import { namedHex } from './support/fixtures';
import { transactionNativeClass } from './support/natives';
import { describeSource, sourceCase } from './support/sourceCase';

const FILE = 'src/domain/test/chain/transaction.cpp';

describeSource(FILE, () => {
    sourceCase('chain transaction from data compare wire to store success', () => {
        const Transaction = transactionNativeClass();
        const wire = hexStrToBytes(namedHex(FILE, 'tx3_wire_serialized'));
        const store = hexStrToBytes(namedHex(FILE, 'tx3_store_serialized_v3'));

        const wireTx = Transaction.fromData(wire, true);
        expect(bytesToHexStr(wireTx.toData(true))).toBe(bytesToHexStr(wire));

        // The text of the wire transaction in store form (encode_base16 in the upstream test; computed, never compared).
        expect(wireTx.toData(false).length).toBeGreaterThan(0);

        const storeTx = Transaction.fromData(store, false);
        expect(bytesToHexStr(storeTx.toData(false))).toBe(bytesToHexStr(store));

        expect(wireTx.equals(storeTx)).toBe(true);
    });
});
