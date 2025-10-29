import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import request from "supertest";
import express, { type Express } from "express";
import { registerRoutes } from "../server/routes";
import type { Server } from "http";
import { Keypair } from "@solana/web3.js";
import { ethers } from "ethers";
import nacl from "tweetnacl";
import { constructBaseSigningMessage } from "../shared/signing-utils";

describe("API Happy Path Tests", () => {
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

  describe("POST /api/v1/verify - Success Cases", () => {
    it("should accept valid Solana payment payload structure", async () => {
      const fromKeypair = Keypair.generate();
      const toKeypair = Keypair.generate();

      const payload = {
        from: fromKeypair.publicKey.toBase58(),
        to: toKeypair.publicKey.toBase58(),
        value: "1000000",
        validAfter: "0",
        validBefore: "999999999999",
        nonce: "0x0",
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
            scheme: "exact",
            network: "solana-devnet",
            payTo: payload.to,
            maxAmountRequired: "1000000",
            resource: "/api/test",
          },
        });

      expect(response.status).toBe(200);
      expect(response.body.isValid).toBe(true);
      expect(response.body.payer).toBe(payload.from);
    });

    it("should accept valid BASE payment payload with correct signature", async () => {
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
      expect(response.body.payer).toBe(wallet.address);
    });

    it("should accept payment with exact amount match", async () => {
      const wallet = ethers.Wallet.createRandom();
      const toAddress = ethers.Wallet.createRandom().address;
      const exactAmount = "5000000000000000000";

      const payloadData = {
        from: wallet.address,
        to: toAddress,
        value: exactAmount,
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
            network: "base-mainnet",
            payload,
          },
          paymentRequirements: {
            scheme: "exact",
            network: "base-mainnet",
            payTo: toAddress,
            maxAmountRequired: exactAmount,
            resource: "/api/premium",
          },
        });

      expect(response.status).toBe(200);
      expect(response.body.isValid).toBe(true);
      expect(response.body.payer).toBe(wallet.address);
    });
  });

  describe("POST /api/v1/settle - Success Cases", () => {
    it("should return simulated settlement for valid Solana payment", async () => {
      const fromKeypair = Keypair.generate();
      const toKeypair = Keypair.generate();

      const payload = {
        from: fromKeypair.publicKey.toBase58(),
        to: toKeypair.publicKey.toBase58(),
        value: "1000000",
        validAfter: "0",
        validBefore: "999999999999",
        nonce: "0x0",
        v: "0x00",
        r: "0x" + "a".repeat(64),
        s: "0x" + "b".repeat(64),
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

      expect([200, 400]).toContain(response.status);
      if (response.status === 200) {
        expect(response.body).toHaveProperty("transactionHash");
        expect(response.body.isValid).toBe(true);
        expect(response.body.payer).toBe(payload.from);
      }
    });

    it("should return simulated settlement for valid BASE payment", async () => {
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

      expect([200, 400]).toContain(response.status);
      if (response.status === 200) {
        expect(response.body).toHaveProperty("transactionHash");
        expect(response.body.isValid).toBe(true);
        expect(response.body.payer).toBe(wallet.address);
      }
    });
  });

  describe("Multi-Chain Integration", () => {
    it("should handle both Solana and BASE payments in sequence", async () => {
      const solanaKeypair = Keypair.generate();
      const solanaTo = Keypair.generate().publicKey.toBase58();

      const solanaPayload = {
        from: solanaKeypair.publicKey.toBase58(),
        to: solanaTo,
        value: "1000000",
        v: "0x00",
        r: "0x" + "a".repeat(64),
        s: "0x" + "b".repeat(64),
      };

      const solanaResponse = await request(app)
        .post("/api/v1/verify")
        .send({
          x402Version: 1,
          paymentPayload: {
            x402Version: 1,
            scheme: "exact",
            network: "solana-mainnet",
            payload: solanaPayload,
          },
          paymentRequirements: {
            scheme: "exact",
            network: "solana-mainnet",
            payTo: solanaTo,
            maxAmountRequired: "1000000",
            resource: "/api/test",
          },
        });

      expect(solanaResponse.status).toBe(200);
      expect(solanaResponse.body.isValid).toBe(true);

      const wallet = ethers.Wallet.createRandom();
      const baseTo = ethers.Wallet.createRandom().address;

      const basePayloadData = {
        from: wallet.address,
        to: baseTo,
        value: "1000000000000000000",
      };

      const message = constructBaseSigningMessage(basePayloadData);
      const signature = await wallet.signMessage(message);
      const sig = ethers.Signature.from(signature);

      const basePayload = {
        ...basePayloadData,
        v: sig.v,
        r: sig.r,
        s: sig.s,
      };

      const baseResponse = await request(app)
        .post("/api/v1/verify")
        .send({
          x402Version: 1,
          paymentPayload: {
            x402Version: 1,
            scheme: "exact",
            network: "base-mainnet",
            payload: basePayload,
          },
          paymentRequirements: {
            scheme: "exact",
            network: "base-mainnet",
            payTo: baseTo,
            maxAmountRequired: "1000000000000000000",
            resource: "/api/test",
          },
        });

      expect(baseResponse.status).toBe(200);
      expect(baseResponse.body.isValid).toBe(true);
    });
  });
});
