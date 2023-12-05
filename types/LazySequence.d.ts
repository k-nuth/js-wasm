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
