import { ethers } from "ethers";

export interface BaseConfig {
  rpcUrl: string;
  facilitatorPrivateKey?: string;
}

export class BaseService {
  private provider: ethers.JsonRpcProvider;
  private facilitatorWallet?: ethers.Wallet;

  constructor(config: BaseConfig) {
    this.provider = new ethers.JsonRpcProvider(config.rpcUrl);
    if (config.facilitatorPrivateKey) {
      this.facilitatorWallet = new ethers.Wallet(
        config.facilitatorPrivateKey,
        this.provider
      );
    }
  }

  /**
   * Verify an Ethereum/BASE transaction signature (ECDSA)
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

      // Verify addresses are valid Ethereum addresses
      if (!ethers.isAddress(payload.from) || !ethers.isAddress(payload.to)) {
        return {
          isValid: false,
          error: "Invalid Ethereum address format",
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
      // CRITICAL: This message format must match exactly what the SDK uses
      // Format: from|to|value|validAfter|validBefore|nonce
      // Defaults MUST be:
      //   - validAfter: '0' if not provided
      //   - validBefore: '999999999999' if not provided  
      //   - nonce: '0x0' if not provided
      // Any deviation will cause signature verification to fail
      const message = [
        payload.from,
        payload.to,
        payload.value,
        payload.validAfter || '0',
        payload.validBefore || '999999999999',
        payload.nonce || '0x0'
      ].join('|');

      // Reconstruct signature from v, r, s
      // Handle v as either decimal (27/28) or hex (0x1b/0x1c)
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
   * Transfer ETH (native token)
   */
  async transferETH(
    toAddress: string,
    amountWei: bigint
  ): Promise<string> {
    if (!this.facilitatorWallet) {
      throw new Error("Facilitator wallet not configured");
    }

    try {
      const tx = await this.facilitatorWallet.sendTransaction({
        to: toAddress,
        value: amountWei,
      });

      const receipt = await tx.wait();
      if (!receipt) {
        throw new Error("Transaction failed");
      }

      return receipt.hash;
    } catch (error) {
      throw new Error(
        `ETH transfer failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Transfer ERC-20 Token (USDC, USDT, etc.)
   */
  async transferERC20(
    toAddress: string,
    tokenAddress: string,
    amount: bigint
  ): Promise<string> {
    if (!this.facilitatorWallet) {
      throw new Error("Facilitator wallet not configured");
    }

    try {
      // ERC-20 ABI for transfer function
      const erc20Abi = [
        "function transfer(address to, uint256 amount) returns (bool)",
      ];

      const tokenContract = new ethers.Contract(
        tokenAddress,
        erc20Abi,
        this.facilitatorWallet
      );

      const tx = await tokenContract.transfer(toAddress, amount);
      const receipt = await tx.wait();

      if (!receipt) {
        throw new Error("Transaction failed");
      }

      return receipt.hash;
    } catch (error) {
      throw new Error(
        `ERC-20 transfer failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Get account balance
   */
  async getBalance(address: string): Promise<bigint> {
    try {
      const balance = await this.provider.getBalance(address);
      return balance;
    } catch (error) {
      throw new Error(
        `Failed to get balance: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Get latest block number for health checks
   */
  async getBlockNumber(): Promise<number> {
    return await this.provider.getBlockNumber();
  }
}

// Helper to get token contract address by symbol
export function getTokenContractAddress(
  symbol: string,
  network: "base-mainnet" | "base-sepolia"
): string | null {
  const tokens: Record<string, Record<string, string>> = {
    "base-mainnet": {
      USDC: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      USDT: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
    },
    "base-sepolia": {
      USDC: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    },
  };

  return tokens[network]?.[symbol] || null;
}
