// Copyright (c) 2016-2025 Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import {
    Input, OutputPoint, RuleFork, Script,
    bytesToHexStr, hexStrToBytes, encodeHash, HashFunctions
} from '..';

const noRules = RuleFork.toInt('no_rules');
const allRules = RuleFork.toInt('all_rules');
const bip16_rule = RuleFork.toInt('bip16_rule');
const bip30_rule = RuleFork.toInt('bip30_rule');
const bip34_rule = RuleFork.toInt('bip34_rule');
const bip65_rule = RuleFork.toInt('bip65_rule');
const bip66_rule = RuleFork.toInt('bip66_rule');
const bip112_rule = RuleFork.toInt('bip112_rule');

const validRawHex = '54b755c39207d443fd96a8d12c94446a1c6f66e39c95e894c23418d7501f681b010000006b48304502203267910f55f2297360198fff57a3631be850965344370f732950b47795737875022100f7da90b82d24e6e957264b17d3e5042bab8946ee5fc676d15d915da450151d36012103893d5a06201d5cf61400e96fa4a7514fc12ab45166ace618d68b8066c9c585f9ffffffff';
const validRawInput = hexStrToBytes(validRawHex);

describe('Input', () => {

    it('Should be invalid by default', () => {
        const input = new Input();
        expect(input.valid).toBe(false);
    });

    it('Should construct a valid input with a valid previous output, script, and sequence', () => {
        const prevOut = new OutputPoint(HashFunctions.nullHash, 5434);
        const script = Script.fromData(hexStrToBytes("ece424a6bb6ddf4db592c0faed60685047a361b1"), false);
        const seq = 4568656;

        const input = new Input(prevOut, script, seq);
        expect(input.valid).toBe(true);
        expect(input.previousOutput).toBe(prevOut);
        expect(input.previousOutput?.hash).toEqual(HashFunctions.nullHash);
        expect(input.previousOutput?.index).toBe(5434);
        expect(input.script).toBe(script);
        expect(bytesToHexStr(input.script?.toData(false) ?? new Uint8Array)).toEqual("ece424a6bb6ddf4db592c0faed60685047a361b1");
        expect(input.seq).toBe(seq);
    });

    it('Should construct a valid input with a valid previous output, script, and sequence', () => {
        const input = Input.fromData(validRawInput);
        expect(input?.valid).toBe(true);
        expect(encodeHash(input?.previousOutput?.hash ?? HashFunctions.nullHash)).toEqual('1b681f50d71834c294e8959ce3666f1c6a44942cd1a896fd43d40792c355b754');
        expect(input?.previousOutput?.index).toBe(1);
        expect(bytesToHexStr(input?.script?.toData(false) ?? new Uint8Array)).toEqual("48304502203267910f55f2297360198fff57a3631be850965344370f732950b47795737875022100f7da90b82d24e6e957264b17d3e5042bab8946ee5fc676d15d915da450151d36012103893d5a06201d5cf61400e96fa4a7514fc12ab45166ace618d68b8066c9c585f9");
        expect(input?.seq).toEqual(4294967295);
        expect(input?.serializedSize(true)).toBe(validRawInput.length);
        // expect(input?.toData(true)).toEqual(validRawInput);
        expect(bytesToHexStr(input?.toData(true) ?? new Uint8Array)).toEqual(validRawHex);
    });

    it('Should return undefined if the input data is insufficient', () => {
        const input = Input.fromData(new Uint8Array(2));
        expect(input).toBeUndefined();
    });
});


// TEST_CASE("input  from data  insufficient data  failure", "[input]") {
//     data_chunk data(2);

//     input instance;

//     REQUIRE( ! entity_from_data(instance, data));
//     REQUIRE( ! instance.is_valid());
// }

// TEST_CASE("input  from data  valid data  success", "[input]") {
//     auto const junk = base16_literal("000000000000005739943a9c29a1955dfae2b3f37de547005bfb9535192e5fb0000000000000005739943a9c29a1955dfae2b3f37de547005bfb9535192e5fb0");

//     // data_chunk_stream_host host(junk);
//     byte_source<std::array<uint8_t, 64>> source(junk);
//     boost::iostreams::stream<byte_source<std::array<uint8_t, 64>>> stream(source);

//     input instance;
//     REQUIRE(entity_from_data(instance, stream));
// }

// TEST_CASE("input  factory from data 1  valid input  success", "[input]") {
//     auto const instance = create<input>(valid_raw_input);
//     REQUIRE(instance.is_valid());
//     REQUIRE(instance.serialized_size() == valid_raw_input.size());

//     // Re-save and compare against original.
//     auto const resave = instance.to_data();
//     REQUIRE(resave.size() == valid_raw_input.size());
//     REQUIRE(resave == valid_raw_input);
// }

// TEST_CASE("input  factory from data 2  valid input  success", "[input]") {
//     data_source stream(valid_raw_input);
//     auto instance = create<input>(stream);
//     REQUIRE(instance.is_valid());
//     REQUIRE(instance.serialized_size() == valid_raw_input.size());

//     // Re-save and compare against original.
//     auto const resave = instance.to_data();
//     REQUIRE(resave.size() == valid_raw_input.size());
//     REQUIRE(resave == valid_raw_input);
// }

// TEST_CASE("input  factory from data 3  valid input  success", "[input]") {
//     data_source stream(valid_raw_input);
//     istream_reader source(stream);
//     auto instance = create<input>(source);
//     REQUIRE(instance.is_valid());
//     REQUIRE(instance.serialized_size() == valid_raw_input.size());

//     // Re-save and compare against original.
//     auto const resave = instance.to_data();
//     REQUIRE(resave.size() == valid_raw_input.size());
//     REQUIRE(resave == valid_raw_input);
// }

// TEST_CASE("input  is final  max input sequence  true", "[input]") {
//     input const instance({}, {}, max_input_sequence);
//     REQUIRE(instance.is_final());
// }

// TEST_CASE("input  is final  sequence zero  false", "[input]") {
//     input const instance({}, {}, 0);
//     REQUIRE( ! instance.is_final());
// }

// TEST_CASE("input  is locked  enabled block type sequence age equals minimum  false", "[input]") {
//     static auto const age = 7u;
//     static auto const sequence_enabled_block_type_minimum = age;
//     input instance({}, {}, sequence_enabled_block_type_minimum);
//     auto& prevout = instance.previous_output().validation;
//     prevout.height = 42;
//     REQUIRE( ! instance.is_locked(prevout.height + age, 0));
// }

// TEST_CASE("input  is locked  enabled block type sequence age above minimum  false", "[input]") {
//     static auto const age = 7u;
//     static auto const sequence_enabled_block_type_minimum = age - 1;
//     input instance({}, {}, sequence_enabled_block_type_minimum);
//     auto& prevout = instance.previous_output().validation;
//     prevout.height = 42;
//     REQUIRE( ! instance.is_locked(prevout.height + age, 0));
// }

// TEST_CASE("input  is locked  enabled block type sequence age below minimum  true", "[input]") {
//     static auto const age = 7u;
//     static auto const sequence_enabled_block_type_minimum = age + 1;
//     input instance({}, {}, sequence_enabled_block_type_minimum);
//     auto& prevout = instance.previous_output().validation;
//     prevout.height = 42;
//     REQUIRE(instance.is_locked(prevout.height + age, 0));
// }

// TEST_CASE("input  is locked  disabled block type sequence age below minimum  false", "[input]") {
//     static auto const age = 7u;
//     static auto const sequence_disabled_block_type_minimum = relative_locktime_disabled | (age + 1);
//     input instance({}, {}, sequence_disabled_block_type_minimum);
//     auto& prevout = instance.previous_output().validation;
//     prevout.height = 42;
//     REQUIRE( ! instance.is_locked(prevout.height + age, 0));
// }

// TEST_CASE("input  is locked  enabled time type sequence age equals minimum  false", "[input]") {
//     static auto const age = 7u;
//     static auto const age_seconds = 7u << relative_locktime_seconds_shift;
//     static auto const sequence_enabled_time_type_minimum = relative_locktime_time_locked | age;
//     input instance({}, {}, sequence_enabled_time_type_minimum);
//     auto& prevout = instance.previous_output().validation;
//     prevout.median_time_past = 42;
//     REQUIRE( ! instance.is_locked(0, prevout.median_time_past + age_seconds));
// }

// TEST_CASE("input  is locked  enabled time type sequence age above minimum  false", "[input]") {
//     static auto const age = 7u;
//     static auto const age_seconds = 7u << relative_locktime_seconds_shift;
//     static auto const sequence_enabled_time_type_minimum = relative_locktime_time_locked | (age - 1);
//     input instance({}, {}, sequence_enabled_time_type_minimum);
//     auto& prevout = instance.previous_output().validation;
//     prevout.median_time_past = 42;
//     REQUIRE( ! instance.is_locked(0, prevout.median_time_past + age_seconds));
// }

// TEST_CASE("input  is locked  enabled time type sequence age below minimum  true", "[input]") {
//     static auto const age = 7u;
//     static auto const age_seconds = 7u << relative_locktime_seconds_shift;
//     static auto const sequence_enabled_time_type_minimum = relative_locktime_time_locked | (age + 1);
//     input instance({}, {}, sequence_enabled_time_type_minimum);
//     auto& prevout = instance.previous_output().validation;
//     prevout.median_time_past = 42;
//     REQUIRE(instance.is_locked(0, prevout.median_time_past + age_seconds));
// }

// TEST_CASE("input  is locked  disabled time type sequence age below minimum  false", "[input]") {
//     static auto const age = 7u;
//     static auto const age_seconds = 7u << relative_locktime_seconds_shift;
//     static auto const sequence_disabled_time_type_minimum = relative_locktime_disabled | relative_locktime_time_locked | (age + 1);
//     input instance({}, {}, sequence_disabled_time_type_minimum);
//     auto& prevout = instance.previous_output().validation;
//     prevout.median_time_past = 42;
//     REQUIRE( ! instance.is_locked(0, prevout.median_time_past + age_seconds));
// }

// TEST_CASE("input  signature operations  bip16 inactive  returns script sigops", "[input]") {
//     auto const raw_script = to_chunk(base16_literal("02acad"));
//     script script;
//     REQUIRE(entity_from_data(script, raw_script, true));
//     input instance;
//     instance.set_script(script);
//     REQUIRE(script.sigops(false) == instance.signature_operations(false, false));
// }

// TEST_CASE("input  signature operations  bip16 active cache empty  returns script sigops", "[input]") {
//     auto const raw_script = to_chunk(base16_literal("02acad"));
//     script script;
//     REQUIRE(entity_from_data(script, raw_script, true));
//     input instance;
//     instance.set_script(script);
//     REQUIRE(script.sigops(false) == instance.signature_operations(true, false));
// }

// TEST_CASE("input  previous output setter 1  roundtrip  success", "[input]") {
//     output_point const value{
//         hash_literal("000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f"),
//         5434u};

//     input instance;
//     REQUIRE(value != instance.previous_output());
//     instance.set_previous_output(value);
//     REQUIRE(value == instance.previous_output());
//     auto const& restricted = instance;
//     REQUIRE(value == restricted.previous_output());
// }

// TEST_CASE("input  previous output setter 2  roundtrip  success", "[input]") {
//     output_point const value{
//         hash_literal("000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f"),
//         5434u};

//     auto dup_value = value;

//     input instance;
//     REQUIRE(value != instance.previous_output());
//     instance.set_previous_output(std::move(dup_value));
//     REQUIRE(value == instance.previous_output());
//     auto const& restricted = instance;
//     REQUIRE(value == restricted.previous_output());
// }

// TEST_CASE("input  script setter 1  roundtrip  success", "[input]") {
//     script value;
//     auto const data = to_chunk(base16_literal("ece424a6bb6ddf4db592c0faed60685047a361b1"));
//     REQUIRE(entity_from_data(value, data, false));

//     input instance;
//     REQUIRE(value != instance.script());
//     instance.set_script(value);
//     REQUIRE(value == instance.script());
//     auto const& restricted = instance;
//     REQUIRE(value == restricted.script());
// }

// TEST_CASE("input  script setter 2  roundtrip  success", "[input]") {
//     script value;
//     auto const data = to_chunk(base16_literal("ece424a6bb6ddf4db592c0faed60685047a361b1"));
//     REQUIRE(entity_from_data(value, data, false));

//     auto dup_value = value;
//     input instance;
//     REQUIRE(value != instance.script());
//     instance.set_script(std::move(dup_value));
//     REQUIRE(value == instance.script());
//     auto const& restricted = instance;
//     REQUIRE(value == restricted.script());
// }

// TEST_CASE("input  sequence  roundtrip  success", "[input]") {
//     uint32_t value = 1254u;
//     input instance;
//     REQUIRE(value != instance.sequence());
//     instance.set_sequence(value);
//     REQUIRE(value == instance.sequence());
// }

// TEST_CASE("input  operator assign equals 1  always  matches equivalent", "[input]") {
//     input expected;
//     REQUIRE(entity_from_data(expected, valid_raw_input));
//     input instance;
//     instance = create<input>(valid_raw_input);
//     REQUIRE(instance == expected);
// }

// TEST_CASE("input  operator assign equals 2  always  matches equivalent", "[input]") {
//     input expected;
//     REQUIRE(entity_from_data(expected, valid_raw_input));
//     input instance;
//     instance = expected;
//     REQUIRE(instance == expected);
// }

// TEST_CASE("input  operator boolean equals  duplicates  returns true", "[input]") {
//     input alpha;
//     input beta;
//     REQUIRE(entity_from_data(alpha, valid_raw_input));
//     REQUIRE(entity_from_data(beta, valid_raw_input));
//     REQUIRE(alpha == beta);
// }

// TEST_CASE("input  operator boolean equals  differs  returns false", "[input]") {
//     input alpha;
//     input beta;
//     REQUIRE(entity_from_data(alpha, valid_raw_input));
//     REQUIRE(alpha != beta);
// }

// TEST_CASE("input  operator boolean not equals  duplicates  returns false", "[input]") {
//     input alpha;
//     input beta;
//     REQUIRE(entity_from_data(alpha, valid_raw_input));
//     REQUIRE(entity_from_data(beta, valid_raw_input));
//     REQUIRE(alpha == beta);
// }

// TEST_CASE("input  operator boolean not equals  differs  returns true", "[input]") {
//     input alpha;
//     input beta;
//     REQUIRE(entity_from_data(alpha, valid_raw_input));
//     REQUIRE(alpha != beta);
// }

// // End Test Suite
