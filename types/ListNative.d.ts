export interface ListNative<T> {
    count(): number;
    nth(index: number): T;
    pushBack(item: T): void;
}
