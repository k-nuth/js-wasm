// Copyright (c) 2016-2024 Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { Kth } from '..';

describe('Kth', () => {

    describe('getLibconfig', () => {
        it('', async () => {
            const config = Kth.getLibconfig();
            expect(config).toBeDefined();
            expect(config.currency).toEqual('bitcoin_cash');
            expect(config.dbReadonly).toEqual(false);
            expect(config.debugMode).toEqual(false);
            expect(config.logLibrary).toEqual('spdlog');
            expect(config.mempool).toEqual(false);
            expect(config.microarchitectureId).toEqual('');
            expect(config.useLibmdbx).toEqual(false);
            expect(config.version).toEqual('0.52.0');                //C-API version
            expect(config.emscriptenVersion).toEqual('3.1.66');

            const date = new Date(config.buildTimestamp);
            expect(date.getFullYear()).toEqual(2024);
            expect(date.getMonth()).toEqual(10); // January is 0
            expect(date.getDate()).toEqual(27);
        });
    });

});
