// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

// Ports src/domain/test/machine/opcode.cpp. The assertions of every upstream case (opcode_to_string under a flag set,
// opcode_from_string, opcode_to_hexadecimal, opcode_from_hexadecimal) are in fixtures/opcode_cases.json as the source
// states them and are checked through the Opcode wrapper.
import { Opcode } from '../..';
import { flag } from './support/flags';
import { loadFixture } from './support/fixtures';
import { describeSource, sourceCase } from './support/sourceCase';

interface Step {
    kind: 'toString' | 'toHex' | 'fromString' | 'fromHex';
    code?: string;
    flags?: Array<string>;
    expect?: string;
    text?: string;
    accepted?: boolean;
    expectCode?: string;
}

interface OpcodeCase {
    name: string;
    steps: Array<Step>;
}

const cases = loadFixture<Array<OpcodeCase>>('opcode_cases.json');
const flagsOf = (names: Array<string>) => names.reduce((total, name) => total | flag(name), 0n);

function expectParsed(parsed: string | undefined, step: Step): void {
    if (!step.accepted) {
        expect(parsed).toBeUndefined();
    } else if (step.expectCode === undefined) {
        expect(parsed).toBeDefined();
    } else {
        // Several upstream enumerators share one value (disabled_verif and op_begin, mul2 and 2mul, ...): C++ compares
        // the values, so the comparison here is on the numeric opcode of both names.
        expect(parsed).toBeDefined();
        expect(Opcode.toInt(parsed as any)).toBe(Opcode.toInt(step.expectCode as any));
    }
}

describeSource('src/domain/test/machine/opcode.cpp', () => {
    for (const opcodeCase of cases) {
        sourceCase(opcodeCase.name, () => {
            expect(opcodeCase.steps.length).toBeGreaterThan(0);
            for (const step of opcodeCase.steps) {
                switch (step.kind) {
                    case 'toString':
                        expect(Opcode.toString(step.code as any, flagsOf(step.flags!))).toBe(step.expect);
                        break;
                    case 'toHex':
                        expect(Opcode.toHexadecimal(step.code as any)).toBe(step.expect);
                        break;
                    case 'fromString':
                        expectParsed(Opcode.fromString(step.text!), step);
                        break;
                    case 'fromHex':
                        expectParsed(Opcode.fromHexadecimal(step.text!), step);
                        break;
                }
            }
        });
    }
});
