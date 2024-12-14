// Copyright (c) 2016-2024 Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { Kth } from '..';

describe('Kth', () => {

    describe('getLibconfig', () => {
        it('should return the correct configuration', () => {
            const config = Kth.getLibconfig();
            expect(config).toBeDefined();
            expect(config.currency).toEqual('bitcoin_cash');
            expect(config.dbReadonly).toEqual(false);
            expect(config.debugMode).toEqual(false);
            expect(config.logLibrary).toEqual('spdlog');
            expect(config.mempool).toEqual(false);
            expect(config.microarchitectureId).toEqual('');
            expect(config.useLibmdbx).toEqual(false);
            expect(config.version).toEqual('0.54.0');    //C-API version

            expect(config.architecture).toEqual('WASM');
            expect(config.osName).toEqual('WebAssembly Host');
            expect(config.compilerName).toEqual('Emscripten');
            expect(config.compilerVersion).toEqual('Clang 20.0.0git (https:/github.com/llvm/llvm-project 7543d09b852695187d08aa5d56d50016fea8f706)');
            const capiBuildTimestamp = new Date(config.capiBuildTimestamp);
            expect(capiBuildTimestamp.getFullYear()).toEqual(2024);
            expect(capiBuildTimestamp.getMonth()).toEqual(11); // January is 0
            expect(capiBuildTimestamp.getDate()).toEqual(13);

            expect(config.emscriptenVersion).toEqual('3.1.66');
            const wasmBuildTimestamp = new Date(config.wasmBuildTimestamp);
            expect(wasmBuildTimestamp.getFullYear()).toEqual(2024);
            expect(wasmBuildTimestamp.getMonth()).toEqual(11); // January is 0
            expect(wasmBuildTimestamp.getDate()).toEqual(13);
        });
    });

});
