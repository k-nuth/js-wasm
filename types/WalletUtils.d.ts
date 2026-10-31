// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

/**
 * WalletUtils - Centralized wallet operations to reduce code duplication
 * across different frontend implementations
 */
export declare class WalletUtils {
    /**
     * Fix encrypted seed format - ensures proper 96-byte length
     * This function was duplicated in multiple places in vm-lab
     */
    static fixSeed(seed: Uint8Array): Uint8Array;
    /**
     * Create wallet from encrypted seed - consolidates the common pattern:
     * fixSeed() -> decryptSeed() -> new Wallet()
     */
    static createWalletFromEncryptedSeed(kth: any, selectedWallet: any, password?: string): any;
    /**
     * Normalize Bitcoin Cash address - handles bitcoincash: prefix consistently
     */
    static normalizeAddress(address: string, withPrefix?: boolean): string;
    /**
     * Convert BCH to satoshis (uses existing Bitcoin utility)
     */
    static bitcoinToSatoshis(amount: number): bigint;
    /**
     * Convert satoshis to BCH (uses existing Bitcoin utility)
     */
    static satoshisToBitcoin(satoshis: bigint): number;
    /**
     * Convert token amount to token satoshis (for 2-decimal tokens like mUSD)
     */
    static tokenToSatoshis(amount: number, decimals?: number): number;
    /**
     * Convert token satoshis to token amount
     */
    static satoshisToToken(satoshis: number, decimals?: number): number;
    /**
     * Validate if a wallet is ready for transactions
     */
    static validateWalletForTransaction(selectedWallet: any): void;
    /**
     * Get first address from wallet
     */
    static getFirstAddress(selectedWallet: any): string;
    /**
     * Get change address from wallet (typically same as first address for now)
     */
    static getChangeAddress(selectedWallet: any, addressIndex?: number): string;
}
export default WalletUtils;
