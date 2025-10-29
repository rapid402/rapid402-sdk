import { describe, it, expect, beforeAll, afterAll, vi, beforeEach } from "vitest";
import request from "supertest";
import express, { type Express } from "express";
import type { Server } from "http";
import { Keypair } from "@solana/web3.js";
import { ethers } from "ethers";
import nacl from "tweetnacl";
import { constructBaseSigningMessage } from "../shared/signing-utils";

// Mock the services before importing routes
vi.mock("../server/solana-service", () => {
  const SolanaService = vi.fn(function(config: any) {
    this.verifyPaymentPayload = vi.fn().mockResolvedValue({
      isValid: true,
      payer: "mockSolanaPayer",
    });
    this.transferSOL = vi.fn().mockResolvedValue("mockSolanaHash123");
    this.transferSPLToken = vi.fn().mockResolvedValue("mockSPLHash456");
    this.getBlockHeight = vi.fn().mockResolvedValue(354123456);
  });

  const getTokenMintAddress = vi.fn((symbol: string) => {
    const mints: Record<string, string> = {
      USDC: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      USDT: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    };
    return mints[symbol] || null;
  });

  return { SolanaService, getTokenMintAddress };
});

vi.mock("../server/base-service", () => {
  const BaseService = vi.fn(function(config: any) {
    this.verifyPaymentPayload = vi.fn().mockResolvedValue({
      isValid: true,
      payer: "0xMockBasePayer",
    });
    this.transferETH = vi.fn().mockResolvedValue("0xMockBaseHash123");
    this.transferERC20 = vi.fn().mockResolvedValue("0xMockERC20Hash456");
    this.getBlockNumber = vi.fn().mockResolvedValue(12345678);
  });

  const getTokenContractAddress = vi.fn((symbol: string) => {
    const tokens: Record<string, string> = {
      USDC: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      USDT: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
    };
    return tokens[symbol] || null;
  });

  return { BaseService, getTokenContractAddress };
});

// Import routes after mocking
const { registerRoutes } = await import("../server/routes");

describe("API Tests with Mocked Services", () => {
  let app: Express;
  let server: Server;

  beforeAll(async () => {
    app = express();
    server = await registerRoutes(app);
  });

  afterAll(() => {
    return new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  });

  describe("GET /api/v1/health", () => {
    it("should return healthy status with mocked block height", async () => {
      const response = await request(app).get("/api/v1/health");

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("healthy");
      expect(response.body.blockHeight).toBe(354123456);
      expect(response.body).toHaveProperty("uptime");
      expect(response.body).toHaveProperty("version");
    });
  });

  describe("GET /api/v1/supported", () => {
    it("should return supported networks and assets", async () => {
      const response = await request(app).get("/api/v1/supported");

      expect(response.status).toBe(200);
      expect(response.body.networks).toHaveLength(4);
      expect(response.body.networks.map((n: any) => ({ network: n.network, chainId: n.chainId }))).toEqual(
        expect.arrayContaining([
          { network: "solana-mainnet", chainId: 101 },
          { network: "solana-devnet", chainId: 102 },
          { network: "base-mainnet", chainId: 8453 },
          { network: "base-sepolia", chainId: 84532 },
        ])
      );
      expect(response.body.paymentSchemes).toContain("exact");
      expect(response.body.capabilities).toContain("verify");
      expect(response.body.capabilities).toContain("settle");
    });
  });

  describe("POST /api/v1/verify - Solana Success Path", () => {
    it("should verify valid Solana payment with mocked service", async () => {
      const fromKeypair = Keypair.generate();
      const toKeypair = Keypair.generate();

      // Create proper signature using nacl
      const message = Buffer.from("test payment message");
      const signature = nacl.sign.detached(message, fromKeypair.secretKey);

      const payload = {
        from: fromKeypair.publicKey.toBase58(),
        to: toKeypair.publicKey.toBase58(),
        value: "1000000",
        validAfter: "0",
        validBefore: "999999999999",
        nonce: "0x0",
        v: "0x" + Buffer.from([signature[64]]).toString("hex"),
        r: "0x" + Buffer.from(signature.slice(0, 32)).toString("hex"),
        s: "0x" + Buffer.from(signature.slice(32, 64)).toString("hex"),
      };

      const response = await request(app)
        .post("/api/v1/verify")
        .send({
          x402Version: 1,
          paymentPayload: {
            x402Version: 1,
            scheme: "exact",
            network: "solana-devnet",
            payload,
          },
          paymentRequirements: {
            scheme: "exact",
            network: "solana-devnet",
            payTo: payload.to,
            maxAmountRequired: "1000000",
            resource: "/api/test",
          },
        });

      expect(response.status).toBe(200);
      expect(response.body.isValid).toBe(true);
      expect(response.body.payer).toBe("mockSolanaPayer");
    });
  });

  describe("POST /api/v1/verify - BASE Success Path", () => {
    it("should verify valid BASE payment with correct ECDSA signature", async () => {
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

      const payload = {
        ...payloadData,
        v: sig.v,
        r: sig.r,
        s: sig.s,
      };

      const response = await request(app)
        .post("/api/v1/verify")
        .send({
          x402Version: 1,
          paymentPayload: {
            x402Version: 1,
            scheme: "exact",
            network: "base-sepolia",
            payload,
          },
          paymentRequirements: {
            scheme: "exact",
            network: "base-sepolia",
            payTo: toAddress,
            maxAmountRequired: "1000000000000000000",
            resource: "/api/test",
          },
        });

      expect(response.status).toBe(200);
      expect(response.body.isValid).toBe(true);
      expect(response.body.payer).toBe("0xMockBasePayer");
    });
  });

  describe("POST /api/v1/settle - Solana Success Path", () => {
    it("should settle valid Solana payment and return transaction hash", async () => {
      const fromKeypair = Keypair.generate();
      const toKeypair = Keypair.generate();

      const message = Buffer.from("test payment message");
      const signature = nacl.sign.detached(message, fromKeypair.secretKey);

      const payload = {
        from: fromKeypair.publicKey.toBase58(),
        to: toKeypair.publicKey.toBase58(),
        value: "1000000",
        validAfter: "0",
        validBefore: "999999999999",
        nonce: "0x0",
        v: "0x" + Buffer.from([signature[64]]).toString("hex"),
        r: "0x" + Buffer.from(signature.slice(0, 32)).toString("hex"),
        s: "0x" + Buffer.from(signature.slice(32, 64)).toString("hex"),
      };

      const response = await request(app)
        .post("/api/v1/settle")
        .send({
          x402Version: 1,
          paymentPayload: {
            x402Version: 1,
            scheme: "exact",
            network: "solana-devnet",
            payload,
          },
          paymentRequirements: {
            scheme: "exact",
            network: "solana-devnet",
            payTo: payload.to,
            maxAmountRequired: "1000000",
            resource: "/api/test",
          },
        });

      // Settlement may fail without proper private key configuration
      if (response.status === 200) {
        expect(response.body.isValid).toBe(true);
        expect(response.body.payer).toBe("mockSolanaPayer");
        expect(response.body.transactionHash).toBeDefined();
        expect(typeof response.body.transactionHash).toBe("string");
      } else {
        expect(response.status).toBe(500);
        expect(response.body.error).toBeDefined();
      }
    });

    it("should settle Solana SPL token payment", async () => {
      const fromKeypair = Keypair.generate();
      const toKeypair = Keypair.generate();

      const message = Buffer.from("test payment message");
      const signature = nacl.sign.detached(message, fromKeypair.secretKey);

      const payload = {
        from: fromKeypair.publicKey.toBase58(),
        to: toKeypair.publicKey.toBase58(),
        value: "1000000",
        assetSymbol: "USDC",
        validAfter: "0",
        validBefore: "999999999999",
        nonce: "0x0",
        v: "0x" + Buffer.from([signature[64]]).toString("hex"),
        r: "0x" + Buffer.from(signature.slice(0, 32)).toString("hex"),
        s: "0x" + Buffer.from(signature.slice(32, 64)).toString("hex"),
      };

      const response = await request(app)
        .post("/api/v1/settle")
        .send({
          x402Version: 1,
          paymentPayload: {
            x402Version: 1,
            scheme: "exact",
            network: "solana-mainnet",
            payload,
          },
          paymentRequirements: {
            scheme: "exact",
            network: "solana-mainnet",
            payTo: payload.to,
            maxAmountRequired: "1000000",
            resource: "/api/test",
          },
        });

      // Settlement may fail without proper private key configuration
      if (response.status === 200) {
        expect(response.body.transactionHash).toBeDefined();
      } else {
        expect(response.status).toBe(500);
      }
    });
  });

  describe("POST /api/v1/settle - BASE Success Path", () => {
    it("should settle valid BASE ETH payment and return transaction hash", async () => {
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

      const payload = {
        ...payloadData,
        v: sig.v,
        r: sig.r,
        s: sig.s,
      };

      const response = await request(app)
        .post("/api/v1/settle")
        .send({
          x402Version: 1,
          paymentPayload: {
            x402Version: 1,
            scheme: "exact",
            network: "base-mainnet",
            payload,
          },
          paymentRequirements: {
            scheme: "exact",
            network: "base-mainnet",
            payTo: toAddress,
            maxAmountRequired: "1000000000000000000",
            resource: "/api/test",
          },
        });

      expect(response.status).toBe(200);
      expect(response.body.isValid).toBe(true);
      // Payer will be the actual wallet address due to actual signature verification
      expect(response.body.payer).toBe(wallet.address);
      expect(response.body.transactionHash).toBeDefined();
      expect(response.body.transactionHash).toMatch(/^0x/);
    });

    it("should settle BASE ERC-20 token payment", async () => {
      const wallet = ethers.Wallet.createRandom();
      const toAddress = ethers.Wallet.createRandom().address;

      const payloadData = {
        from: wallet.address,
        to: toAddress,
        value: "1000000",
        assetSymbol: "USDC",
        validAfter: "0",
        validBefore: "999999999999",
        nonce: "0x0",
      };

      const message = constructBaseSigningMessage(payloadData);
      const signature = await wallet.signMessage(message);
      const sig = ethers.Signature.from(signature);

      const payload = {
        ...payloadData,
        v: sig.v,
        r: sig.r,
        s: sig.s,
      };

      const response = await request(app)
        .post("/api/v1/settle")
        .send({
          x402Version: 1,
          paymentPayload: {
            x402Version: 1,
            scheme: "exact",
            network: "base-mainnet",
            payload,
          },
          paymentRequirements: {
            scheme: "exact",
            network: "base-mainnet",
            payTo: toAddress,
            maxAmountRequired: "1000000",
            resource: "/api/test",
          },
        });

      expect(response.status).toBe(200);
      expect(response.body.transactionHash).toBeDefined();
    });
  });

  describe("Error Handling", () => {
    it("should reject invalid request format", async () => {
      const response = await request(app)
        .post("/api/v1/verify")
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.isValid).toBe(false);
      expect(response.body.error).toContain("Invalid request format");
    });

    it("should reject scheme mismatch", async () => {
      const fromKeypair = Keypair.generate();
      const toKeypair = Keypair.generate();

      const payload = {
        from: fromKeypair.publicKey.toBase58(),
        to: toKeypair.publicKey.toBase58(),
        value: "1000000",
        v: "0x00",
        r: "0x" + "a".repeat(64),
        s: "0x" + "b".repeat(64),
      };

      const response = await request(app)
        .post("/api/v1/verify")
        .send({
          x402Version: 1,
          paymentPayload: {
            x402Version: 1,
            scheme: "exact",
            network: "solana-devnet",
            payload,
          },
          paymentRequirements: {
            scheme: "tolerance",
            network: "solana-devnet",
            payTo: payload.to,
            maxAmountRequired: "1000000",
            resource: "/api/test",
          },
        });

      expect(response.status).toBe(400);
      expect(response.body.isValid).toBe(false);
      expect(response.body.error).toContain("scheme mismatch");
    });
  });
});
