import * as bitcoin from "bitcoinjs-lib";
import * as bitcoinMessage from "bitcoinjs-message";
import * as ecc from "tiny-secp256k1";
import { ECPairFactory } from "ecpair";
import { constructBitcoinSigningMessage } from "../shared/signing-utils";

// Initialize ECPair factory with tiny-secp256k1
const ECPair = ECPairFactory(ecc);

export interface BitcoinConfig {
  rpcUrl: string;
  network: "mainnet" | "testnet";
  facilitatorPrivateKey?: string;
  rpcUser?: string;
  rpcPassword?: string;
}

export class BitcoinService {
  private network: bitcoin.Network;
  private rpcUrl: string;
  private rpcUser?: string;
  private rpcPassword?: string;
  private facilitatorPrivateKey?: string;

  constructor(config: BitcoinConfig) {
    // Parse RPC URL to extract credentials if present
    try {
      const url = new URL(config.rpcUrl);
      this.rpcUser = config.rpcUser || url.username || undefined;
      this.rpcPassword = config.rpcPassword || url.password || undefined;
      // Remove credentials from URL for actual requests
      url.username = '';
      url.password = '';
      this.rpcUrl = url.toString();
    } catch {
      // If URL parsing fails, use as-is
      this.rpcUrl = config.rpcUrl;
      this.rpcUser = config.rpcUser;
      this.rpcPassword = config.rpcPassword;
    }
    
    this.network =
      config.network === "mainnet"
        ? bitcoin.networks.bitcoin
        : bitcoin.networks.testnet;
    this.facilitatorPrivateKey = config.facilitatorPrivateKey;
  }

  /**
   * Verify a Bitcoin message signature
   * Bitcoin uses a specific message signing format with magic bytes
   */
  async verifyMessageSignature(
    address: string,
    message: string,
    signature: string
  ): Promise<boolean> {
    try {
      // Bitcoin message signing uses a specific format with magic bytes
      // The signature should be base64 encoded
      const signatureBuffer = Buffer.from(signature, "base64");
      
      // Verify the signature against the address using bitcoinjs-message
      // Pass the network object to handle both mainnet and testnet addresses
      return bitcoinMessage.verify(message, address, signatureBuffer, this.network);
    } catch (error) {
      console.error("Bitcoin signature verification error:", error);
      return false;
    }
  }

  /**
   * Verify payment payload structure and signature
   */
  async verifyPaymentPayload(payload: any): Promise<{
    isValid: boolean;
    payer?: string;
    error?: string;
  }> {
    try {
      // Validate required fields
      if (!payload.from || !payload.to || !payload.value) {
        return {
          isValid: false,
          error: "Missing required payment fields",
        };
      }

      // Verify addresses are valid Bitcoin addresses
      if (!this.isValidBitcoinAddress(payload.from) || !this.isValidBitcoinAddress(payload.to)) {
        return {
          isValid: false,
          error: "Invalid Bitcoin address format",
        };
      }

      // Verify signature fields are present
      if (!payload.v || !payload.r || !payload.s) {
        return {
          isValid: false,
          error: "Payment signature missing",
        };
      }

      // Construct the message that was signed
      const message = constructBitcoinSigningMessage(payload);

      // Bitcoin signatures are compact signatures (65 bytes):
      // 1 byte header (recovery ID + flags) + 32 bytes r + 32 bytes s
      // The header byte encodes both recovery ID and compression:
      //   27-30: uncompressed public key (27 + recovery_id)
      //   31-34: compressed public key (31 + recovery_id) - standard for modern wallets
      
      let vByte = typeof payload.v === 'string' 
        ? (payload.v.startsWith('0x') ? parseInt(payload.v, 16) : parseInt(payload.v, 10))
        : payload.v;
      
      // Normalize v to Bitcoin message signature format
      // If v is a raw recovery ID (0-3), convert to Bitcoin header byte
      if (vByte < 27) {
        // Assume compressed public key (standard for modern Bitcoin wallets)
        vByte = 31 + vByte;
      }
      
      // Remove '0x' prefix if present and parse as hex buffers
      const rHex = payload.r.startsWith('0x') ? payload.r.slice(2) : payload.r;
      const sHex = payload.s.startsWith('0x') ? payload.s.slice(2) : payload.s;
      
      // Convert to buffers
      const rBuffer = Buffer.from(rHex, 'hex');
      const sBuffer = Buffer.from(sHex, 'hex');
      
      // Create the compact signature buffer (65 bytes)
      // 1 byte header + 32 bytes r (zero-padded) + 32 bytes s (zero-padded)
      const signatureBuffer = Buffer.alloc(65);
      signatureBuffer[0] = vByte; // Bitcoin message signature header
      
      // Copy r to bytes 1-32, right-aligned (zero-pad left if needed)
      rBuffer.copy(signatureBuffer, 1 + (32 - rBuffer.length));
      
      // Copy s to bytes 33-64, right-aligned (zero-pad left if needed)
      sBuffer.copy(signatureBuffer, 33 + (32 - sBuffer.length));
      
      // Encode as base64 for Bitcoin message verification
      const signatureBase64 = signatureBuffer.toString('base64');
      
      // Verify the signature using bitcoinjs-message
      const isValid = await this.verifyMessageSignature(
        payload.from,
        message,
        signatureBase64
      );

      if (!isValid) {
        return {
          isValid: false,
          error: "Signature verification failed - invalid Bitcoin signature or address mismatch",
        };
      }

      return {
        isValid: true,
        payer: payload.from,
      };
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : "Verification failed",
      };
    }
  }

  /**
   * Validate Bitcoin address format
   */
  private isValidBitcoinAddress(address: string): boolean {
    try {
      bitcoin.address.toOutputScript(address, this.network);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Make a JSON-RPC call to Bitcoin node with authentication
   */
  private async rpcCall(method: string, params: any[] = []): Promise<any> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add HTTP Basic Authentication if credentials are provided
    if (this.rpcUser && this.rpcPassword) {
      const credentials = Buffer.from(`${this.rpcUser}:${this.rpcPassword}`).toString('base64');
      headers['Authorization'] = `Basic ${credentials}`;
    }

    const response = await fetch(this.rpcUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        jsonrpc: '1.0',
        id: 'rapid402',
        method,
        params,
      }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error(
          `Bitcoin RPC authentication failed. Ensure BTC_RPC_USER and BTC_RPC_PASSWORD are configured correctly.`
        );
      }
      throw new Error(`Bitcoin RPC error: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(`Bitcoin RPC error: ${data.error.message}`);
    }

    return data.result;
  }

  /**
   * Import an address as watch-only (does not expose private key)
   * This allows the node to track UTXOs without having access to spending keys
   * 
   * IMPORTANT: This uses rescan=false for performance. For production:
   * 1. Do an initial rescan once: `bitcoin-cli rescanblockchain`
   * 2. OR import with rescan=true on first setup (slow but thorough)
   * 3. OR use descriptor wallets for automatic UTXO tracking
   * 4. OR use an external block explorer API (recommended for most deployments)
   */
  private async importAddressWatchOnly(address: string, rescan: boolean = false): Promise<void> {
    try {
      // Import the address as watch-only
      // rescan=false by default for performance (caller can override)
      try {
        await this.rpcCall('importaddress', [address, `rapid402_${address.substring(0, 8)}`, rescan]);
      } catch (err: any) {
        // Address might already be imported
        if (!err.message?.includes('already have') && 
            !err.message?.includes('duplicate')) {
          throw err;
        }
      }
    } catch (error) {
      // Non-fatal: we can still try to fetch UTXOs even if import fails
      console.warn(`Could not import watch-only address ${address}: ${error}`);
    }
  }

  /**
   * Fetch UTXOs for a Bitcoin address
   * Uses Bitcoin RPC listunspent method with watch-only address tracking
   * 
   * SECURITY NOTE: This method does NOT import private keys. All signing
   * happens locally using PSBT in the transferBTC method.
   * 
   * @param address - The Bitcoin address to fetch UTXOs for
   * @param isFacilitatorAddress - If true, enables rescan to discover pre-existing UTXOs
   */
  private async fetchUTXOs(address: string, isFacilitatorAddress: boolean = false): Promise<Array<{
    txid: string;
    vout: number;
    value: number;
    scriptPubKey: string;
  }>> {
    try {
      // Import address as watch-only (safe - no private key exposure)
      // Enable rescan for facilitator's own address to discover pre-existing funds
      // Keep rescan=false for other addresses (payer addresses) for performance
      await this.importAddressWatchOnly(address, isFacilitatorAddress);

      // Get UTXOs for this address
      const utxos = await this.rpcCall('listunspent', [0, 9999999, [address]]);
      
      if (!utxos || utxos.length === 0) {
        console.warn(
          `No UTXOs found for address ${address}. ` +
          (isFacilitatorAddress 
            ? `The facilitator address may need time to complete the blockchain rescan.`
            : `The address may have no funds.`)
        );
      }
      
      return utxos.map((utxo: any) => ({
        txid: utxo.txid,
        vout: utxo.vout,
        value: Math.floor(utxo.amount * 100000000), // Convert BTC to satoshis
        scriptPubKey: utxo.scriptPubKey,
      }));
    } catch (error) {
      throw new Error(
        `Failed to fetch UTXOs: ${error instanceof Error ? error.message : 'Unknown error'}. ` +
        `Ensure BTC_RPC_URL with valid credentials is configured. ` +
        `For production, consider using a block explorer API or descriptor wallets.`
      );
    }
  }

  /**
   * Broadcast a signed Bitcoin transaction
   * Uses Bitcoin RPC sendrawtransaction method
   */
  private async broadcastTransaction(txHex: string): Promise<string> {
    try {
      const txid = await this.rpcCall('sendrawtransaction', [txHex]);
      return txid;
    } catch (error) {
      throw new Error(
        `Failed to broadcast transaction: ${error instanceof Error ? error.message : 'Unknown error'}. ` +
        `Ensure BTC_RPC_URL is configured with a valid Bitcoin RPC endpoint.`
      );
    }
  }

  /**
   * Transfer BTC to an address
   * Note: Bitcoin uses UTXO model, so this is more complex than account-based chains
   */
  async transferBTC(
    toAddress: string,
    amountSatoshis: bigint
  ): Promise<string> {
    if (!this.facilitatorPrivateKey) {
      throw new Error("Facilitator private key not configured");
    }

    try {
      // Create keypair from private key using ECPair factory
      const keyPair = ECPair.fromPrivateKey(
        Buffer.from(this.facilitatorPrivateKey, 'hex'),
        { network: this.network }
      );

      // Get facilitator's address
      const { address: facilitatorAddress } = bitcoin.payments.p2wpkh({
        pubkey: keyPair.publicKey,
        network: this.network,
      });

      if (!facilitatorAddress) {
        throw new Error("Failed to derive facilitator address");
      }

      // Fetch UTXOs for the facilitator address
      // Enable rescan=true to discover pre-existing funds
      const utxos = await this.fetchUTXOs(facilitatorAddress, true);

      // Select UTXOs to cover amount + estimated fee
      const feeEstimate = 1000; // ~1000 satoshis for a simple transaction
      const totalNeeded = Number(amountSatoshis) + feeEstimate;
      
      let selectedUTXOs: typeof utxos = [];
      let totalInput = 0;
      
      for (const utxo of utxos) {
        selectedUTXOs.push(utxo);
        totalInput += utxo.value;
        if (totalInput >= totalNeeded) break;
      }

      if (totalInput < totalNeeded) {
        throw new Error(
          `Insufficient balance: need ${totalNeeded} satoshis, have ${totalInput}`
        );
      }

      // Build transaction
      const psbt = new bitcoin.Psbt({ network: this.network });

      // Add inputs
      for (const utxo of selectedUTXOs) {
        psbt.addInput({
          hash: utxo.txid,
          index: utxo.vout,
          witnessUtxo: {
            script: Buffer.from(utxo.scriptPubKey, 'hex'),
            value: utxo.value,
          },
        });
      }

      // Add output for recipient
      psbt.addOutput({
        address: toAddress,
        value: Number(amountSatoshis),
      });

      // Add change output if needed
      const change = totalInput - totalNeeded;
      if (change > 546) { // Bitcoin dust limit
        psbt.addOutput({
          address: facilitatorAddress,
          value: change,
        });
      }

      // Sign all inputs
      for (let i = 0; i < selectedUTXOs.length; i++) {
        psbt.signInput(i, keyPair);
      }

      // Finalize and extract transaction
      psbt.finalizeAllInputs();
      const txHex = psbt.extractTransaction().toHex();

      // Broadcast transaction
      const txHash = await this.broadcastTransaction(txHex);

      console.log(`Bitcoin transfer completed: ${amountSatoshis} satoshis to ${toAddress}, txid: ${txHash}`);
      
      return txHash;
    } catch (error) {
      throw new Error(
        `Bitcoin transfer failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Get current block height
   */
  async getBlockHeight(): Promise<number> {
    try {
      // In production, query Bitcoin RPC or block explorer API
      // For now, return a reasonable mock value
      return 850000; // Approximate current Bitcoin block height
    } catch (error) {
      throw new Error("Failed to fetch Bitcoin block height");
    }
  }

  /**
   * Get network name
   */
  getNetworkName(): string {
    return this.network === bitcoin.networks.bitcoin ? "bitcoin-mainnet" : "bitcoin-testnet";
  }

  /**
   * Settle a payment (verify and execute on-chain)
   */
  async settlePayment(payload: any): Promise<{
    isValid: boolean;
    payer?: string;
    transactionHash?: string;
    error?: string;
  }> {
    // First verify the payment
    const verificationResult = await this.verifyPaymentPayload(payload);
    
    if (!verificationResult.isValid) {
      return {
        isValid: false,
        error: verificationResult.error,
      };
    }

    try {
      // Parse the amount (convert from BTC to satoshis if needed)
      let amountSatoshis: bigint;
      if (payload.value.includes('.')) {
        // Value is in BTC, convert to satoshis
        const btcAmount = parseFloat(payload.value);
        amountSatoshis = BigInt(Math.floor(btcAmount * 100000000));
      } else {
        // Value is already in satoshis
        amountSatoshis = BigInt(payload.value);
      }

      // Execute the on-chain transfer
      const txHash = await this.transferBTC(
        payload.to,
        amountSatoshis
      );

      return {
        isValid: true,
        payer: verificationResult.payer,
        transactionHash: txHash,
      };
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : "Settlement failed",
      };
    }
  }
}
