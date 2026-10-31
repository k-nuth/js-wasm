// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

// Ports src/domain/test/chain/output.cpp (including the CashTokens deserialization cases) and
// src/c-api/test/chain/output.cpp through the Output wrapper. The 28 deserialization cases are driven by
// fixtures/output_token_cases.json, which holds the serialized outputs and the asserted token fields exactly as the
// upstream test spells them.
import { Output, TokenDataBothKinds, TokenDataFungible, TokenDataNonFungible, bytesToHexStr } from '../..';
import { emptyScript, outputFromHex, sameBytes, scriptFromHex } from './support/chain';
import { loadFixture, namedHex } from './support/fixtures';
import { describeSource, sourceCase } from './support/sourceCase';

const DOMAIN = 'src/domain/test/chain/output.cpp';
const CAPI = 'src/c-api/test/chain/output.cpp';
const SCRIPT_BODY = 'ece424a6bb6ddf4db592c0faed60685047a361b1';

interface TokenCase {
    name: string;
    data: string;
    value: number;
    category: string;
    script: string;
    kind: 'fungible' | 'non_fungible' | 'both_kinds';
    amount: string | null;
    commitmentSize: number | null;
    commitment: string | null;
    capability: 'none' | 'mut' | 'minting' | null;
}

const capabilityName = { none: 'none', mut: 'mutable', minting: 'minting' } as const;
const tokenCases = loadFixture<Array<TokenCase>>('output_token_cases.json');
const validRawOutput = () => namedHex(DOMAIN, 'valid_raw_output');

function roundTrip(output: Output): Output {
    const native = output.toNative();
    return Output.fromNative(native, true);
}

describeSource(DOMAIN, () => {
    sourceCase('output constructor 1 always returns default initialized', () => {
        expect(new Output().valid).toBe(false);
    });

    for (const name of ['output constructor 2 valid input returns input initialized', 'output constructor 3 valid input returns input initialized']) {
        sourceCase(name, () => {
            const script = scriptFromHex(SCRIPT_BODY);
            const instance = roundTrip(new Output(643n, script, undefined));
            expect(instance.valid).toBe(true);
            expect(bytesToHexStr(instance.script!.toData(false))).toBe(SCRIPT_BODY);
            expect(instance.value).toBe(643n);
            expect(instance.tokenData).toBeUndefined();
        });
    }

    sourceCase('output constructor 4 valid input returns input initialized', () => {
        const expected = outputFromHex(validRawOutput());
        const instance = roundTrip(expected);
        expect(instance.valid).toBe(true);
        expect(sameBytes(instance.toData(true), expected.toData(true))).toBe(true);
        expect(instance.value).toBe(0x53020n);
        expect(instance.tokenData).toBeUndefined();
    });

    sourceCase('output constructor 5 valid input returns input initialized', () => {
        const instance = roundTrip(outputFromHex(validRawOutput()));
        expect(instance.valid).toBe(true);
        expect(instance.tokenData).toBeUndefined();
    });

    sourceCase('output from data insufficient bytes failure', () => {
        expect(Output.fromData(new Uint8Array(2))).toBeUndefined();
    });

    for (const name of ['output from data valid input success', 'output factory from data 2 valid input success', 'output factory from data 3 valid input success']) {
        sourceCase(name, () => {
            const raw = validRawOutput();
            const instance = outputFromHex(raw);
            expect(instance.valid).toBe(true);
            expect(instance.serializedSize(true)).toBe(raw.length / 2);
            expect(instance.tokenData).toBeUndefined();
            const resave = instance.toData(true);
            expect(resave.length).toBe(raw.length / 2);
            expect(bytesToHexStr(resave)).toBe(raw);
        });
    }

    sourceCase('output value roundtrip success', () => {
        const instance = new Output(0n, emptyScript());
        expect(instance.value).not.toBe(523542n);
        instance.value = 523542n;
        expect(roundTrip(instance).value).toBe(523542n);
        expect(roundTrip(instance).tokenData).toBeUndefined();
    });

    for (const name of ['output script setter 1 roundtrip success', 'output script setter 2 roundtrip success']) {
        sourceCase(name, () => {
            const value = scriptFromHex(SCRIPT_BODY);
            const instance = new Output(0n, emptyScript());
            expect(bytesToHexStr(instance.script!.toData(false))).not.toBe(SCRIPT_BODY);
            instance.script = value;
            const stored = roundTrip(instance);
            expect(bytesToHexStr(stored.script!.toData(false))).toBe(SCRIPT_BODY);
            expect(stored.tokenData).toBeUndefined();
        });
    }

    const sameOutput = (a: Output, b: Output) => sameBytes(a.toData(true), b.toData(true));
    sourceCase('output operator assign equals 1 always matches equivalent', () => {
        expect(sameOutput(outputFromHex(validRawOutput()), outputFromHex(validRawOutput()))).toBe(true);
    });
    sourceCase('output operator assign equals 2 always matches equivalent', () => {
        const expected = outputFromHex(validRawOutput());
        expect(sameOutput(roundTrip(expected), expected)).toBe(true);
    });
    sourceCase('output operator boolean equals duplicates returns true', () => {
        expect(sameOutput(outputFromHex(validRawOutput()), outputFromHex(validRawOutput()))).toBe(true);
    });
    sourceCase('output operator boolean equals differs returns false', () => {
        expect(sameOutput(outputFromHex(validRawOutput()), new Output(0n, emptyScript()))).toBe(false);
    });
    sourceCase('output operator boolean not equals duplicates returns false', () => {
        expect(sameOutput(outputFromHex(validRawOutput()), outputFromHex(validRawOutput()))).toBe(true);
    });
    sourceCase('output operator boolean not equals differs returns true', () => {
        expect(sameOutput(outputFromHex(validRawOutput()), new Output(0n, emptyScript()))).toBe(false);
    });

    for (const tokenCase of tokenCases) {
        sourceCase(tokenCase.name, () => {
            const instance = outputFromHex(tokenCase.data);
            expect(instance.valid).toBe(true);
            expect(Number(instance.value)).toBe(tokenCase.value);
            const token = instance.tokenData!;
            expect(token).toBeDefined();
            expect(bytesToHexStr(token.category!)).toBe(tokenCase.category);
            if (tokenCase.kind === 'fungible') {
                expect(token.data).toBeInstanceOf(TokenDataFungible);
                expect((token.data as TokenDataFungible).amount).toBe(BigInt(tokenCase.amount!));
            } else if (tokenCase.kind === 'non_fungible') {
                expect(token.data).toBeInstanceOf(TokenDataNonFungible);
                const nft = token.data as TokenDataNonFungible;
                expect(nft.commitment).toHaveLength(tokenCase.commitmentSize!);
                expect(bytesToHexStr(nft.commitment)).toBe(tokenCase.commitment);
                expect(nft.capability).toBe(capabilityName[tokenCase.capability!]);
            } else {
                expect(token.data).toBeInstanceOf(TokenDataBothKinds);
                const both = token.data as TokenDataBothKinds;
                expect(both.fungible.amount).toBe(BigInt(tokenCase.amount!));
                expect(both.nonFungible.commitment).toHaveLength(tokenCase.commitmentSize!);
                expect(bytesToHexStr(both.nonFungible.commitment)).toBe(tokenCase.commitment);
                expect(both.nonFungible.capability).toBe(capabilityName[tokenCase.capability!]);
            }
            expect(bytesToHexStr(instance.script!.toData(true))).toBe(tokenCase.script);
            expect(bytesToHexStr(instance.toData(true))).toBe(tokenCase.data);
        });
    }
});

describeSource(CAPI, () => {
    const VALUE = 523542n;

    sourceCase('C-API Output - default construct is invalid', () => {
        expect(new Output().valid).toBe(false);
    });

    sourceCase('C-API Output - field constructor preserves value and script', () => {
        const output = new Output(VALUE, scriptFromHex(SCRIPT_BODY));
        expect(output.valid).toBe(true);
        const stored = roundTrip(output);
        expect(stored.value).toBe(VALUE);
        expect(stored.tokenData).toBeUndefined();
    });

    sourceCase('C-API Output - from_data insufficient bytes fails', () => {
        expect(Output.fromData(new Uint8Array(5))).toBeUndefined();
    });

    sourceCase('C-API Output - to_data / from_data roundtrip', () => {
        const expected = new Output(VALUE, scriptFromHex(SCRIPT_BODY));
        const raw = expected.toData(true);
        expect(raw.length).toBeGreaterThan(0);
        const parsed = Output.fromData(raw)!;
        expect(parsed).toBeDefined();
        expect(parsed.valid).toBe(true);
        expect(parsed.value).toBe(VALUE);
        expect(sameBytes(parsed.toData(true), raw)).toBe(true);
    });

    sourceCase('C-API Output - value setter roundtrip', () => {
        const output = new Output(0n, emptyScript());
        expect(output.value).not.toBe(VALUE);
        output.value = VALUE;
        expect(roundTrip(output).value).toBe(VALUE);
    });

    sourceCase('C-API Output - script setter roundtrip', () => {
        const output = new Output(0n, emptyScript());
        output.script = scriptFromHex(SCRIPT_BODY);
        expect(roundTrip(output).script).toBeDefined();
    });

    sourceCase('C-API Output - default token_data is NULL', () => {
        expect(new Output().tokenData).toBeUndefined();
    });

    sourceCase('C-API Output - set_token_data NULL clears the optional', () => {
        const output = new Output(0n, emptyScript());
        output.tokenData = undefined;
        expect(roundTrip(output).tokenData).toBeUndefined();
    });

    sourceCase('C-API Output - copy preserves fields', () => {
        const original = new Output(VALUE, scriptFromHex(SCRIPT_BODY));
        const copy = roundTrip(original);
        expect(copy.valid).toBe(true);
        expect(sameBytes(copy.toData(true), original.toData(true))).toBe(true);
        expect(copy.value).toBe(VALUE);
    });

    sourceCase('C-API Output - equals different values', () => {
        const a = new Output(VALUE, scriptFromHex(SCRIPT_BODY));
        const b = new Output(VALUE, scriptFromHex(SCRIPT_BODY));
        const c = new Output(0n, emptyScript());
        expect(sameBytes(a.toData(true), b.toData(true))).toBe(true);
        expect(sameBytes(a.toData(true), c.toData(true))).toBe(false);
    });
});
