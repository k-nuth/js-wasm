// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

export default interface EmscriptenModule {
    readonly _malloc: (size: number) => number;
    readonly _free: (ptr: number) => void;
    readonly _strlen: (ptr: number) => number;
    wasmMemory: WebAssembly.Memory;
    locateFile: (fileName: string) => string;
    mainScriptUrlOrBlob: string | Blob | undefined;
}
