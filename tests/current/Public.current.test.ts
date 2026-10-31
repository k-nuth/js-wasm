// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

// Current public API: behaviour where the historical suites assert the pre-1.x library and the current source differs.
// Each block cites the current source that defines the behaviour; nothing here is a historical expectation rewritten to
// whatever the code returns.
import { Input, InputList, OutputPoint, PaymentAddress, Script, Opcode, Operation, ScriptFlags } from '../..';
import { hexStrToBytes } from '../..';
import { HashFunctions } from '../..';

const validRawHex = '54b755c39207d443fd96a8d12c94446a1c6f66e39c95e894c23418d7501f681b010000006b48304502203267910f55f2297360198fff57a3631be850965344370f732950b47795737875022100f7da90b82d24e6e957264b17d3e5042bab8946ee5fc676d15d915da450151d36012103893d5a06201d5cf61400e96fa4a7514fc12ab45166ace618d68b8066c9c585f9ffffffff';

describe('Input (current API)', () => {
    // kth-master domain/chain/input.hpp declares only input(output_point, script, sequence): no default constructor and no
    // validity predicate (kth-mono-private 6fe93ed had `input() = default` and is_valid()). The wrapper therefore has no
    // `valid`, and refuses to build a native input from missing parts.
    it('is complete only when previous output, script and sequence are all present', () => {
        expect(new Input().hasComponents).toBe(false);
        const input = new Input(new OutputPoint(HashFunctions.nullHash, 5434), Script.fromData(hexStrToBytes('ece424a6bb6ddf4db592c0faed60685047a361b1'), false), 4568656);
        expect(input.hasComponents).toBe(true);
        expect((input as any).valid).toBeUndefined();
    });

    it('refuses to convert an incomplete input, naming what is missing', () => {
        expect(() => new Input().toNative()).toThrow(/previousOutput, script and seq are required/);
        expect(() => new Input(new OutputPoint(HashFunctions.nullHash, 1)).serializedSize(true)).toThrow(/not fully specified/);
    });

    it('decodes real data and re-encodes it byte for byte', () => {
        const input = Input.fromData(hexStrToBytes(validRawHex));
        expect(input?.hasComponents).toBe(true);
        expect(input?.previousOutput?.index).toBe(1);
        expect(input?.seq).toBe(4294967295);
        expect(input?.serializedSize(true)).toBe(hexStrToBytes(validRawHex).length);
    });
});

describe('InputList (current API)', () => {
    it('converts complete inputs and reports their count', () => {
        const make = () => new Input(new OutputPoint(HashFunctions.nullHash, 1), Script.fromData(hexStrToBytes('51'), false), 7);
        const native = InputList.toNative([make(), make(), make()]);
        expect(native.count()).toBe(3);
    });

    it('refuses an incomplete input instead of inventing a default one', () => {
        expect(() => InputList.toNative([new Input(), new Input()])).toThrow(/not fully specified/);
    });
});

describe('Script (current API)', () => {
    // kth-master script.hpp: pattern() returns script_pattern (pay_to_public_key_hash, ...); there is no satoshi_content_size.
    it('classifies a pay-to-public-key-hash script with the current pattern names', () => {
        const script = Script.fromData(hexStrToBytes('76a91406ccef231c2db72526df9338894ccf9355e8f12188ac'), false);
        expect(script?.pattern()).toBe('pay_to_public_key_hash');
        expect(script?.serializedSize).toBe(25);
        expect(script?.sigops).toBe(1);
        expect(script?.isValidOperations).toBe(true);
    });

    it('classifies a lone signature as non-standard', () => {
        const script = Script.fromData(hexStrToBytes('3045022100ff1fc58dbd608e5e05846a8e6b45a46ad49878aef6879ad1a7cf4c5a7f853683022074a6a10f6053ab3cddc5620d169c7374cd42c1416c51b9744db2c8d9febfb84d01'), true);
        expect(script?.pattern()).toBe('non_standard');
    });
});

describe('PaymentAddress (current API)', () => {
    const mainnet = 'qrcuqadqrzp2uztjl9wn5sthepkg22majyxw4gmv6p';

    it('accepts a prefix-less cashaddr as mainnet', () => {
        expect(PaymentAddress.isValid(mainnet)).toBe(true);
        expect(PaymentAddress.fromString(mainnet)?.encodedCashAddr()).toBe('bitcoincash:' + mainnet);
        expect(PaymentAddress.fromString(mainnet)?.encodedLegacy()).toBe('1P3GQYtcWgZHrrJhUa4ctoQ3QoCU2F65nz');
    });

    it('does not take a prefixed address of another network for mainnet', () => {
        expect(PaymentAddress.isValid('bchtest:' + mainnet)).toBe(false);
        expect(PaymentAddress.isValid('not an address')).toBe(false);
    });

    // payment_address.cpp encoded_legacy(): the legacy format has no representation for a 32-byte hash, so the result is
    // an empty string (it used to be a silently truncated, plausible-looking address).
    it('has no legacy form for a 32-byte script hash address', () => {
        const address = PaymentAddress.fromString('bitcoincash:pvstqkm54dtvnpyqxt5m5n7sjsn4enrlxc526xyxlnjkaycdzfeu69reyzmqx');
        expect(address?.encodedCashAddr()).toBe('bitcoincash:pvstqkm54dtvnpyqxt5m5n7sjsn4enrlxc526xyxlnjkaycdzfeu69reyzmqx');
        expect(address?.encodedLegacy()).toBe('');
    });
});

describe('Opcode names (current API)', () => {
    // capi/chain/opcode.h renamed members and lists the old names as aliases; they resolve to the same byte value.
    it('resolves a documented historical name to the member that carries its value', () => {
        expect(Opcode.resolve('disabled_verif')).toBe('op_begin');
        expect(Opcode.toInt('disabled_verif')).toBe(Opcode.toInt('op_begin'));
        expect(Opcode.toString('reserved_137', ScriptFlags.allRules)).toBe(Opcode.toString('op_define', ScriptFlags.allRules));
        expect(new Operation('disabled_mul2').code).toBe('op_lshiftnum');
    });

    it('keeps nop2 / checklocktimeverify and nop3 / checksequenceverify distinct', () => {
        expect(Opcode.fromString('checklocktimeverify')).toBe('nop2');
        expect(Opcode.fromString('checksequenceverify')).toBe('nop3');
        expect(Operation.fromString('nop3')?.code).toBe('nop3');
        expect(new Operation('nop2').toString(ScriptFlags.bip65Rule)).toBe('checklocktimeverify');
        expect(new Operation('nop3').toString(ScriptFlags.bip112Rule)).toBe('checksequenceverify');
    });
});
