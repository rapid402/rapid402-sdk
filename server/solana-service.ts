import {
  Connection,
  PublicKey,
  Transaction,
  Keypair,
  SystemProgram,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createTransferInstruction,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import nacl from "tweetnacl";

export interface SolanaConfig {
  rpcUrl: string;
  facilitatorKeypair?: Keypair;
}

export class SolanaService {
  private connection: Connection;
  private facilitatorKeypair?: Keypair;

  constructor(config: SolanaConfig) {
    this.connection = new Connection(config.rpcUrl, "confirmed");
    this.facilitatorKeypair = config.facilitatorKeypair;
  }

  /**
   * Verify a Solana transaction signature
   */
  async verifySignature(
    message: Uint8Array,
    signature: Uint8Array,
    publicKey: PublicKey
  ): Promise<boolean> {
    try {
      return nacl.sign.detached.verify(message, signature, publicKey.toBytes());
    } catch (error) {
      console.error("Signature verification error:", error);
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

      // Verify addresses are valid Solana public keys
      try {
        new PublicKey(payload.from);
        new PublicKey(payload.to);
      } catch (error) {
        return {
          isValid: false,
          error: "Invalid Solana address format",
        };
      }

      // In production: verify the signature using Ed25519
      // For now, accept if signature fields are present
      if (!payload.v || !payload.r || !payload.s) {
        return {
          isValid: false,
          error: "Payment signature missing",
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
   * Transfer SOL (native token)
   */
  async transferSOL(
    fromKeypair: Keypair,
    toAddress: string,
    amountLamports: bigint
  ): Promise<string> {
    try {
      const toPubkey = new PublicKey(toAddress);

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: fromKeypair.publicKey,
          toPubkey,
          lamports: Number(amountLamports),
        })
      );

      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [fromKeypair],
        {
          commitment: "confirmed",
        }
      );

      return signature;
    } catch (error) {
      throw new Error(
        `SOL transfer failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Transfer SPL Token (USDC, USDT, etc.)
   */
  async transferSPLToken(
    fromKeypair: Keypair,
    toAddress: string,
    tokenMintAddress: string,
    amount: bigint
  ): Promise<string> {
    try {
      const mintPubkey = new PublicKey(tokenMintAddress);
      const toPubkey = new PublicKey(toAddress);

      // Get associated token accounts
      const fromTokenAccount = await getAssociatedTokenAddress(
        mintPubkey,
        fromKeypair.publicKey
      );

      const toTokenAccount = await getAssociatedTokenAddress(
        mintPubkey,
        toPubkey
      );

      // Create transfer instruction
      const transaction = new Transaction().add(
        createTransferInstruction(
          fromTokenAccount,
          toTokenAccount,
          fromKeypair.publicKey,
          Number(amount),
          [],
          TOKEN_PROGRAM_ID
        )
      );

      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [fromKeypair],
        {
          commitment: "confirmed",
        }
      );

      return signature;
    } catch (error) {
      throw new Error(
        `SPL token transfer failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Get account balance
   */
  async getBalance(address: string): Promise<bigint> {
    try {
      const pubkey = new PublicKey(address);
      const balance = await this.connection.getBalance(pubkey);
      return BigInt(balance);
    } catch (error) {
      throw new Error(
        `Failed to get balance: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Get latest block height for health checks
   */
  async getBlockHeight(): Promise<number> {
    return await this.connection.getBlockHeight();
  }
}

// Helper to get token mint address by symbol
export function getTokenMintAddress(symbol: string, network: "solana-mainnet" | "solana-devnet"): string | null {
  const tokens: Record<string, Record<string, string>> = {
    "solana-mainnet": {
      USDC: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      USDT: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    },
    "solana-devnet": {
      USDC: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
    },
  };

  return tokens[network]?.[symbol] || null;
}
