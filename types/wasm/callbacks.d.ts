// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

export declare class CallbackStatusError extends Error {
    readonly code: number;
    constructor(code: number);
}
export interface CallbackConversion<T> {
    take(value: unknown): T;
    release(value: unknown): void;
}
/** One registry per module/executor. The native terminal callback owns completion.
 * A JS timeout/abort must not release the receiver while C++ still uses it.
 */
export declare class CallbackRegistry {
    private readonly capacity;
    private readonly pending;
    private readonly owners;
    private sequence;
    constructor(capacity?: number);
    get size(): number;
    assertIdle(owner: object): void;
    invoke<T>(owner: object, start: (id: number, enterNative: () => void) => void): Promise<T>;
    /** Call enterNative immediately before crossing the native boundary.
     * Once entered, only terminal completion releases ownership pins/inputs.
     */
    invokeWithOwners<T>(receivers: readonly object[], start: (id: number, enterNative: () => void) => void, conversion?: CallbackConversion<T>): Promise<T>;
    complete(id: number, status: number, value: unknown): boolean;
}
