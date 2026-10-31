// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

export declare const PRIMARY_RELAY_ENABLED = true;
export declare function selectFreshServerProbes<T extends {
    responseTime: number;
    height?: number;
}>(probes: T[], requireTip: boolean): T[];
type SubscriptionCallback = (status: any) => void;
type ConnectionCallback = () => void;
declare class ElectrumClient {
    private static instance;
    private ws;
    private requestId;
    private pendingRequests;
    private subscriptions;
    private connectionListeners;
    private isConnected;
    private reconnectAttempts;
    private maxReconnectAttempts;
    private connectionPromise;
    private currentServer;
    private useFallback;
    private lastRelayFailureReportAt;
    private constructor();
    static getInstance(): ElectrumClient;
    private reportRelayUnavailable;
    /**
     * Test a single server to see if it's available
     */
    private testServer;
    /**
     * Test servers in parallel and return the fastest responding one
     */
    private findFastestServer;
    /**
     * Select the best available server for reading (localhost if available, otherwise fastest read server)
     */
    private selectReadServer;
    /**
     * Select a server for broadcasting (localhost if available, otherwise fastest broadcast server)
     */
    private selectBroadcastServer;
    private ensureConnection;
    private handleMessage;
    private handleSubscriptionUpdate;
    private sendRequest;
    private handleReconnect;
    private restoreSubscriptions;
    addConnectionListener(callback: ConnectionCallback): () => void;
    getServerFeatures(): Promise<any>;
    subscribeToAddress(address: string, callback: SubscriptionCallback): Promise<void>;
    subscribe(scriptHashOrAddress: string, callback: SubscriptionCallback): Promise<void>;
    unsubscribeFromAddress(address: string, callback?: SubscriptionCallback): Promise<void>;
    getAddressHistory(address: string): Promise<any>;
    getUTXOs(address: string): Promise<any>;
    getBalance(address: string): Promise<any>;
    getTransaction(txid: string): Promise<any>;
    getScriptHashHistory(scriptHash: string): Promise<any>;
    getTransactionHistory(address: string): Promise<any>;
    broadcastTransaction(txHex: string): Promise<string>;
    getTransactions(txids: string[]): Promise<Array<{
        txid: string;
        hex: string;
    } | null>>;
}
export declare const electrumClient: ElectrumClient;
interface WalletData {
    addresses: Array<{
        address: string;
        isUsed: boolean;
    }>;
    usedAddresses: Set<string>;
    firstUnusedIndex: number;
}
export declare function updateAddressUsage(wallet: WalletData): Promise<void>;
export { ElectrumClient };
export type { SubscriptionCallback, WalletData };
