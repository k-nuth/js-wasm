export default interface EmscriptenModule {
    readonly _malloc: (size: number) => number;
    readonly _free: (ptr: number) => void;
    readonly _strlen: (ptr: number) => number;
    wasmMemory: WebAssembly.Memory;
    locateFile: (fileName: string) => string;
    mainScriptUrlOrBlob: string | Blob | undefined;
}
