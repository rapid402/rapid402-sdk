import { describe, it, expect, vi, beforeEach } from "vitest";
import { Keypair, PublicKey } from "@solana/web3.js";
import { ethers } from "ethers";
import nacl from "tweetnacl";
import { SolanaService } from "../server/solana-service";
import { BaseService } from "../server/base-service";
import { constructBaseSigningMessage } from "../shared/signing-utils";

describe("Signature Verification", () => {
  describe("Solana Ed25519", () => {
    it("should verify valid Ed25519 signature", async () => {
      const solanaService = new SolanaService({
        rpcUrl: "https://api.devnet.solana.com",
      });

      // Create a test keypair
      const keypair = Keypair.generate();
      const message = new Uint8Array(Buffer.from("test message"));

      // Sign the message
      const signature = nacl.sign.detached(message, keypair.secretKey);

      // Verify signature
      const isValid = await solanaService.verifySignature(
        message,
        signature,
        keypair.publicKey
      );

      expect(isValid).toBe(true);
    });

    it("should reject invalid Ed25519 signature", async () => {
      const solanaService = new SolanaService({
        rpcUrl: "https://api.devnet.solana.com",
      });

      const keypair = Keypair.generate();
      const message = new Uint8Array(Buffer.from("test message"));
      const wrongMessage = new Uint8Array(Buffer.from("wrong message"));

      // Sign with one message
      const signature = nacl.sign.detached(message, keypair.secretKey);

      // Try to verify with different message
      const isValid = await solanaService.verifySignature(
        wrongMessage,
        signature,
        keypair.publicKey
      );

      expect(isValid).toBe(false);
    });

    it("should reject signature from wrong keypair", async () => {
      const solanaService = new SolanaService({
        rpcUrl: "https://api.devnet.solana.com",
      });

      const keypair1 = Keypair.generate();
      const keypair2 = Keypair.generate();
      const message = new Uint8Array(Buffer.from("test message"));

      // Sign with keypair1
      const signature = nacl.sign.detached(message, keypair1.secretKey);

      // Try to verify with keypair2's public key
      const isValid = await solanaService.verifySignature(
        message,
        signature,
        keypair2.publicKey
      );

      expect(isValid).toBe(false);
    });

    it("should validate Solana payment payload structure", async () => {
      const solanaService = new SolanaService({
        rpcUrl: "https://api.devnet.solana.com",
      });

      const keypair = Keypair.generate();
      const payload = {
        from: keypair.publicKey.toBase58(),
        to: Keypair.generate().publicKey.toBase58(),
        value: "1000000000",
        v: "0x00",
        r: "0x" + "0".repeat(64),
        s: "0x" + "0".repeat(64),
      };

      const result = await solanaService.verifyPaymentPayload(payload);
      expect(result.isValid).toBe(true);
      expect(result.payer).toBe(payload.from);
    });

    it("should reject Solana payload with invalid address", async () => {
      const solanaService = new SolanaService({
        rpcUrl: "https://api.devnet.solana.com",
      });

      const payload = {
        from: "invalid_address",
        to: Keypair.generate().publicKey.toBase58(),
        value: "1000000000",
        v: "0x00",
        r: "0x" + "0".repeat(64),
        s: "0x" + "0".repeat(64),
      };

      const result = await solanaService.verifyPaymentPayload(payload);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("Invalid Solana address");
    });
  });

  describe("BASE ECDSA", () => {
    it("should verify valid ECDSA signature", async () => {
      const baseService = new BaseService({
        rpcUrl: "https://sepolia.base.org",
      });

      // Create a test wallet
      const wallet = ethers.Wallet.createRandom();
      const message = "test message";

      // Sign the message
      const signature = await wallet.signMessage(message);

      // Verify signature
      const isValid = await baseService.verifySignature(
        message,
        signature,
        wallet.address
      );

      expect(isValid).toBe(true);
    });

    it("should reject invalid ECDSA signature", async () => {
      const baseService = new BaseService({
        rpcUrl: "https://sepolia.base.org",
      });

      const wallet = ethers.Wallet.createRandom();
      const message = "test message";
      const wrongMessage = "wrong message";

      // Sign with one message
      const signature = await wallet.signMessage(message);

      // Try to verify with different message
      const isValid = await baseService.verifySignature(
        wrongMessage,
        signature,
        wallet.address
      );

      expect(isValid).toBe(false);
    });

    it("should reject signature from wrong wallet", async () => {
      const baseService = new BaseService({
        rpcUrl: "https://sepolia.base.org",
      });

      const wallet1 = ethers.Wallet.createRandom();
      const wallet2 = ethers.Wallet.createRandom();
      const message = "test message";

      // Sign with wallet1
      const signature = await wallet1.signMessage(message);

      // Try to verify with wallet2's address
      const isValid = await baseService.verifySignature(
        message,
        signature,
        wallet2.address
      );

      expect(isValid).toBe(false);
    });

    it("should validate BASE payment payload with correct signature", async () => {
      const baseService = new BaseService({
        rpcUrl: "https://sepolia.base.org",
      });

      const wallet = ethers.Wallet.createRandom();
      const toAddress = ethers.Wallet.createRandom().address;

      const payloadData = {
        from: wallet.address,
        to: toAddress,
        value: "1000000000000000000",
        validAfter: "0",
        validBefore: "999999999999",
        nonce: "0x0",
      };

      // Construct message using canonical helper
      const message = constructBaseSigningMessage(payloadData);

      // Sign the message
      const signature = await wallet.signMessage(message);
      const sig = ethers.Signature.from(signature);

      const payload = {
        ...payloadData,
        v: sig.v,
        r: sig.r,
        s: sig.s,
      };

      const result = await baseService.verifyPaymentPayload(payload);
      expect(result.isValid).toBe(true);
      expect(result.payer).toBe(wallet.address);
    });

    it("should handle v value in both decimal and hex formats", async () => {
      const baseService = new BaseService({
        rpcUrl: "https://sepolia.base.org",
      });

      const wallet = ethers.Wallet.createRandom();
      const toAddress = ethers.Wallet.createRandom().address;

      const payloadData = {
        from: wallet.address,
        to: toAddress,
        value: "1000000000000000000",
        validAfter: "0",
        validBefore: "999999999999",
        nonce: "0x0",
      };

      const message = constructBaseSigningMessage(payloadData);
      const signature = await wallet.signMessage(message);
      const sig = ethers.Signature.from(signature);

      // Test with decimal v value
      const payloadDecimal = {
        ...payloadData,
        v: sig.v,
        r: sig.r,
        s: sig.s,
      };

      const resultDecimal = await baseService.verifyPaymentPayload(payloadDecimal);
      expect(resultDecimal.isValid).toBe(true);

      // Test with hex v value
      const payloadHex = {
        ...payloadData,
        v: `0x${sig.v.toString(16)}`,
        r: sig.r,
        s: sig.s,
      };

      const resultHex = await baseService.verifyPaymentPayload(payloadHex);
      expect(resultHex.isValid).toBe(true);
    });

    it("should reject BASE payload with invalid address", async () => {
      const baseService = new BaseService({
        rpcUrl: "https://sepolia.base.org",
      });

      const payload = {
        from: "invalid_address",
        to: ethers.Wallet.createRandom().address,
        value: "1000000000000000000",
        v: 27,
        r: "0x" + "0".repeat(64),
        s: "0x" + "0".repeat(64),
      };

      const result = await baseService.verifyPaymentPayload(payload);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("Invalid Ethereum address");
    });

    it("should use canonical message format from shared utility", () => {
      const payload = {
        from: "0x1234567890123456789012345678901234567890",
        to: "0x0987654321098765432109876543210987654321",
        value: "1000000000000000000",
        validAfter: "0",
        validBefore: "999999999999",
        nonce: "0x0",
      };

      const message = constructBaseSigningMessage(payload);

      // Verify format is pipe-delimited
      expect(message).toBe(
        "0x1234567890123456789012345678901234567890|0x0987654321098765432109876543210987654321|1000000000000000000|0|999999999999|0x0"
      );
    });

    it("should apply default values when optional fields are omitted", () => {
      const payload = {
        from: "0x1234567890123456789012345678901234567890",
        to: "0x0987654321098765432109876543210987654321",
        value: "1000000000000000000",
      };

      const message = constructBaseSigningMessage(payload);

      // Should have default values for validAfter, validBefore, nonce
      expect(message).toBe(
        "0x1234567890123456789012345678901234567890|0x0987654321098765432109876543210987654321|1000000000000000000|0|999999999999|0x0"
      );
    });
  });
});
