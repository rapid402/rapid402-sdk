import { ethers } from "ethers";
import { constructBaseSigningMessage } from "../shared/signing-utils";

export interface BscConfig {
  rpcUrl: string;
  facilitatorPrivateKey?: string;
}

export class BscService {
  private provider: ethers.JsonRpcProvider;
  private facilitatorWallet?: ethers.Wallet;

  constructor(config: BscConfig) {
    this.provider = new ethers.JsonRpcProvider(config.rpcUrl);
    if (config.facilitatorPrivateKey) {
      this.facilitatorWallet = new ethers.Wallet(
        config.facilitatorPrivateKey,
        this.provider
      );
    }
  }

  /**
   * Verify an BNB Smart Chain transaction signature (ECDSA)
   */
  async verifySignature(
    message: string,
    signature: string,
    expectedAddress: string
  ): Promise<boolean> {
    try {
      const recoveredAddress = ethers.verifyMessage(message, signature);
      return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
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

      // Verify addresses are valid Ethereum addresses (BSC uses same format)
      if (!ethers.isAddress(payload.from) || !ethers.isAddress(payload.to)) {
        return {
          isValid: false,
          error: "Invalid BSC address format",
        };
      }

      // Verify signature fields are present
      if (!payload.v || !payload.r || !payload.s) {
        return {
          isValid: false,
          error: "Payment signature missing",
        };
      }

      // Construct the message that was signed using canonical helper
      const message = constructBaseSigningMessage(payload);

      // Reconstruct signature from v, r, s
      let vValue: number;
      if (typeof payload.v === 'string' && payload.v.startsWith('0x')) {
        vValue = parseInt(payload.v, 16);
      } else {
        vValue = typeof payload.v === 'number' ? payload.v : parseInt(payload.v, 10);
      }

      const signature = ethers.Signature.from({
        v: vValue,
        r: payload.r,
        s: payload.s,
      });

      // Recover the signer address from the signature
      const recoveredAddress = ethers.verifyMessage(message, signature.serialized);

      // Verify the recovered address matches the claimed sender
      if (recoveredAddress.toLowerCase() !== payload.from.toLowerCase()) {
        return {
          isValid: false,
          error: "Signature verification failed - signer does not match from address",
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
   * Transfer BNB (native token)
   */
  async transferBNB(
    toAddress: string,
    amountWei: bigint
  ): Promise<string> {
    if (!this.facilitatorWallet) {
      throw new Error("Facilitator wallet not configured");
    }

    const tx = await this.facilitatorWallet.sendTransaction({
      to: toAddress,
      value: amountWei,
    });

    await tx.wait();
    return tx.hash;
  }

  /**
   * Transfer BEP-20 tokens
   */
  async transferBEP20(
    tokenAddress: string,
    toAddress: string,
    amount: bigint
  ): Promise<string> {
    if (!this.facilitatorWallet) {
      throw new Error("Facilitator wallet not configured");
    }

    // ERC-20/BEP-20 standard transfer function
    const abi = [
      "function transfer(address to, uint256 amount) returns (bool)",
    ];

    const contract = new ethers.Contract(
      tokenAddress,
      abi,
      this.facilitatorWallet
    );

    const tx = await contract.transfer(toAddress, amount);
    await tx.wait();
    return tx.hash;
  }

  /**
   * Get current block number
   */
  async getBlockNumber(): Promise<number> {
    return await this.provider.getBlockNumber();
  }

  /**
   * Get BNB balance
   */
  async getBalance(address: string): Promise<bigint> {
    return await this.provider.getBalance(address);
  }
}

// BEP-20 token addresses on BSC
export function getTokenContractAddress(symbol: string): string | null {
  const tokens: Record<string, string> = {
    USDT: "0x55d398326f99059fF775485246999027B3197955", // BSC mainnet USDT
    USDC: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d", // BSC mainnet USDC
    BUSD: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56", // BSC mainnet BUSD
  };

  return tokens[symbol] || null;
}
