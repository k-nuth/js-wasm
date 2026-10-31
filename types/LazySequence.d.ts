// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

export declare class LazySequence<T> {
    private generatorFunc;
    private startIndex;
    constructor(generatorFunc: () => Generator<T>, startIndex?: number);
    [Symbol.iterator](): Generator<T, void, unknown>;
    take(count: number): LazySequence<T>;
    skip(count: number): LazySequence<T>;
    map<U>(transformFunc: (item: T) => U): LazySequence<U>;
    toArray(): T[];
    forEach(callback: (item: T) => void): void;
}
export default LazySequence;
