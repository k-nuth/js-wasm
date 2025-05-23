// Copyright (c) 2016-2025 Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { Output, RuleFork, Script } from '..';
import { hexStrToBytes } from '..';

const noRules = RuleFork.noRules;
const allRules = RuleFork.allRules;
const bip16_rule = RuleFork.bip16Rule;
const bip30_rule = RuleFork.bip30Rule;
const bip34_rule = RuleFork.bip34Rule;
const bip65_rule = RuleFork.bip65Rule;
const bip66_rule = RuleFork.bip66Rule;
const bip112_rule = RuleFork.bip112Rule;

const validRawOutput = hexStrToBytes('20300500000000001976a914905f933de850988603aafeeb2fd7fce61e66fe5d88ac');

describe('Output', () => {

    it('Should be invalid by default', () => {
        const output = new Output();
        expect(output.valid).toBe(false);
    });

    it('Should construct a valid output with a valid value and script', () => {
        const value = 643n;
        const bytes = hexStrToBytes('ece424a6bb6ddf4db592c0faed60685047a361b1');
        const script = Script.fromData(bytes, false);

        const output = new Output(value, script);
        expect(output.valid).toBe(true);
        expect(output.script).toBe(script);
        expect(output.value).toBe(value);
    });

    it('Should construct a valid output from bytes', () => {
        const output = Output.fromData(validRawOutput);
        expect(output).toBeDefined();
        expect(output?.valid).toBe(true);
        expect(output?.script).toBeDefined();
        expect(output?.value).toBe(0x53020n);
        //TODO: token data
        // REQUIRE( ! instance.token_data().has_value());
    });

    it('Should construct an invalid output from insufficient bytes', () => {
        const data = new Uint8Array(2);
        const output = Output.fromData(data);
        expect(output).toBeUndefined();
    });

    it('Should serialize and deserialize a valid output', () => {
        const output = Output.fromData(validRawOutput);
        expect(output).toBeDefined();
        expect(output?.valid).toBe(true);
        expect(output?.serializedSize(true)).toBe(validRawOutput.length);
        expect(output?.toData(true)).toEqual(validRawOutput);
    });

});


// TEST_CASE("output signature operations  always  returns script sigops false", "[output]") {
//     chain::output instance;
//     REQUIRE(instance.script().sigops(false) == instance.signature_operations(false));
//     REQUIRE( ! instance.token_data().has_value());
// }

// TEST_CASE("output value  roundtrip  success", "[output]") {
//     uint64_t expected = 523542u;
//     chain::output instance;
//     REQUIRE(expected != instance.value());
//     REQUIRE( ! instance.token_data().has_value());
//     instance.set_value(expected);
//     REQUIRE(expected == instance.value());
//     REQUIRE( ! instance.token_data().has_value());
// }

// TEST_CASE("output script setter 1  roundtrip  success", "[output]") {
//     chain::script value;
//     auto const data = to_chunk(base16_literal("ece424a6bb6ddf4db592c0faed60685047a361b1"));
//     REQUIRE(entity_from_data(value, data, false));

//     chain::output instance;
//     REQUIRE(value != instance.script());
//     REQUIRE( ! instance.token_data().has_value());
//     instance.set_script(value);
//     REQUIRE(value == instance.script());
//     REQUIRE( ! instance.token_data().has_value());
//     auto const& restricted = instance;
//     REQUIRE(value == instance.script());
// }

// TEST_CASE("output script setter 2  roundtrip  success", "[output]") {
//     chain::script value;
//     auto const data = to_chunk(base16_literal("ece424a6bb6ddf4db592c0faed60685047a361b1"));
//     REQUIRE(entity_from_data(value, data, false));

//     // This must be non-const.
//     auto dup_value = value;

//     chain::output instance;
//     REQUIRE(value != instance.script());
//     REQUIRE( ! instance.token_data().has_value());
//     instance.set_script(std::move(dup_value));
//     REQUIRE(value == instance.script());
//     REQUIRE( ! instance.token_data().has_value());
//     auto const& restricted = instance;
//     REQUIRE(value == instance.script());
// }

// TEST_CASE("output operator assign equals 1  always  matches equivalent", "[output]") {
//     chain::output expected;
//     REQUIRE(entity_from_data(expected, valid_raw_output));
//     chain::output instance;
//     instance = create<chain::output>(valid_raw_output);
//     REQUIRE(instance == expected);
// }

// TEST_CASE("output operator assign equals 2  always  matches equivalent", "[output]") {
//     chain::output expected;
//     REQUIRE(entity_from_data(expected, valid_raw_output));
//     chain::output instance;
//     instance = expected;
//     REQUIRE(instance == expected);
// }

// TEST_CASE("output operator boolean equals  duplicates  returns true", "[output]") {
//     chain::output alpha;
//     chain::output beta;
//     REQUIRE(entity_from_data(alpha, valid_raw_output));
//     REQUIRE(entity_from_data(beta, valid_raw_output));
//     REQUIRE(alpha == beta);
// }

// TEST_CASE("output operator boolean equals  differs  returns false", "[output]") {
//     chain::output alpha;
//     chain::output beta;
//     REQUIRE(entity_from_data(alpha, valid_raw_output));
//     REQUIRE(alpha != beta);
// }

// TEST_CASE("output operator boolean not equals  duplicates  returns false", "[output]") {
//     chain::output alpha;
//     chain::output beta;
//     REQUIRE(entity_from_data(alpha, valid_raw_output));
//     REQUIRE(entity_from_data(beta, valid_raw_output));
//     REQUIRE(alpha == beta);
// }

// TEST_CASE("output operator boolean not equals  differs  returns true", "[output]") {
//     chain::output alpha;
//     chain::output beta;
//     REQUIRE(entity_from_data(alpha, valid_raw_output));
//     REQUIRE(alpha != beta);
// }

// // Cash Tokens ------------------------------------------------------------------------------

// TEST_CASE("output deserialization with just FT amount 1", "[output]") {
//     auto const data = to_chunk(base16_literal("2030050000000000" "3c" "efbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb1001" "76a914905f933de850988603aafeeb2fd7fce61e66fe5d88ac"));

//     chain::output instance;
//     REQUIRE(entity_from_data(instance, data));

//     REQUIRE(instance.is_valid());

//     REQUIRE(instance.value() == 0x53020);

//     REQUIRE(instance.token_data().has_value());
//     REQUIRE(encode_base16(instance.token_data().value().id) == "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb");
//     REQUIRE(std::holds_alternative<chain::fungible>(instance.token_data().value().data));
//     auto const& ft = std::get<chain::fungible>(instance.token_data().value().data);
//     REQUIRE(ft.amount == chain::amount_t{0x01});

//     REQUIRE(encode_base16(instance.script().to_data(true)) == "1976a914905f933de850988603aafeeb2fd7fce61e66fe5d88ac");
//     REQUIRE(encode_base16(instance.to_data(true)) == encode_base16(data));
// }

// TEST_CASE("output deserialization with just FT amount 252", "[output]") {
//     auto const data = to_chunk(base16_literal("2030050000000000" "3c" "efbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb10fc" "76a914905f933de850988603aafeeb2fd7fce61e66fe5d88ac"));

//     chain::output instance;
//     REQUIRE(entity_from_data(instance, data));

//     REQUIRE(instance.is_valid());

//     REQUIRE(instance.value() == 0x53020);

//     REQUIRE(instance.token_data().has_value());
//     REQUIRE(encode_base16(instance.token_data().value().id) == "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb");
//     REQUIRE(std::holds_alternative<chain::fungible>(instance.token_data().value().data));
//     auto const& ft = std::get<chain::fungible>(instance.token_data().value().data);
//     REQUIRE(ft.amount == chain::amount_t{252});

//     REQUIRE(encode_base16(instance.script().to_data(true)) == "1976a914905f933de850988603aafeeb2fd7fce61e66fe5d88ac");
//     REQUIRE(encode_base16(instance.to_data(true)) == encode_base16(data));
// }

// TEST_CASE("output deserialization with just FT amount 253", "[output]") {
//     auto const data = to_chunk(base16_literal("2030050000000000" "3e" "efbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb10fdfd00" "76a914905f933de850988603aafeeb2fd7fce61e66fe5d88ac"));

//     chain::output instance;
//     REQUIRE(entity_from_data(instance, data));

//     REQUIRE(instance.is_valid());

//     REQUIRE(instance.value() == 0x53020);

//     REQUIRE(instance.token_data().has_value());
//     REQUIRE(encode_base16(instance.token_data().value().id) == "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb");
//     REQUIRE(std::holds_alternative<chain::fungible>(instance.token_data().value().data));
//     auto const& ft = std::get<chain::fungible>(instance.token_data().value().data);
//     REQUIRE(ft.amount == chain::amount_t{253});

//     REQUIRE(encode_base16(instance.script().to_data(true)) == "1976a914905f933de850988603aafeeb2fd7fce61e66fe5d88ac");
//     REQUIRE(encode_base16(instance.to_data(true)) == encode_base16(data));
// }

// TEST_CASE("output deserialization with just FT amount 9223372036854775807", "[output]") {
//     auto const data = to_chunk(base16_literal("2030050000000000" "44" "efbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb10ffffffffffffffff7f" "76a914905f933de850988603aafeeb2fd7fce61e66fe5d88ac"));

//     chain::output instance;
//     REQUIRE(entity_from_data(instance, data));

//     REQUIRE(instance.is_valid());

//     REQUIRE(instance.value() == 0x53020);

//     REQUIRE(instance.token_data().has_value());
//     REQUIRE(encode_base16(instance.token_data().value().id) == "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb");
//     REQUIRE(std::holds_alternative<chain::fungible>(instance.token_data().value().data));
//     auto const& ft = std::get<chain::fungible>(instance.token_data().value().data);
//     REQUIRE(ft.amount == chain::amount_t{9223372036854775807});

//     REQUIRE(encode_base16(instance.script().to_data(true)) == "1976a914905f933de850988603aafeeb2fd7fce61e66fe5d88ac");
//     REQUIRE(encode_base16(instance.to_data(true)) == encode_base16(data));
// }

// TEST_CASE("output deserialization with just immutable NFT 0-byte commitment", "[output]") {
//     auto const data = to_chunk(base16_literal("2030050000000000" "3b" "efbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb20" "76a914905f933de850988603aafeeb2fd7fce61e66fe5d88ac"));

//     chain::output instance;
//     REQUIRE(entity_from_data(instance, data));

//     REQUIRE(instance.is_valid());

//     REQUIRE(instance.value() == 0x53020);

//     REQUIRE(instance.token_data().has_value());
//     REQUIRE(encode_base16(instance.token_data().value().id) == "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb");
//     REQUIRE(std::holds_alternative<chain::non_fungible>(instance.token_data().value().data));
//     auto const& nft = std::get<chain::non_fungible>(instance.token_data().value().data);
//     REQUIRE(nft.commitment.size() == 0);
//     REQUIRE(nft.capability == chain::capability_t::none); // immutable

//     REQUIRE(encode_base16(instance.script().to_data(true)) == "1976a914905f933de850988603aafeeb2fd7fce61e66fe5d88ac");
//     REQUIRE(encode_base16(instance.to_data(true)) == encode_base16(data));
// }

// TEST_CASE("output deserialization with both - immutable NFT 0-byte commitment - FT amount 1", "[output]") {
//     auto const data = to_chunk(base16_literal("2030050000000000" "3c" "efbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb3001" "76a914905f933de850988603aafeeb2fd7fce61e66fe5d88ac"));

//     chain::output instance;
//     REQUIRE(entity_from_data(instance, data));

//     REQUIRE(instance.is_valid());

//     REQUIRE(instance.value() == 0x53020);

//     REQUIRE(instance.token_data().has_value());
//     REQUIRE(encode_base16(instance.token_data().value().id) == "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb");
//     REQUIRE(std::holds_alternative<chain::both_kinds>(instance.token_data().value().data));
//     auto const& ft = std::get<chain::both_kinds>(instance.token_data().value().data).first;
//     auto const& nft = std::get<chain::both_kinds>(instance.token_data().value().data).second;
//     REQUIRE(ft.amount == chain::amount_t{1});
//     REQUIRE(nft.commitment.size() == 0);
//     REQUIRE(nft.capability == chain::capability_t::none); // immutable

//     REQUIRE(encode_base16(instance.script().to_data(true)) == "1976a914905f933de850988603aafeeb2fd7fce61e66fe5d88ac");
//     REQUIRE(encode_base16(instance.to_data(true)) == encode_base16(data));
// }

// TEST_CASE("output deserialization with both - immutable NFT 0-byte commitment - FT amount 253", "[output]") {
//     auto const data = to_chunk(base16_literal("2030050000000000" "3e" "efbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb30fdfd00" "76a914905f933de850988603aafeeb2fd7fce61e66fe5d88ac"));

//     chain::output instance;
//     REQUIRE(entity_from_data(instance, data));

//     REQUIRE(instance.is_valid());

//     REQUIRE(instance.value() == 0x53020);

//     REQUIRE(instance.token_data().has_value());
//     REQUIRE(encode_base16(instance.token_data().value().id) == "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb");
//     REQUIRE(std::holds_alternative<chain::both_kinds>(instance.token_data().value().data));
//     auto const& ft = std::get<chain::both_kinds>(instance.token_data().value().data).first;
//     auto const& nft = std::get<chain::both_kinds>(instance.token_data().value().data).second;
//     REQUIRE(ft.amount == chain::amount_t{253});
//     REQUIRE(nft.commitment.size() == 0);
//     REQUIRE(nft.capability == chain::capability_t::none); // immutable

//     REQUIRE(encode_base16(instance.script().to_data(true)) == "1976a914905f933de850988603aafeeb2fd7fce61e66fe5d88ac");
//     REQUIRE(encode_base16(instance.to_data(true)) == encode_base16(data));
// }

// TEST_CASE("output deserialization with both - immutable NFT 0-byte commitment - FT amount 9223372036854775807", "[output]") {
//     auto const data = to_chunk(base16_literal("2030050000000000" "44" "efbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb30ffffffffffffffff7f" "76a914905f933de850988603aafeeb2fd7fce61e66fe5d88ac"));

//     chain::output instance;
//     REQUIRE(entity_from_data(instance, data));

//     REQUIRE(instance.is_valid());

//     REQUIRE(instance.value() == 0x53020);

//     REQUIRE(instance.token_data().has_value());
//     REQUIRE(encode_base16(instance.token_data().value().id) == "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb");
//     REQUIRE(std::holds_alternative<chain::both_kinds>(instance.token_data().value().data));
//     auto const& ft = std::get<chain::both_kinds>(instance.token_data().value().data).first;
//     auto const& nft = std::get<chain::both_kinds>(instance.token_data().value().data).second;
//     REQUIRE(ft.amount == chain::amount_t{9223372036854775807});
//     REQUIRE(nft.commitment.size() == 0);
//     REQUIRE(nft.capability == chain::capability_t::none); // immutable

//     REQUIRE(encode_base16(instance.script().to_data(true)) == "1976a914905f933de850988603aafeeb2fd7fce61e66fe5d88ac");
//     REQUIRE(encode_base16(instance.to_data(true)) == encode_base16(data));
// }

// TEST_CASE("output deserialization with just immutable NFT 1-byte commitment", "[output]") {
//     auto const data = to_chunk(base16_literal("2030050000000000" "3d" "efbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb6001cc" "76a914905f933de850988603aafeeb2fd7fce61e66fe5d88ac"));

//     chain::output instance;
//     REQUIRE(entity_from_data(instance, data));

//     REQUIRE(instance.is_valid());

//     REQUIRE(instance.value() == 0x53020);

//     REQUIRE(instance.token_data().has_value());
//     REQUIRE(encode_base16(instance.token_data().value().id) == "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb");
//     REQUIRE(std::holds_alternative<chain::non_fungible>(instance.token_data().value().data));
//     auto const& nft = std::get<chain::non_fungible>(instance.token_data().value().data);
//     REQUIRE(nft.commitment.size() == 1);
//     REQUIRE(encode_base16(nft.commitment) == "cc");
//     REQUIRE(nft.capability == chain::capability_t::none); // immutable

//     REQUIRE(encode_base16(instance.script().to_data(true)) == "1976a914905f933de850988603aafeeb2fd7fce61e66fe5d88ac");
//     REQUIRE(encode_base16(instance.to_data(true)) == encode_base16(data));
// }

// TEST_CASE("output deserialization with both - immutable NFT 1-byte commitment - FT amount 252", "[output]") {
//     auto const data = to_chunk(base16_literal("2030050000000000" "3e" "efbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb7001ccfc" "76a914905f933de850988603aafeeb2fd7fce61e66fe5d88ac"));

//     chain::output instance;
//     REQUIRE(entity_from_data(instance, data));

//     REQUIRE(instance.is_valid());

//     REQUIRE(instance.value() == 0x53020);

//     REQUIRE(instance.token_data().has_value());
//     REQUIRE(encode_base16(instance.token_data().value().id) == "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb");
//     REQUIRE(std::holds_alternative<chain::both_kinds>(instance.token_data().value().data));
//     auto const& ft = std::get<chain::both_kinds>(instance.token_data().value().data).first;
//     auto const& nft = std::get<chain::both_kinds>(instance.token_data().value().data).second;
//     REQUIRE(ft.amount == chain::amount_t{252});
//     REQUIRE(nft.commitment.size() == 1);
//     REQUIRE(encode_base16(nft.commitment) == "cc");
//     REQUIRE(nft.capability == chain::capability_t::none); // immutable

//     REQUIRE(encode_base16(instance.script().to_data(true)) == "1976a914905f933de850988603aafeeb2fd7fce61e66fe5d88ac");
//     REQUIRE(encode_base16(instance.to_data(true)) == encode_base16(data));
// }

// TEST_CASE("output deserialization with both - immutable NFT 2-byte commitment - FT amount 253", "[output]") {
//     auto const data = to_chunk(base16_literal("2030050000000000" "41" "efbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb7002ccccfdfd00" "76a914905f933de850988603aafeeb2fd7fce61e66fe5d88ac"));

//     chain::output instance;
//     REQUIRE(entity_from_data(instance, data));

//     REQUIRE(instance.is_valid());

//     REQUIRE(instance.value() == 0x53020);

//     REQUIRE(instance.token_data().has_value());
//     REQUIRE(encode_base16(instance.token_data().value().id) == "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb");
//     REQUIRE(std::holds_alternative<chain::both_kinds>(instance.token_data().value().data));
//     auto const& ft = std::get<chain::both_kinds>(instance.token_data().value().data).first;
//     auto const& nft = std::get<chain::both_kinds>(instance.token_data().value().data).second;
//     REQUIRE(ft.amount == chain::amount_t{253});
//     REQUIRE(nft.commitment.size() == 2);
//     REQUIRE(encode_base16(nft.commitment) == "cccc");
//     REQUIRE(nft.capability == chain::capability_t::none); // immutable

//     REQUIRE(encode_base16(instance.script().to_data(true)) == "1976a914905f933de850988603aafeeb2fd7fce61e66fe5d88ac");
//     REQUIRE(encode_base16(instance.to_data(true)) == encode_base16(data));
// }

// TEST_CASE("output deserialization with both - immutable NFT 10-byte commitment - FT amount 65535", "[output]") {
//     auto const data = to_chunk(base16_literal("2030050000000000" "49" "efbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb700accccccccccccccccccccfdffff" "76a914905f933de850988603aafeeb2fd7fce61e66fe5d88ac"));

//     chain::output instance;
//     REQUIRE(entity_from_data(instance, data));

//     REQUIRE(instance.is_valid());

//     REQUIRE(instance.value() == 0x53020);

//     REQUIRE(instance.token_data().has_value());
//     REQUIRE(encode_base16(instance.token_data().value().id) == "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb");
//     REQUIRE(std::holds_alternative<chain::both_kinds>(instance.token_data().value().data));
//     auto const& ft = std::get<chain::both_kinds>(instance.token_data().value().data).first;
//     auto const& nft = std::get<chain::both_kinds>(instance.token_data().value().data).second;
//     REQUIRE(ft.amount == chain::amount_t{65535});
//     REQUIRE(nft.commitment.size() == 10);
//     REQUIRE(encode_base16(nft.commitment) == "cccccccccccccccccccc");
//     REQUIRE(nft.capability == chain::capability_t::none); // immutable

//     REQUIRE(encode_base16(instance.script().to_data(true)) == "1976a914905f933de850988603aafeeb2fd7fce61e66fe5d88ac");
//     REQUIRE(encode_base16(instance.to_data(true)) == encode_base16(data));
// }

// TEST_CASE("output deserialization with both - immutable NFT 40-byte commitment - FT amount 65536", "[output]") {
//     auto const data = to_chunk(base16_literal("2030050000000000" "69" "efbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb7028ccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccfe00000100" "76a914905f933de850988603aafeeb2fd7fce61e66fe5d88ac"));

//     chain::output instance;
//     REQUIRE(entity_from_data(instance, data));

//     REQUIRE(instance.is_valid());

//     REQUIRE(instance.value() == 0x53020);

//     REQUIRE(instance.token_data().has_value());
//     REQUIRE(encode_base16(instance.token_data().value().id) == "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb");
//     REQUIRE(std::holds_alternative<chain::both_kinds>(instance.token_data().value().data));
//     auto const& ft = std::get<chain::both_kinds>(instance.token_data().value().data).first;
//     auto const& nft = std::get<chain::both_kinds>(instance.token_data().value().data).second;
//     REQUIRE(ft.amount == chain::amount_t{65536});
//     REQUIRE(nft.commitment.size() == 40);
//     REQUIRE(encode_base16(nft.commitment) == "cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc");
//     REQUIRE(nft.capability == chain::capability_t::none); // immutable

//     REQUIRE(encode_base16(instance.script().to_data(true)) == "1976a914905f933de850988603aafeeb2fd7fce61e66fe5d88ac");
//     REQUIRE(encode_base16(instance.to_data(true)) == encode_base16(data));
// }

// TEST_CASE("output deserialization with just mutable NFT 0-byte commitment", "[output]") {
//     auto const data = to_chunk(base16_literal("2030050000000000" "3b" "efbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb21" "76a914905f933de850988603aafeeb2fd7fce61e66fe5d88ac"));

//     chain::output instance;
//     REQUIRE(entity_from_data(instance, data));

//     REQUIRE(instance.is_valid());

//     REQUIRE(instance.value() == 0x53020);

//     REQUIRE(instance.token_data().has_value());
//     REQUIRE(encode_base16(instance.token_data().value().id) == "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb");
//     REQUIRE(std::holds_alternative<chain::non_fungible>(instance.token_data().value().data));
//     auto const& nft = std::get<chain::non_fungible>(instance.token_data().value().data);
//     REQUIRE(nft.commitment.size() == 0);
//     REQUIRE(nft.capability == chain::capability_t::mut);

//     REQUIRE(encode_base16(instance.script().to_data(true)) == "1976a914905f933de850988603aafeeb2fd7fce61e66fe5d88ac");
//     REQUIRE(encode_base16(instance.to_data(true)) == encode_base16(data));
// }

// TEST_CASE("output deserialization with both - mutable NFT 0-byte commitment - FT amount 4294967295", "[output]") {
//     auto const data = to_chunk(base16_literal("2030050000000000" "40" "efbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb31feffffffff" "76a914905f933de850988603aafeeb2fd7fce61e66fe5d88ac"));

//     chain::output instance;
//     REQUIRE(entity_from_data(instance, data));

//     REQUIRE(instance.is_valid());

//     REQUIRE(instance.value() == 0x53020);

//     REQUIRE(instance.token_data().has_value());
//     REQUIRE(encode_base16(instance.token_data().value().id) == "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb");
//     REQUIRE(std::holds_alternative<chain::both_kinds>(instance.token_data().value().data));
//     auto const& ft = std::get<chain::both_kinds>(instance.token_data().value().data).first;
//     auto const& nft = std::get<chain::both_kinds>(instance.token_data().value().data).second;
//     REQUIRE(ft.amount == chain::amount_t{4294967295});
//     REQUIRE(nft.commitment.size() == 0);
//     REQUIRE(nft.capability == chain::capability_t::mut); // mutable

//     REQUIRE(encode_base16(instance.script().to_data(true)) == "1976a914905f933de850988603aafeeb2fd7fce61e66fe5d88ac");
//     REQUIRE(encode_base16(instance.to_data(true)) == encode_base16(data));
// }

// TEST_CASE("output deserialization with just mutable NFT 1-byte commitment", "[output]") {
//     auto const data = to_chunk(base16_literal("2030050000000000" "3d" "efbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb6101cc" "76a914905f933de850988603aafeeb2fd7fce61e66fe5d88ac"));

//     chain::output instance;
//     REQUIRE(entity_from_data(instance, data));

//     REQUIRE(instance.is_valid());

//     REQUIRE(instance.value() == 0x53020);

//     REQUIRE(instance.token_data().has_value());
//     REQUIRE(encode_base16(instance.token_data().value().id) == "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb");
//     REQUIRE(std::holds_alternative<chain::non_fungible>(instance.token_data().value().data));
//     auto const& nft = std::get<chain::non_fungible>(instance.token_data().value().data);
//     REQUIRE(nft.commitment.size() == 1);
//     REQUIRE(encode_base16(nft.commitment) == "cc");
//     REQUIRE(nft.capability == chain::capability_t::mut); // mutable

//     REQUIRE(encode_base16(instance.script().to_data(true)) == "1976a914905f933de850988603aafeeb2fd7fce61e66fe5d88ac");
//     REQUIRE(encode_base16(instance.to_data(true)) == encode_base16(data));
// }

// TEST_CASE("output deserialization with both - mutable NFT 1-byte commitment - FT amount 4294967296", "[output]") {
//     auto const data = to_chunk(base16_literal("2030050000000000" "46" "efbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb7101ccff0000000001000000" "76a914905f933de850988603aafeeb2fd7fce61e66fe5d88ac"));

//     chain::output instance;
//     REQUIRE(entity_from_data(instance, data));

//     REQUIRE(instance.is_valid());

//     REQUIRE(instance.value() == 0x53020);

//     REQUIRE(instance.token_data().has_value());
//     REQUIRE(encode_base16(instance.token_data().value().id) == "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb");
//     REQUIRE(std::holds_alternative<chain::both_kinds>(instance.token_data().value().data));
//     auto const& ft = std::get<chain::both_kinds>(instance.token_data().value().data).first;
//     auto const& nft = std::get<chain::both_kinds>(instance.token_data().value().data).second;
//     REQUIRE(ft.amount == chain::amount_t{4294967296});
//     REQUIRE(nft.commitment.size() == 1);
//     REQUIRE(encode_base16(nft.commitment) == "cc");
//     REQUIRE(nft.capability == chain::capability_t::mut); // mutable

//     REQUIRE(encode_base16(instance.script().to_data(true)) == "1976a914905f933de850988603aafeeb2fd7fce61e66fe5d88ac");
//     REQUIRE(encode_base16(instance.to_data(true)) == encode_base16(data));
// }

// TEST_CASE("output deserialization with both - mutable NFT 2-byte commitment - FT amount 9223372036854775807", "[output]") {
//     auto const data = to_chunk(base16_literal("2030050000000000" "47" "efbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb7102ccccffffffffffffffff7f" "76a914905f933de850988603aafeeb2fd7fce61e66fe5d88ac"));

//     chain::output instance;
//     REQUIRE(entity_from_data(instance, data));

//     REQUIRE(instance.is_valid());

//     REQUIRE(instance.value() == 0x53020);

//     REQUIRE(instance.token_data().has_value());
//     REQUIRE(encode_base16(instance.token_data().value().id) == "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb");
//     REQUIRE(std::holds_alternative<chain::both_kinds>(instance.token_data().value().data));
//     auto const& ft = std::get<chain::both_kinds>(instance.token_data().value().data).first;
//     auto const& nft = std::get<chain::both_kinds>(instance.token_data().value().data).second;
//     REQUIRE(ft.amount == chain::amount_t{9223372036854775807});
//     REQUIRE(nft.commitment.size() == 2);
//     REQUIRE(encode_base16(nft.commitment) == "cccc");
//     REQUIRE(nft.capability == chain::capability_t::mut); // mutable

//     REQUIRE(encode_base16(instance.script().to_data(true)) == "1976a914905f933de850988603aafeeb2fd7fce61e66fe5d88ac");
//     REQUIRE(encode_base16(instance.to_data(true)) == encode_base16(data));
// }

// TEST_CASE("output deserialization with both - mutable NFT 10-byte commitment - FT amount 1", "[output]") {
//     auto const data = to_chunk(base16_literal("2030050000000000" "47" "efbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb710acccccccccccccccccccc01" "76a914905f933de850988603aafeeb2fd7fce61e66fe5d88ac"));

//     chain::output instance;
//     REQUIRE(entity_from_data(instance, data));

//     REQUIRE(instance.is_valid());

//     REQUIRE(instance.value() == 0x53020);

//     REQUIRE(instance.token_data().has_value());
//     REQUIRE(encode_base16(instance.token_data().value().id) == "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb");
//     REQUIRE(std::holds_alternative<chain::both_kinds>(instance.token_data().value().data));
//     auto const& ft = std::get<chain::both_kinds>(instance.token_data().value().data).first;
//     auto const& nft = std::get<chain::both_kinds>(instance.token_data().value().data).second;
//     REQUIRE(ft.amount == chain::amount_t{1});
//     REQUIRE(nft.commitment.size() == 10);
//     REQUIRE(encode_base16(nft.commitment) == "cccccccccccccccccccc");
//     REQUIRE(nft.capability == chain::capability_t::mut); // mutable

//     REQUIRE(encode_base16(instance.script().to_data(true)) == "1976a914905f933de850988603aafeeb2fd7fce61e66fe5d88ac");
//     REQUIRE(encode_base16(instance.to_data(true)) == encode_base16(data));
// }

// TEST_CASE("output deserialization with both - mutable NFT 40-byte commitment - FT amount 252", "[output]") {
//     auto const data = to_chunk(base16_literal("2030050000000000" "65" "efbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb7128ccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccfc" "76a914905f933de850988603aafeeb2fd7fce61e66fe5d88ac"));

//     chain::output instance;
//     REQUIRE(entity_from_data(instance, data));

//     REQUIRE(instance.is_valid());

//     REQUIRE(instance.value() == 0x53020);

//     REQUIRE(instance.token_data().has_value());
//     REQUIRE(encode_base16(instance.token_data().value().id) == "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb");
//     REQUIRE(std::holds_alternative<chain::both_kinds>(instance.token_data().value().data));
//     auto const& ft = std::get<chain::both_kinds>(instance.token_data().value().data).first;
//     auto const& nft = std::get<chain::both_kinds>(instance.token_data().value().data).second;
//     REQUIRE(ft.amount == chain::amount_t{252});
//     REQUIRE(nft.commitment.size() == 40);
//     REQUIRE(encode_base16(nft.commitment) == "cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc");
//     REQUIRE(nft.capability == chain::capability_t::mut); // mutable

//     REQUIRE(encode_base16(instance.script().to_data(true)) == "1976a914905f933de850988603aafeeb2fd7fce61e66fe5d88ac");
//     REQUIRE(encode_base16(instance.to_data(true)) == encode_base16(data));
// }

// TEST_CASE("output deserialization with just minting NFT 0-byte commitment", "[output]") {
//     auto const data = to_chunk(base16_literal("2030050000000000" "3b" "efbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb22" "76a914905f933de850988603aafeeb2fd7fce61e66fe5d88ac"));

//     chain::output instance;
//     REQUIRE(entity_from_data(instance, data));

//     REQUIRE(instance.is_valid());

//     REQUIRE(instance.value() == 0x53020);

//     REQUIRE(instance.token_data().has_value());
//     REQUIRE(encode_base16(instance.token_data().value().id) == "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb");
//     REQUIRE(std::holds_alternative<chain::non_fungible>(instance.token_data().value().data));
//     auto const& nft = std::get<chain::non_fungible>(instance.token_data().value().data);
//     REQUIRE(nft.commitment.size() == 0);
//     REQUIRE(nft.capability == chain::capability_t::minting);

//     REQUIRE(encode_base16(instance.script().to_data(true)) == "1976a914905f933de850988603aafeeb2fd7fce61e66fe5d88ac");
//     REQUIRE(encode_base16(instance.to_data(true)) == encode_base16(data));
// }

// TEST_CASE("output deserialization with both - minting NFT 0-byte commitment - FT amount 253", "[output]") {
//     auto const data = to_chunk(base16_literal("2030050000000000" "3e" "efbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb32fdfd00" "76a914905f933de850988603aafeeb2fd7fce61e66fe5d88ac"));

//     chain::output instance;
//     REQUIRE(entity_from_data(instance, data));

//     REQUIRE(instance.is_valid());

//     REQUIRE(instance.value() == 0x53020);

//     REQUIRE(instance.token_data().has_value());
//     REQUIRE(encode_base16(instance.token_data().value().id) == "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb");
//     REQUIRE(std::holds_alternative<chain::both_kinds>(instance.token_data().value().data));
//     auto const& ft = std::get<chain::both_kinds>(instance.token_data().value().data).first;
//     auto const& nft = std::get<chain::both_kinds>(instance.token_data().value().data).second;
//     REQUIRE(ft.amount == chain::amount_t{253});
//     REQUIRE(nft.commitment.size() == 0);
//     REQUIRE(nft.capability == chain::capability_t::minting); // minting

//     REQUIRE(encode_base16(instance.script().to_data(true)) == "1976a914905f933de850988603aafeeb2fd7fce61e66fe5d88ac");
//     REQUIRE(encode_base16(instance.to_data(true)) == encode_base16(data));
// }

// TEST_CASE("output deserialization with just minting NFT 1-byte commitment", "[output]") {
//     auto const data = to_chunk(base16_literal("2030050000000000" "3d" "efbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb6201cc" "76a914905f933de850988603aafeeb2fd7fce61e66fe5d88ac"));

//     chain::output instance;
//     REQUIRE(entity_from_data(instance, data));

//     REQUIRE(instance.is_valid());

//     REQUIRE(instance.value() == 0x53020);

//     REQUIRE(instance.token_data().has_value());
//     REQUIRE(encode_base16(instance.token_data().value().id) == "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb");
//     REQUIRE(std::holds_alternative<chain::non_fungible>(instance.token_data().value().data));
//     auto const& nft = std::get<chain::non_fungible>(instance.token_data().value().data);
//     REQUIRE(nft.commitment.size() == 1);
//     REQUIRE(encode_base16(nft.commitment) == "cc");
//     REQUIRE(nft.capability == chain::capability_t::minting); // minting

//     REQUIRE(encode_base16(instance.script().to_data(true)) == "1976a914905f933de850988603aafeeb2fd7fce61e66fe5d88ac");
//     REQUIRE(encode_base16(instance.to_data(true)) == encode_base16(data));
// }

// TEST_CASE("output deserialization with both - minting NFT 1-byte commitment - FT amount 65535", "[output]") {
//     auto const data = to_chunk(base16_literal("2030050000000000" "40" "efbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb7201ccfdffff" "76a914905f933de850988603aafeeb2fd7fce61e66fe5d88ac"));

//     chain::output instance;
//     REQUIRE(entity_from_data(instance, data));

//     REQUIRE(instance.is_valid());

//     REQUIRE(instance.value() == 0x53020);

//     REQUIRE(instance.token_data().has_value());
//     REQUIRE(encode_base16(instance.token_data().value().id) == "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb");
//     REQUIRE(std::holds_alternative<chain::both_kinds>(instance.token_data().value().data));
//     auto const& ft = std::get<chain::both_kinds>(instance.token_data().value().data).first;
//     auto const& nft = std::get<chain::both_kinds>(instance.token_data().value().data).second;
//     REQUIRE(ft.amount == chain::amount_t{65535});
//     REQUIRE(nft.commitment.size() == 1);
//     REQUIRE(encode_base16(nft.commitment) == "cc");
//     REQUIRE(nft.capability == chain::capability_t::minting); // minting

//     REQUIRE(encode_base16(instance.script().to_data(true)) == "1976a914905f933de850988603aafeeb2fd7fce61e66fe5d88ac");
//     REQUIRE(encode_base16(instance.to_data(true)) == encode_base16(data));
// }

// TEST_CASE("output deserialization with both - minting NFT 2-byte commitment - FT amount 65536", "[output]") {
//     auto const data = to_chunk(base16_literal("2030050000000000" "43" "efbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb7202ccccfe00000100" "76a914905f933de850988603aafeeb2fd7fce61e66fe5d88ac"));

//     chain::output instance;
//     REQUIRE(entity_from_data(instance, data));

//     REQUIRE(instance.is_valid());

//     REQUIRE(instance.value() == 0x53020);

//     REQUIRE(instance.token_data().has_value());
//     REQUIRE(encode_base16(instance.token_data().value().id) == "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb");
//     REQUIRE(std::holds_alternative<chain::both_kinds>(instance.token_data().value().data));
//     auto const& ft = std::get<chain::both_kinds>(instance.token_data().value().data).first;
//     auto const& nft = std::get<chain::both_kinds>(instance.token_data().value().data).second;
//     REQUIRE(ft.amount == chain::amount_t{65536});
//     REQUIRE(nft.commitment.size() == 2);
//     REQUIRE(encode_base16(nft.commitment) == "cccc");
//     REQUIRE(nft.capability == chain::capability_t::minting); // minting

//     REQUIRE(encode_base16(instance.script().to_data(true)) == "1976a914905f933de850988603aafeeb2fd7fce61e66fe5d88ac");
//     REQUIRE(encode_base16(instance.to_data(true)) == encode_base16(data));
// }

// TEST_CASE("output deserialization with both - minting NFT 10-byte commitment - FT amount 4294967297", "[output]") {
//     auto const data = to_chunk(base16_literal("2030050000000000" "4f" "efbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb720accccccccccccccccccccff0100000001000000" "76a914905f933de850988603aafeeb2fd7fce61e66fe5d88ac"));

//     chain::output instance;
//     REQUIRE(entity_from_data(instance, data));

//     REQUIRE(instance.is_valid());

//     REQUIRE(instance.value() == 0x53020);

//     REQUIRE(instance.token_data().has_value());
//     REQUIRE(encode_base16(instance.token_data().value().id) == "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb");
//     REQUIRE(std::holds_alternative<chain::both_kinds>(instance.token_data().value().data));
//     auto const& ft = std::get<chain::both_kinds>(instance.token_data().value().data).first;
//     auto const& nft = std::get<chain::both_kinds>(instance.token_data().value().data).second;
//     REQUIRE(ft.amount == chain::amount_t{4294967297});
//     REQUIRE(nft.commitment.size() == 10);
//     REQUIRE(encode_base16(nft.commitment) == "cccccccccccccccccccc");
//     REQUIRE(nft.capability == chain::capability_t::minting); // minting

//     REQUIRE(encode_base16(instance.script().to_data(true)) == "1976a914905f933de850988603aafeeb2fd7fce61e66fe5d88ac");
//     REQUIRE(encode_base16(instance.to_data(true)) == encode_base16(data));
// }

// TEST_CASE("output deserialization with both - minting NFT 40-byte commitment - FT amount 9223372036854775807", "[output]") {
//     auto const data = to_chunk(base16_literal("2030050000000000" "6d" "efbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb7228ccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccffffffffffffffff7f" "76a914905f933de850988603aafeeb2fd7fce61e66fe5d88ac"));

//     chain::output instance;
//     REQUIRE(entity_from_data(instance, data));

//     REQUIRE(instance.is_valid());

//     REQUIRE(instance.value() == 0x53020);

//     REQUIRE(instance.token_data().has_value());
//     REQUIRE(encode_base16(instance.token_data().value().id) == "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb");
//     REQUIRE(std::holds_alternative<chain::both_kinds>(instance.token_data().value().data));
//     auto const& ft = std::get<chain::both_kinds>(instance.token_data().value().data).first;
//     auto const& nft = std::get<chain::both_kinds>(instance.token_data().value().data).second;
//     REQUIRE(ft.amount == chain::amount_t{9223372036854775807});
//     REQUIRE(nft.commitment.size() == 40);
//     REQUIRE(encode_base16(nft.commitment) == "cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc");
//     REQUIRE(nft.capability == chain::capability_t::minting); // minting

//     REQUIRE(encode_base16(instance.script().to_data(true)) == "1976a914905f933de850988603aafeeb2fd7fce61e66fe5d88ac");
//     REQUIRE(encode_base16(instance.to_data(true)) == encode_base16(data));
// }

// TEST_CASE("output deserialization ...", "[output]") {
//     auto const data = to_chunk(base16_literal("e803000000000000" "3c" "efb43378d02ca3a5ef93f150d44b3be4f098f103e4336062ee2142d03ddd9ac629100a" "76a91448a5e322b29f3db7297f4dc744e30bca63a0179d88ac"));

//     chain::output instance;
//     REQUIRE(entity_from_data(instance, data));

//     REQUIRE(instance.is_valid());

//     REQUIRE(instance.value() == 1000);

//     REQUIRE(instance.token_data().has_value());
//     REQUIRE(encode_base16(instance.token_data().value().id) == "b43378d02ca3a5ef93f150d44b3be4f098f103e4336062ee2142d03ddd9ac629");
//     REQUIRE(std::holds_alternative<chain::fungible>(instance.token_data().value().data));
//     auto const& ft = std::get<chain::fungible>(instance.token_data().value().data);
//     REQUIRE(ft.amount == chain::amount_t{0x0a});

//     REQUIRE(encode_base16(instance.script().to_data(true)) == "1976a91448a5e322b29f3db7297f4dc744e30bca63a0179d88ac");
//     REQUIRE(encode_base16(instance.to_data(true)) == encode_base16(data));
// }

// // End Test Suite
