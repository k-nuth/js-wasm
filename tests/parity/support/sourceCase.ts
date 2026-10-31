// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

// Every ported upstream case is registered through these helpers. The enclosing describe() is the upstream test file
// (relative to the repository root) and the test title starts with the exact upstream case name, so the inventory tool
// can join executed results to the upstream cases. A test that covers several upstream cases lists all of them.
export const CASE_SEPARATOR = ' ‖ ';

export function describeSource(file: string, body: () => void): void {
    describe(file, body);
}

export function sourceCase(names: string | Array<string>, body: jest.ProvidesCallback,timeoutMs?: number): void {
    const title = (Array.isArray(names) ? names : [names]).join(CASE_SEPARATOR);
    if (timeoutMs === undefined) {
        it(title, body);
    } else {
        it(title, body, timeoutMs);
    }
}
