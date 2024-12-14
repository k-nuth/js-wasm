export declare class Kth {
    static getLibconfig(): {
        logLibrary: "boost" | "spdlog" | "binlog";
        useLibmdbx: boolean;
        version: string;
        microarchitectureId: string;
        currency: "bitcoin" | "bitcoin_cash" | "litecoin";
        mempool: boolean;
        dbReadonly: boolean;
        debugMode: boolean;
        architecture: string;
        osName: string;
        compilerName: string;
        compilerVersion: string;
        optimizationLevel: string;
        capiBuildTimestamp: number;
        emscriptenVersion: string;
        wasmBuildTimestamp: number;
    };
}
export default Kth;
