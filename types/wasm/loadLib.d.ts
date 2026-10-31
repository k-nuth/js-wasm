// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

export interface LoadWasmModuleExt {
    __resolveFilePaths: () => void;
}
declare enum LoadWasmStatus {
    unloaded = 0,
    loading = 1,
    loaded = 2
}
declare function loadLib(wasmUrl?: string, jsUrl?: string | Blob): Promise<unknown>;
declare namespace loadLib {
    var promise: Promise<unknown>;
    var status: LoadWasmStatus;
}
export default loadLib;
