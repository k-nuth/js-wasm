// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

export declare const OPCODE_ALIASES: Readonly<{
    disabled_verif: "op_begin";
    disabled_vernotif: "op_until";
    disabled_invert: "op_invert";
    reserved_137: "op_define";
    reserved_138: "op_invoke";
    disabled_mul2: "op_lshiftnum";
    disabled_div2: "op_rshiftnum";
    disabled_lshift: "op_lshiftbin";
    disabled_rshift: "op_rshiftbin";
}>;
export type OpcodeAlias = keyof typeof OPCODE_ALIASES;
