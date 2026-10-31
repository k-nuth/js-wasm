// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import type { WithoutKeyType } from './types';
export declare function isArrayString(obj: any): obj is Array<string | null>;
export declare function isArrayArrayString(obj: any): obj is Array<Array<string>>;
export declare function isDate(date: string | null | undefined): boolean;
export declare function isArrayDate(obj: Array<string | null>): boolean;
export declare function isArrayArrayDate(obj: Array<Array<string>>): boolean;
export declare function isStringPair(obj: any): obj is [string, string];
export declare function copyObject<T extends object>(obj: T, attrs: Array<string>): WithoutKeyType<T, Symbol>;
export declare function mapSeries<T, U>(array: Array<T>, callback: (value: T, index: number, array: Array<T>) => Promise<U>): Promise<U[]>;
export declare function mapParallel<T, U>(array: Array<T>, nWorkers: number, callback: (value: T, index: number, array: Array<T>) => Promise<U>): Promise<U[]>;
export declare function stringToBytes(str: string): number;
