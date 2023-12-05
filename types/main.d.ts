import Kth from './Kth';
import PaymentAddress from './PaymentAddress';
import Wallet from './Wallet';
import loadLib from './wasm/loadLib';
import { free, malloc } from './wasm/mem';
export { loadLib, Kth, PaymentAddress, Wallet, free, malloc };
declare const _default: {
    loadLib: typeof loadLib;
    Kth: typeof Kth;
    PaymentAddress: typeof PaymentAddress;
    Wallet: typeof Wallet;
    free: typeof free;
    malloc: typeof malloc;
};
export default _default;
