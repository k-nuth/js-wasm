// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

type GenericPromise<T> = {
    getId: () => number;
    extractPtr?: () => T;
    extractValue?: () => T;
};
export declare function moveToJsPromise<T>(cppPromise: GenericPromise<T>): Promise<T>;
export {};
