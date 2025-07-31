// Copyright (c) 2016-2025 Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { Kth } from '..';
// import { LibConfig } from '../../types/javascript/wasm/glue';

describe('Kth', () => {
	describe('getLibconfig', () => {
		it('should return a properly structured LibConfig object with valid default values', async () => {
			const config = Kth.getLibconfig();

			// General Assertions
			expect(config).toBeDefined();

			// General System Information
			expect(config.architecture).toEqual('WASM');
			expect(config.osName).toEqual('WebAssembly Host');
			expect(config.endianness).toEqual('Little-endian');

			// Compiler and Build Information
			expect(config.compilerName).toEqual('Emscripten');
			expect(config.compilerVersion).toEqual('Clang 20.0.0git (https:/github.com/llvm/llvm-project 1d810ece2b2c8fab77720493864257f0ea3336a9)');
			expect(config.optimizationLevel).toEqual('-O2');

			const cppapiBuildTimestamp = new Date(config.cppapiBuildTimestamp);
			expect(cppapiBuildTimestamp.getUTCFullYear()).toEqual(2025);
			expect(cppapiBuildTimestamp.getUTCMonth()).toEqual(6); // January is 0
			expect(cppapiBuildTimestamp.getUTCDate()).toEqual(31);

			const capiBuildTimestamp = new Date(config.capiBuildTimestamp);
			expect(capiBuildTimestamp.getUTCFullYear()).toEqual(2025);
			expect(capiBuildTimestamp.getUTCMonth()).toEqual(6); // January is 0
			expect(capiBuildTimestamp.getUTCDate()).toEqual(31);

			expect(config.capiBuildGitHash).toEqual('');

			const wasmBuildTimestamp = new Date(config.wasmBuildTimestamp);
			expect(wasmBuildTimestamp.getUTCFullYear()).toEqual(2025);
			expect(wasmBuildTimestamp.getUTCMonth()).toEqual(6); // January is 0
			expect(wasmBuildTimestamp.getUTCDate()).toEqual(31);

			// Type Sizes
			expect(config.typeSizesInt).toEqual(4);
			expect(config.typeSizesLong).toEqual(4);
			expect(config.typeSizesPointer).toEqual(4);

			// Library and Version Information
			expect(config.cppapiVersion).toEqual('0.70.0');
			expect(config.capiVersion).toEqual('0.70.0'); // C-API version
			expect(config.wasmLibraryVersion).toEqual('2.6.0');
			expect(config.logLibrary).toEqual('spdlog');
			
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
			expect(config.emscriptenVersion).toEqual('3.1.73');
		});
	});
});
