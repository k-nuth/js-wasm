// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

// The generated native classes are returned by the public wrappers (toNative(), missingPreviousOutputs(), popNumber(), ...)
// but the package entry exports only a few of them by name. Their static factories are reached here through the class of
// an instance a public call returned, so no module outside the package entry is imported.
import type {
    BigNumberNative, DataStackNative, EcPublicNative, HdPublicNative, MetricsNative, NumberNative, OutputPointNative, PaymentAddressNative,
    OutputNative, PointListNative, PointNative, ProgramNative, ScriptExecutionContextNative, TokenDataNative, TransactionNative
} from '../../../types/wasm/glue';
import {
    EcPublic, HashFunctions, HdPublic, Input, Output, OutputPoint, PaymentAddress, Program, Script, TokenData, TokenDataFungible, Transaction, free
} from '../../..';

const emptyScript = () => new Script(new Uint8Array(0), false);

function classOf<T>(instance: object): T {
    return (instance as { constructor: unknown }).constructor as T;
}

export function outputPointClass(): typeof OutputPointNative {
    const native = new OutputPoint(HashFunctions.nullHash, 0).toNative();
    try {
        return classOf(native);
    } finally {
        free(native);
    }
}

export function pointClass(): typeof PointNative {
    const tx = new Transaction(0, 0, [new Input(new OutputPoint(HashFunctions.nullHash, 0), emptyScript(), 0)], []).toNative();
    try {
        const missing = tx.missingPreviousOutputs();
        const constructor = classOf<typeof PointNative>(missing.nth(0));
        free(missing);
        return constructor;
    } finally {
        free(tx);
    }
}

const BIP32_VECTOR_1_XPUB = 'xpub661MyMwAqRbcFtXgS5sYJABqqG9YLmC4Q1Rdap9gSE8NqtwybGhePY2gZ29ESFjqJoCu1Rupje8YtGqsefD265TMg7usUDFdp6W1EGMcet8';

export function ecPublicClass(): typeof EcPublicNative {
    const native = new EcPublic(HdPublic.fromString(BIP32_VECTOR_1_XPUB)!.point, true).toNative();
    try {
        return classOf(native);
    } finally {
        free(native);
    }
}

export function paymentAddressClass(): typeof PaymentAddressNative {
    const native = PaymentAddress.fromString('bitcoincash:qpzz8n7jp6847yyx8t33matrgcsdx6c0cvmtevrfgz')!.toNative();
    try {
        return classOf(native);
    } finally {
        free(native);
    }
}

export function hdPublicClass(): typeof HdPublicNative {
    const native = HdPublic.fromString(BIP32_VECTOR_1_XPUB)!.toNative();
    try {
        return classOf(native);
    } finally {
        free(native);
    }
}

export function transactionNativeClass(): typeof TransactionNative {
    const native = new Transaction(0, 0, [], []).toNative();
    try {
        return classOf(native);
    } finally {
        free(native);
    }
}

export function outputNativeClass(): typeof OutputNative {
    const native = new Output(0n, emptyScript()).toNative();
    try {
        return classOf(native);
    } finally {
        free(native);
    }
}

export function dataStackClass(): typeof DataStackNative {
    const program = new Program(emptyScript());
    try {
        const native = program.toNative();
        native.push(true);
        return classOf(native.pop(1));
    } finally {
        program.dispose();
    }
}

export function pointListClass(): typeof PointListNative {
    const tx = new Transaction(0, 0, [], []).toNative();
    try {
        const list = tx.previousOutputs();
        const constructor = classOf<typeof PointListNative>(list);
        free(list);
        return constructor;
    } finally {
        free(tx);
    }
}

export function tokenDataClass(): typeof TokenDataNative {
    const native = new TokenData(new Uint8Array(32).fill(1) as any, new TokenDataFungible(1n)).toNative();
    try {
        return classOf(native);
    } finally {
        free(native);
    }
}

export function numberClass(): typeof NumberNative {
    const program = new Program(emptyScript());
    try {
        const native = program.toNative();
        native.push(true);
        const number = native.popNumber(4);
        return classOf(number);
    } finally {
        program.dispose();
    }
}

export function bigNumberClass(): typeof BigNumberNative {
    const program = new Program(emptyScript());
    try {
        const native = program.toNative();
        native.push(true);
        return classOf(native.popBigNumber(4));
    } finally {
        program.dispose();
    }
}

export type {
    BigNumberNative, DataStackNative, EcPublicNative, HdPublicNative, MetricsNative, NumberNative, OutputPointNative, PaymentAddressNative,
    OutputNative, PointListNative, PointNative, ProgramNative, ScriptExecutionContextNative, TokenDataNative, TransactionNative
};
