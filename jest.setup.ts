// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

// Test modules are evaluated before Jest runs beforeAll hooks. Define the
// constants injected by webpack at module-load time, before requiring any
// source that may call the logger while constructing a singleton.
(globalThis as any).SENSITIVE_LOGS_ENABLED = false;
(globalThis as any).LOCAL_ELECTRUM_ENABLED = false;

import { loadLib } from '.';

beforeAll(async () => {
    // Jest executes the TypeScript sources directly rather than passing them
    // through webpack's DefinePlugin. Mirror the release profile here so tests
    // exercise the silent path and never depend on undeclared build constants.
    await loadLib('src/kth.wasm', 'src/kth.js');

    function fuzzyNumericMatcher(received: any, expected : any) {
        if (typeof received !== 'number' || typeof expected !== 'number') {
            return undefined;
        }

        const precision = 13;
        const expectedDiff = Math.pow(10, -precision) / 2;
        const receivedDiff = Math.abs(expected - received);

        return receivedDiff < expectedDiff;
    }

    (expect as any).addEqualityTesters([fuzzyNumericMatcher]);
});
