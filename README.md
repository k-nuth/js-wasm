# Knuth JS-WASM

> Bitcoin Cash WebAssembly library for browsers and Node.js

[![NPM Version](https://img.shields.io/npm/v/@knuth/js-wasm?logo=npm&style=for-the-badge)](https://www.npmjs.com/package/@knuth/js-wasm)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge)](LICENSE.md)
<a target="_blank" href="https://t.me/knuth_cash">![Telegram](https://img.shields.io/badge/telegram-chat-blue.svg?logo=telegram&style=for-the-badge)</a>

**Knuth JS-WASM** brings the power of a full Bitcoin Cash node to JavaScript through WebAssembly. Build wallets, validate addresses, create transactions, and more — all running natively in the browser or Node.js.

## Installation

```bash
npm install @knuth/js-wasm
```

## Quick Start

```typescript
import { PaymentAddress, Wallet, Kth } from '@knuth/js-wasm';

// Check library info
const config = Kth.getLibconfig();
console.log(`Knuth WASM v${config.wasmLibraryVersion}`);

// Validate and convert addresses
const addr = PaymentAddress.fromString('bitcoincash:qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a');
if (addr) {
    console.log(`Cash Address: ${addr.encodedCashAddr()}`);
    console.log(`Legacy: ${addr.encodedLegacy()}`);
    console.log(`CashTokens: ${addr.encodedCashTokens()}`);
}
```

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

const wallet = Wallet.fromMnemonic(mnemonic, derivationPath, network);

// Get a single address
const address = await wallet.getAddress(0);
console.log(address.encoded()); // bitcoincash:qr9sawzzmstkluq9nqefsu7eqya4zk2w7udune2pmf

// Get multiple addresses
const addresses = await wallet.getAddresses(5);
addresses.forEach((addr, i) => {
    console.log(`[${i}]: ${addr.encoded()}`);
});
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
import { Script, hexStrToBytes } from '@knuth/js-wasm';

// Parse a P2PKH script
const scriptBytes = hexStrToBytes('76a91406ccef231c2db72526df9338894ccf9355e8f12188ac');
const script = Script.fromData(scriptBytes, false);

if (script) {
    console.log(`Type: ${script.type}`);           // pay_public_key_hash
    console.log(`Size: ${script.serializedSize}`); // 25
    console.log(script.toString(0));               // dup hash160 [...] equalverify checksig
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
import { Transaction, hexStrToBytes, encodeHash } from '@knuth/js-wasm';

const tx = Transaction.fromData(hexStrToBytes(tokenTxHex));
if (tx && tx.outputs) {
    const output = tx.outputs[0];

    if (output.tokenData) {
        console.log(`Category: ${encodeHash(output.tokenData.category)}`);
        console.log(`Kind: ${output.tokenData.kind}`); // 'fungible' or 'non_fungible'

        if (output.tokenData.kind === 'fungible') {
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
<script src="https://unpkg.com/@knuth/js-wasm/src/kth.js"></script>
<script>
    // Wait for WASM to load
    Module.onRuntimeInitialized = () => {
        const addr = PaymentAddress.fromString('bitcoincash:qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a');
        console.log(addr.encodedLegacy());
    };
</script>
```

## Requirements

- Node.js 16+ or modern browser with WebAssembly support
- ES2020+ (uses BigInt for satoshi values)

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
