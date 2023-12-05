type GenericPromise<T> = {
    getId: () => number;
    extractPtr?: () => T;
    extractValue?: () => T;
};
export declare function moveToJsPromise<T>(cppPromise: GenericPromise<T>): Promise<T>;
export {};
