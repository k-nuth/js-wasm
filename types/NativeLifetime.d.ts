// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

export declare class NativeLifetime {
    private readonly held;
    private readonly owners;
    holds<T>(native: T): T;
    dependsOn(owner: unknown): void;
    release(): void;
}
