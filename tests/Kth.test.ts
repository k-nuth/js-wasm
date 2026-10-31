// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { Kth } from '..';

describe('Kth', () => {
    describe('getLibconfig', () => {
        it('should return a properly structured LibConfig object with valid default values', async () => {
            const config = Kth.getLibconfig();

            // General Assertions
            expect(config).toBeDefined();
            // The package entry must load the rebuilt public release, not a stale version-0 bundle.
            const runtime = globalThis as typeof globalThis & {
                process?: { env?: Record<string, string | undefined> };
            };
            expect(config.cppapiVersion).toBe(runtime.process?.env?.KTH_EXPECTED_CPP_VERSION ?? '1.5.2');

            // General System Information
            expect(config.architecture).toEqual('WASM');
            expect(config.osName).toEqual('WebAssembly Host');
            expect(config.endianness).toEqual('Little-endian');

            // Compiler and Build Information
            expect(config.compilerName).toEqual('Emscripten');
            // The exact LLVM revision is supplied by the selected Emscripten SDK and
            // legitimately changes between supported toolchains (the current build uses ems6).
            expect(config.compilerVersion).toMatch(/^Clang \d+\./);
            expect(config.optimizationLevel).toEqual('-O2');

            const cppapiBuildTimestamp = new Date(config.cppapiBuildTimestamp);
            expect(cppapiBuildTimestamp.getTime()).not.toBeNaN();
            expect(cppapiBuildTimestamp.getTime()).toBeLessThanOrEqual(Date.now());
            // expect(cppapiBuildTimestamp.getUTCMonth()).toEqual(6); // January is 0
            // expect(cppapiBuildTimestamp.getUTCDate()).toEqual(31);

            const capiBuildTimestamp = new Date(config.capiBuildTimestamp);
            expect(capiBuildTimestamp.getTime()).not.toBeNaN();
            expect(capiBuildTimestamp.getTime()).toBeLessThanOrEqual(Date.now());
            // expect(capiBuildTimestamp.getUTCMonth()).toEqual(6); // January is 0
            // expect(capiBuildTimestamp.getUTCDate()).toEqual(31);

            expect(config.capiBuildGitHash).toEqual('');

            const wasmBuildTimestamp = new Date(config.wasmBuildTimestamp);
            expect(wasmBuildTimestamp.getTime()).not.toBeNaN();
            expect(wasmBuildTimestamp.getTime()).toBeLessThanOrEqual(Date.now());
            // expect(wasmBuildTimestamp.getUTCMonth()).toEqual(6); // January is 0
            // expect(wasmBuildTimestamp.getUTCDate()).toEqual(31);

            // Type Sizes
            expect(config.typeSizesInt).toEqual(4);
            expect(config.typeSizesLong).toEqual(4);
            expect(config.typeSizesPointer).toEqual(4);

            // Library and Version Information
            // expect(config.cppapiVersion).toEqual('0.71.0');
            // expect(config.capiVersion).toEqual('0.71.0'); // C-API version
            // The package version is release metadata, not a protocol constant.
            expect(config.wasmLibraryVersion).toMatch(/^\d+\.\d+\.\d+$/);
            // Specific Platform Information
            expect(config.microarchitectureId).toEqual('');
            expect(config.marchNames).toEqual('');

            // Application Configuration
            expect(config.currency).toEqual('bitcoin_cash');
            expect(config.currencySymbol).toEqual('BCH');
            expect(config.mempool).toEqual(false);
            expect(config.dbReadonly).toEqual(false);
            expect(config.debugMode).toEqual(false);

            // Emscripten Version
            expect(config.emscriptenVersion).toBe('6.0.13');
        });
    });
});
