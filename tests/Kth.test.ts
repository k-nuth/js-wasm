// Copyright (c) 2016-2023 Knuth Project developers.
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
			// expect(config.version).toEqual('0.44.0');
		});
	});

});
