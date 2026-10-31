// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

export declare class Kth {
    static getLibconfig(): {
        architecture: string;
        osName: string;
        endianness: string;
        compilerName: string;
        compilerVersion: string;
        optimizationLevel: string;
        cppapiBuildTimestamp: number;
        capiBuildTimestamp: number;
        capiBuildGitHash: string;
        wasmBuildTimestamp: number;
        typeSizesInt: number;
        typeSizesLong: number;
        typeSizesPointer: number;
        cppapiVersion: string;
        capiVersion: string;
        wasmLibraryVersion: string;
        microarchitectureId: string;
        marchNames: string;
        currency: "bitcoin" | "bitcoin_cash" | "litecoin";
        currencySymbol: string;
        mempool: boolean;
        dbReadonly: boolean;
        debugMode: boolean;
        emscriptenVersion: string;
    };
}
export default Kth;
