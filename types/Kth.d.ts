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
        emscriptenVersion: string;
        buildTimestamp: number;
    };
}
export default Kth;
