# Knuth JS-WASM

> Bitcoin Cash WebAssembly library for browsers and Node.js

[![NPM Version](https://img.shields.io/npm/v/@knuth/js-wasm?logo=npm&style=for-the-badge)](https://www.npmjs.com/package/@knuth/js-wasm)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge)](LICENSE.md)
<a target="_blank" href="https://t.me/knuth_cash">![Telegram](https://img.shields.io/badge/telegram-chat-blue.svg?logo=telegram&style=for-the-badge)</a>

**Knuth JS-WASM** provides Bitcoin Cash primitives through WebAssembly. Build wallets, validate addresses and work with transactions in browsers and Node.js. Version 3.0.0 uses KTH 1.5.2 and Emscripten 6.0.13.

## Installation

```bash
npm install @knuth/js-wasm
```

## Quick Start

Load the WebAssembly module before calling native-backed APIs:

```javascript
const { loadLib, PaymentAddress, Kth } = require('@knuth/js-wasm');

async function main() {
    await loadLib(
        require.resolve('@knuth/js-wasm/src/kth.wasm'),
        require.resolve('@knuth/js-wasm')
    );
    console.log(Kth.getLibconfig().cppapiVersion); // 1.5.2

    const address = PaymentAddress.fromString('bitcoincash:qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a');
    if (address) {
        console.log(address.encodedLegacy());
    }
}

main().catch(console.error);
```

The following examples assume `loadLib()` has completed.

## Migrating to 3.0.0

- Use `ScriptFlags` / `ScriptUpgrades` and `bigint` for current script flags; for example, `script.toString(ScriptFlags.noRules)`.
- Construct wallets with `new Wallet(mnemonic, path, network)` or a seed. Release their native state with `wallet.dispose()`.
- Token amounts and satoshi values use `bigint`. Invalid token factories can return no native handle.
- APIs returning native handles transfer ownership as described by their declarations. Release owned handles with `free()` when finished.
- Recompile TypeScript consumers against the declarations shipped with this version.

## Features

### Address Handling

Convert between address formats and validate addresses:

```typescript
import { PaymentAddress } from '@knuth/js-wasm';

// Parse any format (CashAddr, Legacy, CashTokens)
const addr = PaymentAddress.fromString('1P3GQYtcWgZHrrJhUa4ctoQ3QoCU2F65nz');

if (addr) {
    console.log(addr.encodedCashAddr());    // bitcoincash:qrcuqadqrzp2uztjl9wn5sthepkg22majyxw4gmv6p
    console.log(addr.encodedLegacy());      // 1P3GQYtcWgZHrrJhUa4ctoQ3QoCU2F65nz
    console.log(addr.encodedCashTokens());  // bitcoincash:zrcuqadqrzp2uztjl9wn5sthepkg22majypyxk429j
}

// Validate addresses
const isValid = PaymentAddress.isValid('bitcoincash:qrcuqadqrzp2uztjl9wn5sthepkg22majyxw4gmv6p');
console.log(isValid); // true
```

### HD Wallet

Generate addresses from a BIP39 mnemonic:

```typescript
import { Wallet } from '@knuth/js-wasm';

// Your 12 or 24-word BIP39 mnemonic
const mnemonic = ['word1', 'word2', 'word3', '...', 'word12'];
const derivationPath = "m/44'/145'/0'/0";
const network = 'MAINNET';

const wallet = new Wallet(mnemonic, derivationPath, network);

// Get a single address
const address = wallet.getAddress(0);
console.log(address.encoded()); // bitcoincash:qr9sawzzmstkluq9nqefsu7eqya4zk2w7udune2pmf

// Get multiple addresses
const addresses = wallet.getAddresses(5);
addresses.forEach((addr, i) => {
    console.log(`[${i}]: ${addr.encoded()}`);
});
wallet.dispose();
```

### Transactions

Parse and inspect transactions:

```typescript
import { Transaction, hexStrToBytes, encodeHash } from '@knuth/js-wasm';

const txHex = '0100000001c997a5e56e104102fa209c6a852dd90660a20b2d9c352423edce25857fcd3704000000004847304402204e45e16932b8af514961a1d3a1a25fdf3f4f7732e9d624c6c61548ab5fb8cd410220181522ec8eca07de4860a4acdd12909d831cc56cbbac4622082221a8768d1d0901ffffffff0200ca9a3b00000000434104ae1a62fe09c5f51b13905f07f06b99a2f7159b2225f374cd378d71302fa28414e7aab37397f554a7df5f142c21c1b7303b8a0626f1baded5c72a704f7e6cd84cac00286bee0000000043410411db93e1dcdb8a016b49840f8c53bc1eb68a382e97b1482ecad7b148a6909a5cb2e0eaddfb84ccf9744464f82e160bfa9b8b64f9d4c03f999b8643f656b412a3ac00000000';

const tx = Transaction.fromData(hexStrToBytes(txHex));
if (tx) {
    console.log(`TxID: ${encodeHash(tx.hash)}`);
    console.log(`Size: ${tx.serializedSize(true)} bytes`);
    console.log(`Inputs: ${tx.inputs?.length}`);
    console.log(`Outputs: ${tx.outputs?.length}`);
}
```

### Scripts

Work with Bitcoin scripts:

```typescript
import { Script, ScriptFlags, hexStrToBytes } from '@knuth/js-wasm';

// Parse a P2PKH script
const scriptBytes = hexStrToBytes('76a91406ccef231c2db72526df9338894ccf9355e8f12188ac');
const script = Script.fromData(scriptBytes, false);

if (script) {
    console.log(`Type: ${script.pattern()}`);           // pay_public_key_hash
    console.log(`Size: ${script.serializedSize}`); // 25
    console.log(script.toString(ScriptFlags.noRules));               // dup hash160 [...] equalverify checksig
}

// Create scripts from string
const multisig = Script.fromString('2 [pubkey1] [pubkey2] [pubkey3] 3 checkmultisig');
```

### Hashing

Cryptographic hash functions:

```typescript
import { HashFunctions } from '@knuth/js-wasm';

const message = new Uint8Array([72, 101, 108, 108, 111]); // "Hello"

const sha256 = HashFunctions.sha256(message);
const sha256Str = HashFunctions.sha256Str(message);
const ripemd160 = HashFunctions.ripemd160(message);
const hash160 = HashFunctions.hash160(message); // SHA256 + RIPEMD160
```

### CashTokens Support

Parse transactions with fungible and non-fungible tokens:

```typescript
import { Transaction, TokenDataFungible, hexStrToBytes, encodeHash } from '@knuth/js-wasm';

const tx = Transaction.fromData(hexStrToBytes(tokenTxHex));
if (tx && tx.outputs) {
    const output = tx.outputs[0];

    if (output.tokenData) {
        console.log(`Category: ${encodeHash(output.tokenData.category)}`);
        console.log(`Kind: ${output.tokenData.kind}`); // 'fungible' or 'non_fungible'

        if (output.tokenData.data instanceof TokenDataFungible) {
            console.log(`Amount: ${output.tokenData.data.amount}`);
        }
    }
}
```

## Live Demo

Try it in your browser at [kth.cash](https://kth.cash/#wasm-demo) — no installation required!

## API Reference

### Core Classes

| Class | Description |
|-------|-------------|
| `PaymentAddress` | Address parsing, validation, and format conversion |
| `Wallet` | HD wallet with BIP39/BIP44 support |
| `Transaction` | Transaction parsing, creation, and serialization |
| `Script` | Bitcoin script handling and verification |
| `HashFunctions` | SHA256, RIPEMD160, Hash160, and more |
| `Kth` | Library configuration and version info |

### Utilities

| Function | Description |
|----------|-------------|
| `hexStrToBytes(hex)` | Convert hex string to Uint8Array |
| `bytesToHexStr(bytes)` | Convert Uint8Array to hex string |
| `encodeHash(hash)` | Encode hash as hex string (reversed) |
| `decodeHash(hex)` | Decode hex string to hash (reversed) |
| `bitcoinToSatoshis(btc)` | Convert BCH to satoshis |
| `satoshisToBitcoin(sats)` | Convert satoshis to BCH |

## Browser Usage

```html
<script src="https://unpkg.com/@knuth/js-wasm@3.0.0/src/kth.js"></script>
<script>
    const { loadLib, PaymentAddress } = __KTH_MODULE__;
    loadLib(
        'https://unpkg.com/@knuth/js-wasm@3.0.0/src/kth.wasm',
        'https://unpkg.com/@knuth/js-wasm@3.0.0/src/kth.js'
    ).then(() => {
        const address = PaymentAddress.fromString('bitcoincash:qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a');
        if (address) console.log(address.encodedLegacy());
    }).catch(console.error);
</script>
```

## Requirements

- Node.js 22+ or a modern browser with WebAssembly support
- ES2020+ (uses BigInt for satoshi values)

## Development and releases

```sh
yarn install --frozen-lockfile
npm run tscheck
npm test
npm run check:package
```

CI validates Node.js 22, 24 and 26. Package checks load the packed runtime and compile a TypeScript consumer against its
declarations. Pull requests and pushes to master run validation only.

To publish a version, update `package.json`, merge the reviewed change with passing CI, then publish a GitHub release
whose tag is `v<package version>`. The release workflow validates the tagged package before publishing to npm with OIDC
trusted publishing and provenance. Draft and prerelease releases do not publish to npm. The trusted publisher uses
the existing `.github/workflows/kth.yml` workflow.

## Issues

Please report issues in our [main repository](https://github.com/k-nuth/kth/issues).

## License

MIT License - see [LICENSE.md](LICENSE.md)

---

<p align="center">
  <a href="https://kth.cash">Website</a> •
  <a href="https://github.com/k-nuth">GitHub</a> •
  <a href="https://t.me/knuth_cash">Telegram</a> •
  <a href="https://twitter.com/KnuthNode">Twitter</a>
</p>
