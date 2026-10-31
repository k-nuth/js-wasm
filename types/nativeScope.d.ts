// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

export declare class NativeScope {
    private readonly owned;
    own<T>(native: T): T;
    release(): void;
}
export declare function withNatives<T>(body: (scope: NativeScope) => T): T;
