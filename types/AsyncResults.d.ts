// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

type Conversion = {
    owned: boolean;
    adopt: boolean;
    read: (value: any) => unknown;
};
export declare function convertAsyncResults(values: readonly unknown[], conversions: readonly Conversion[]): unknown[];
export {};
