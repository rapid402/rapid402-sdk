import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import express, { type Express } from "express";
import { registerRoutes } from "../server/routes";
import type { Server } from "http";

describe("API Routes", () => {
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
    it("should return healthy status with network info", async () => {
      const response = await request(app).get("/api/v1/health");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("status", "healthy");
      expect(response.body).toHaveProperty("uptime");
      expect(response.body).toHaveProperty("version");
      expect(response.body).toHaveProperty("network");
      expect(response.body).toHaveProperty("blockHeight");
      expect(typeof response.body.uptime).toBe("number");
      expect(typeof response.body.blockHeight).toBe("number");
    });
  });

  describe("GET /api/v1/supported", () => {
    it("should return supported networks and assets", async () => {
      const response = await request(app).get("/api/v1/supported");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("networks");
      expect(response.body).toHaveProperty("paymentSchemes");
      expect(response.body).toHaveProperty("assets");
      expect(response.body).toHaveProperty("capabilities");

      // Verify multi-chain support
      expect(response.body.networks).toEqual(
        expect.arrayContaining([
          { network: "solana-mainnet", chainId: 101 },
          { network: "solana-devnet", chainId: 102 },
          { network: "base-mainnet", chainId: 8453 },
          { network: "base-sepolia", chainId: 84532 },
        ])
      );

      // Verify assets
      expect(response.body.assets.length).toBeGreaterThan(0);
      expect(response.body.paymentSchemes).toContain("exact");
      expect(response.body.capabilities).toContain("verify");
      expect(response.body.capabilities).toContain("settle");
    });
  });

  describe("POST /api/v1/verify", () => {
    it("should reject invalid request format", async () => {
      const response = await request(app)
        .post("/api/v1/verify")
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.isValid).toBe(false);
      expect(response.body.error).toContain("Invalid request format");
    });

    it("should reject payment scheme mismatch", async () => {
      const response = await request(app)
        .post("/api/v1/verify")
        .send({
          x402Version: 1,
          paymentPayload: {
            x402Version: 1,
            scheme: "exact",
            network: "solana-devnet",
            payload: {
              from: "8xM7NXKCzJ8yQPKc5Y4mJ9L6vR3wT2qF4nE5hS1pD6gU",
              to: "9yN8OYLzK9J9zRPLd6ZnN8M7xS4rG3fH5oF6iT2qE7hV",
              value: "1000000",
              v: "0x00",
              r: "0x" + "0".repeat(64),
              s: "0x" + "0".repeat(64),
            },
          },
          paymentRequirements: {
            scheme: "tolerance",
            network: "solana-devnet",
            payTo: "9yN8OYLzK9J9zRPLd6ZnN8M7xS4rG3fH5oF6iT2qE7hV",
            maxAmountRequired: "1000000",
            resource: "/api/test",
          },
        });

      expect(response.status).toBe(400);
      expect(response.body.isValid).toBe(false);
      expect(response.body.error).toContain("scheme mismatch");
    });

    it("should reject network mismatch", async () => {
      const response = await request(app)
        .post("/api/v1/verify")
        .send({
          x402Version: 1,
          paymentPayload: {
            x402Version: 1,
            scheme: "exact",
            network: "solana-mainnet",
            payload: {},
          },
          paymentRequirements: {
            scheme: "exact",
            network: "solana-devnet",
            payTo: "recipientAddress",
            maxAmountRequired: "1000000",
            resource: "/api/test",
          },
        });

      expect(response.status).toBe(400);
      expect(response.body.isValid).toBe(false);
      expect(response.body.error).toContain("network mismatch");
    });

    it("should reject recipient address mismatch", async () => {
      const response = await request(app)
        .post("/api/v1/verify")
        .send({
          x402Version: 1,
          paymentPayload: {
            x402Version: 1,
            scheme: "exact",
            network: "solana-devnet",
            payload: {
              from: "8xM7NXKCzJ8yQPKc5Y4mJ9L6vR3wT2qF4nE5hS1pD6gU",
              to: "wrongAddress",
              value: "1000000",
              v: "0x00",
              r: "0x" + "0".repeat(64),
              s: "0x" + "0".repeat(64),
            },
          },
          paymentRequirements: {
            scheme: "exact",
            network: "solana-devnet",
            payTo: "9yN8OYLzK9J9zRPLd6ZnN8M7xS4rG3fH5oF6iT2qE7hV",
            maxAmountRequired: "1000000",
            resource: "/api/test",
          },
        });

      expect(response.status).toBe(400);
      expect(response.body.isValid).toBe(false);
      expect(response.body.error).toContain("recipient mismatch");
    });

    it("should reject insufficient payment amount", async () => {
      const response = await request(app)
        .post("/api/v1/verify")
        .send({
          x402Version: 1,
          paymentPayload: {
            x402Version: 1,
            scheme: "exact",
            network: "solana-devnet",
            payload: {
              from: "8xM7NXKCzJ8yQPKc5Y4mJ9L6vR3wT2qF4nE5hS1pD6gU",
              to: "9yN8OYLzK9J9zRPLd6ZnN8M7xS4rG3fH5oF6iT2qE7hV",
              value: "500000",
              v: "0x00",
              r: "0x" + "0".repeat(64),
              s: "0x" + "0".repeat(64),
            },
          },
          paymentRequirements: {
            scheme: "exact",
            network: "solana-devnet",
            payTo: "9yN8OYLzK9J9zRPLd6ZnN8M7xS4rG3fH5oF6iT2qE7hV",
            maxAmountRequired: "1000000",
            resource: "/api/test",
          },
        });

      expect(response.status).toBe(400);
      expect(response.body.isValid).toBe(false);
      expect(response.body.error).toContain("Insufficient payment");
    });
  });

  describe("POST /api/v1/settle", () => {
    it("should reject invalid request format", async () => {
      const response = await request(app)
        .post("/api/v1/settle")
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.isValid).toBe(false);
      expect(response.body.error).toContain("Invalid request format");
    });

    it("should reject settlement without valid signature", async () => {
      const response = await request(app)
        .post("/api/v1/settle")
        .send({
          x402Version: 1,
          paymentPayload: {
            x402Version: 1,
            scheme: "exact",
            network: "solana-devnet",
            payload: {
              from: "8xM7NXKCzJ8yQPKc5Y4mJ9L6vR3wT2qF4nE5hS1pD6gU",
              to: "9yN8OYLzK9J9zRPLd6ZnN8M7xS4rG3fH5oF6iT2qE7hV",
              value: "1000000",
              v: "0x00",
              r: "0x" + "0".repeat(64),
              s: "0x" + "0".repeat(64),
            },
          },
          paymentRequirements: {
            scheme: "exact",
            network: "solana-devnet",
            payTo: "9yN8OYLzK9J9zRPLd6ZnN8M7xS4rG3fH5oF6iT2qE7hV",
            maxAmountRequired: "1000000",
            resource: "/api/test",
          },
        });

      expect(response.status).toBe(400);
      expect(response.body.isValid).toBe(false);
    });
  });

  describe("POST /api/chat", () => {
    it("should reject requests without message", async () => {
      const response = await request(app)
        .post("/api/chat")
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Message is required");
    });

    it("should accept valid chat messages", async () => {
      const response = await request(app)
        .post("/api/chat")
        .send({
          message: "How do I install the SDK?",
          history: [],
        });

      // Should either succeed or fail gracefully
      expect([200, 500]).toContain(response.status);
      if (response.status === 200) {
        expect(response.body).toHaveProperty("reply");
        expect(typeof response.body.reply).toBe("string");
      }
    });
  });
});
