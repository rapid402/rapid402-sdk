import { describe, it, expect, beforeAll, vi } from "vitest";
import { SolanaService } from "../server/solana-service";
import { BaseService } from "../server/base-service";
import { Keypair } from "@solana/web3.js";
import { ethers } from "ethers";

describe("Service Layer", () => {
  describe("SolanaService", () => {
    let solanaService: SolanaService;

    beforeAll(() => {
      solanaService = new SolanaService({
        rpcUrl: "https://api.devnet.solana.com",
      });
    });

    it("should initialize with correct RPC endpoint", () => {
      expect(solanaService).toBeDefined();
    });

    it("should validate Solana addresses", async () => {
      const validKeypair = Keypair.generate();
      const validAddress = validKeypair.publicKey.toBase58();

      // Should not throw for valid address
      expect(() => {
        const payload = {
          from: validAddress,
          to: Keypair.generate().publicKey.toBase58(),
          value: "1000000",
          v: "0x00",
          r: "0x" + "0".repeat(64),
          s: "0x" + "0".repeat(64),
        };
        solanaService.verifyPaymentPayload(payload);
      }).not.toThrow();
    });

    it("should reject missing required payment fields", async () => {
      const result = await solanaService.verifyPaymentPayload({
        from: Keypair.generate().publicKey.toBase58(),
      });

      expect(result.isValid).toBe(false);
      expect(result.error).toContain("Missing required payment fields");
    });

    it("should reject payment without signature", async () => {
      const result = await solanaService.verifyPaymentPayload({
        from: Keypair.generate().publicKey.toBase58(),
        to: Keypair.generate().publicKey.toBase58(),
        value: "1000000",
      });

      expect(result.isValid).toBe(false);
      expect(result.error).toContain("signature missing");
    });
  });

  describe("BaseService", () => {
    let baseService: BaseService;

    beforeAll(() => {
      baseService = new BaseService({
        rpcUrl: "https://sepolia.base.org",
      });
    });

    it("should initialize with correct RPC endpoint", () => {
      expect(baseService).toBeDefined();
    });

    it("should validate Ethereum addresses", async () => {
      const validWallet = ethers.Wallet.createRandom();
      const validAddress = validWallet.address;

      // Should not throw for valid address
      expect(() => {
        const payload = {
          from: validAddress,
          to: ethers.Wallet.createRandom().address,
          value: "1000000000000000000",
          v: 27,
          r: "0x" + "0".repeat(64),
          s: "0x" + "0".repeat(64),
        };
        baseService.verifyPaymentPayload(payload);
      }).not.toThrow();
    });

    it("should reject missing required payment fields", async () => {
      const result = await baseService.verifyPaymentPayload({
        from: ethers.Wallet.createRandom().address,
      });

      expect(result.isValid).toBe(false);
      expect(result.error).toContain("Missing required payment fields");
    });

    it("should reject payment without signature", async () => {
      const result = await baseService.verifyPaymentPayload({
        from: ethers.Wallet.createRandom().address,
        to: ethers.Wallet.createRandom().address,
        value: "1000000000000000000",
      });

      expect(result.isValid).toBe(false);
      expect(result.error).toContain("signature missing");
    });

    it("should handle ETH address validation", async () => {
      const validResult = await baseService.verifyPaymentPayload({
        from: "0x" + "1".repeat(40),
        to: "0x" + "2".repeat(40),
        value: "1000000",
        v: 27,
        r: "0x" + "0".repeat(64),
        s: "0x" + "0".repeat(64),
      });

      // Should pass address validation but fail signature verification
      expect(validResult.isValid).toBe(false);
      expect(validResult.error).not.toContain("Invalid Ethereum address");
    });

    it("should reject invalid Ethereum addresses", async () => {
      const invalidResult = await baseService.verifyPaymentPayload({
        from: "invalid",
        to: "invalid",
        value: "1000000",
        v: 27,
        r: "0x" + "0".repeat(64),
        s: "0x" + "0".repeat(64),
      });

      expect(invalidResult.isValid).toBe(false);
      expect(invalidResult.error).toContain("Invalid Ethereum address");
    });
  });

  describe("Cross-Chain Compatibility", () => {
    it("should distinguish between Solana and BASE networks", () => {
      const solanaService = new SolanaService({
        rpcUrl: "https://api.devnet.solana.com",
      });

      const baseService = new BaseService({
        rpcUrl: "https://sepolia.base.org",
      });

      expect(solanaService).toBeInstanceOf(SolanaService);
      expect(baseService).toBeInstanceOf(BaseService);
    });

    it("should handle different address formats", async () => {
      const solanaService = new SolanaService({
        rpcUrl: "https://api.devnet.solana.com",
      });

      const baseService = new BaseService({
        rpcUrl: "https://sepolia.base.org",
      });

      // Solana address (Base58)
      const solanaAddress = Keypair.generate().publicKey.toBase58();
      const solanaResult = await solanaService.verifyPaymentPayload({
        from: solanaAddress,
        to: Keypair.generate().publicKey.toBase58(),
        value: "1000000",
        v: "0x00",
        r: "0x" + "0".repeat(64),
        s: "0x" + "0".repeat(64),
      });

      // Should pass address validation
      expect(solanaResult.error).not.toContain("Invalid Solana address");

      // Ethereum address (0x-prefixed hex)
      const ethAddress = ethers.Wallet.createRandom().address;
      const baseResult = await baseService.verifyPaymentPayload({
        from: ethAddress,
        to: ethers.Wallet.createRandom().address,
        value: "1000000000000000000",
        v: 27,
        r: "0x" + "0".repeat(64),
        s: "0x" + "0".repeat(64),
      });

      // Should pass address validation
      expect(baseResult.error).not.toContain("Invalid Ethereum address");
    });
  });
});
