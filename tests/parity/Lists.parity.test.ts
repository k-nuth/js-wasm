// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

// Ports src/c-api/test/chain/input_list.cpp and output_list.cpp through the InputList / OutputList adapters, whose
// toNative() returns the native list (count, nth, pushBack, erase).
import { Input, InputList, Output, OutputList, OutputPoint, free } from '../..';
import { scriptFromHex } from './support/chain';
import { describeSource, sourceCase } from './support/sourceCase';

const SCRIPT_BODY = 'ece424a6bb6ddf4db592c0faed60685047a361b1';
const PREV_HASH = Uint8Array.from({ length: 32 }, (_, i) => 0xa0 + i) as any;

describeSource('src/c-api/test/chain/input_list.cpp', () => {
    const makeInput = () => new Input(new OutputPoint(PREV_HASH, 0), scriptFromHex(SCRIPT_BODY), 0xffffffff);

    sourceCase('C-API InputList - default construct is empty', () => {
        const list = InputList.toNative([]);
        try {
            expect(list.count()).toBe(0);
        } finally {
            free(list);
        }
    });

    sourceCase('C-API InputList - push_back / count / nth', () => {
        const list = InputList.toNative([]);
        const input = makeInput().toNative();
        try {
            list.pushBack(input);
            expect(list.count()).toBe(1);
            expect(list.nth(0)).not.toBeNull();
            expect(Input.fromNative(list.nth(0)).seq).toBe(0xffffffff);
        } finally {
            free(input);
            free(list);
        }
    });

    sourceCase('C-API InputList - erase removes element', () => {
        const list = InputList.toNative([]);
        const input = makeInput().toNative();
        try {
            list.pushBack(input);
            list.pushBack(input);
            expect(list.count()).toBe(2);
            list.erase(0);
            expect(list.count()).toBe(1);
        } finally {
            free(input);
            free(list);
        }
    });
});

describeSource('src/c-api/test/chain/output_list.cpp', () => {
    const makeOutput = () => new Output(50000n, scriptFromHex(SCRIPT_BODY));

    sourceCase('C-API OutputList - default construct is empty', () => {
        const list = OutputList.toNative([]);
        try {
            expect(list.count()).toBe(0);
        } finally {
            free(list);
        }
    });

    sourceCase('C-API OutputList - push_back / count / nth', () => {
        const list = OutputList.toNative([]);
        const output = makeOutput().toNative();
        try {
            list.pushBack(output);
            expect(list.count()).toBe(1);
            expect(list.nth(0)).not.toBeNull();
            expect(Output.fromNative(list.nth(0)).value).toBe(50000n);
        } finally {
            free(output);
            free(list);
        }
    });

    sourceCase('C-API OutputList - erase removes element', () => {
        const list = OutputList.toNative([]);
        const output = makeOutput().toNative();
        try {
            list.pushBack(output);
            list.pushBack(output);
            expect(list.count()).toBe(2);
            list.erase(0);
            expect(list.count()).toBe(1);
        } finally {
            free(output);
            free(list);
        }
    });
});
