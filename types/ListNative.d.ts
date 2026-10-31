// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

export interface ListNative<T> {
    count(): number;
    nth(index: number): T;
    pushBack(item: T): void;
}
