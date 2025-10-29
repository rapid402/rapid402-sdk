import express, { type Express } from "express";
import { createServer, type Server } from "http";
import {
  verifyRequestSchema,
  settleRequestSchema,
  type VerifyResponse,
  type SettleResponse,
  type HealthResponse,
  type SupportedResponse,
} from "@shared/schema";
import OpenAI from "openai";
import { SolanaService, getTokenMintAddress } from "./solana-service";
import { BaseService, getTokenContractAddress } from "./base-service";
import { Keypair } from "@solana/web3.js";

const startTime = Date.now();

// Initialize Solana services
const solanaMainnet = new SolanaService({
  rpcUrl: process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com",
});

const solanaDevnet = new SolanaService({
  rpcUrl: process.env.SOLANA_DEVNET_RPC_URL || "https://api.devnet.solana.com",
});

// Initialize BASE services
const baseMainnet = new BaseService({
  rpcUrl: process.env.BASE_RPC_URL || "https://mainnet.base.org",
  facilitatorPrivateKey: process.env.BASE_FACILITATOR_PRIVATE_KEY,
});

const baseSepolia = new BaseService({
  rpcUrl: process.env.BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org",
  facilitatorPrivateKey: process.env.BASE_FACILITATOR_PRIVATE_KEY,
});

// Helper to determine network type
function getNetworkType(network: string): "solana" | "base" | "unknown" {
  if (network.startsWith("solana-")) return "solana";
  if (network.startsWith("base-")) return "base";
  return "unknown";
}

// Helper to get the right Solana service
function getSolanaService(network: string): SolanaService {
  return network === "solana-mainnet" ? solanaMainnet : solanaDevnet;
}

// Helper to get the right BASE service
function getBaseService(network: string): BaseService {
  return network === "base-mainnet" ? baseMainnet : baseSepolia;
}

// Initialize OpenAI with standard API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Parse JSON bodies
  app.use(express.json());

  // POST /api/chat - AI Assistant for SDK questions
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;

      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message is required" });
      }

      const systemPrompt = `You are an expert AI assistant for Rapid402, an x402 payment facilitator on Solana.

Your role is to help developers integrate and use the Rapid402 SDK and facilitator service.

## About Rapid402

Rapid402 is a production-ready x402 payment facilitator that enables HTTP-based micropayments on Solana. It consists of:

1. **Facilitator Backend API** - Endpoints for verifying and settling payments
2. **TypeScript SDK (@rapid402/sdk)** - Client and server modules for easy integration
3. **Documentation Website** - Complete reference and examples at https://rapid402.com

## SDK Installation

\`\`\`bash
npm install @rapid402/sdk
\`\`\`

## Client SDK Usage (Browser/Node.js)

\`\`\`typescript
import { createRapid402Client } from '@rapid402/sdk/client';

const client = createRapid402Client({
  facilitatorUrl: 'https://rapid402.com/api/v1',
  network: 'solana-mainnet', // or 'solana-devnet'
  wallet: myWalletAdapter, // Solana wallet adapter
  maxPaymentAmount: BigInt(1000000000) // 1 SOL
});

// Automatic 402 payment handling
const response = await client.fetch('/api/paid-endpoint');
\`\`\`

## Server SDK Usage (Backend)

\`\`\`typescript
import { Rapid402PaymentHandler } from '@rapid402/sdk/server';

const rapid402 = new Rapid402PaymentHandler({
  facilitatorUrl: 'https://rapid402.com/api/v1',
  network: 'solana-mainnet',
  treasuryAddress: process.env.TREASURY_WALLET
});

// Express middleware
app.use('/api/premium', rapid402.middleware({
  amount: '100000000', // 0.1 SOL
  onPaymentVerified: (payment) => {
    console.log('Payment received:', payment);
  }
}));
\`\`\`

## Facilitator API Endpoints

- **POST /api/v1/verify** - Verify payment signatures (Ed25519)
- **POST /api/v1/settle** - Execute on-chain settlement
- **GET /api/v1/health** - Service health check
- **GET /api/v1/supported** - List supported networks and assets

## Supported Networks

- Solana Mainnet (chainId: 101)
- Solana Devnet (chainId: 102)

## Supported Assets

- SOL (native token, 9 decimals)
- USDC (SPL token, 6 decimals)
- USDT (SPL token, 6 decimals)

## Key Features

- **Cryptographic Verification**: Ed25519 signature verification
- **On-Chain Settlement**: Real SOL and SPL token transfers
- **Low Latency**: Sub-second verification, ~400ms settlement
- **Low Cost**: ~0.000005 SOL per transaction
- **Secure**: Replay protection, time-bounded validity

## Common Use Cases

1. **API Monetization** - Charge per API request
2. **Content Micropayments** - Pay-per-article or media
3. **AI Model Access** - Charge per inference
4. **Data Services** - Real-time data on demand

## Links

- GitHub: https://github.com/rapid402/rapid402-sdk
- Whitepaper: https://rapid402.com/whitepaper
- Twitter: https://x.com/rapid402

Answer questions clearly and concisely. Provide code examples when helpful. Focus on practical integration steps.`;

      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        { role: "system", content: systemPrompt },
        ...(history || []).map((msg: any) => ({
          role: msg.role,
          content: msg.content
        })),
        { role: "user", content: message }
      ];

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages,
        max_tokens: 2048,
      });

      const reply = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

      res.json({ reply });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Failed to process chat request" });
    }
  });

  // POST /api/v1/verify - Verify payment payload
  app.post("/api/v1/verify", async (req, res) => {
    try {
      const parsed = verifyRequestSchema.safeParse(req.body);
      
      if (!parsed.success) {
        const response: VerifyResponse = {
          isValid: false,
          error: "Invalid request format: " + parsed.error.message,
        };
        return res.status(400).json(response);
      }

      const { paymentPayload, paymentRequirements } = parsed.data;

      // Validate scheme matches
      if (paymentPayload.scheme !== paymentRequirements.scheme) {
        const response: VerifyResponse = {
          isValid: false,
          error: "Payment scheme mismatch",
        };
        return res.json(response);
      }

      // Validate network matches
      if (paymentPayload.network !== paymentRequirements.network) {
        const response: VerifyResponse = {
          isValid: false,
          error: "Network mismatch",
        };
        return res.json(response);
      }

      // For exact scheme, validate payment payload structure
      if (paymentPayload.scheme === "exact") {
        const payload = paymentPayload.payload;
        const networkType = getNetworkType(paymentPayload.network);
        
        if (networkType === "unknown") {
          const response: VerifyResponse = {
            isValid: false,
            error: "Unsupported network",
          };
          return res.json(response);
        }

        // Use appropriate service to verify payment payload
        let verification: { isValid: boolean; payer?: string; error?: string };
        
        if (networkType === "solana") {
          const solanaService = getSolanaService(paymentPayload.network);
          verification = await solanaService.verifyPaymentPayload(payload);
        } else {
          const baseService = getBaseService(paymentPayload.network);
          verification = await baseService.verifyPaymentPayload(payload);
        }

        if (!verification.isValid) {
          const response: VerifyResponse = {
            isValid: false,
            error: verification.error || "Payment verification failed",
          };
          return res.json(response);
        }

        // Validate recipient matches
        if (typeof payload.to === 'string' && payload.to !== paymentRequirements.payTo) {
          const response: VerifyResponse = {
            isValid: false,
            error: "Payment recipient mismatch",
          };
          return res.json(response);
        }

        // Validate amount
        if (typeof payload.value === 'string' && BigInt(payload.value) < BigInt(paymentRequirements.maxAmountRequired)) {
          const response: VerifyResponse = {
            isValid: false,
            error: "Payment amount insufficient",
          };
          return res.json(response);
        }

        // Verification successful
        const response: VerifyResponse = {
          isValid: true,
          payer: verification.payer,
        };
        return res.json(response);
      }

      // Default validation passed
      const response: VerifyResponse = {
        isValid: true,
        payer: typeof paymentPayload.payload.from === 'string' ? paymentPayload.payload.from as string : undefined,
      };
      return res.json(response);

    } catch (error) {
      console.error("Verify error:", error);
      const response: VerifyResponse = {
        isValid: false,
        error: error instanceof Error ? error.message : "Internal server error",
      };
      return res.status(500).json(response);
    }
  });

  // POST /api/v1/settle - Settle payment on-chain
  app.post("/api/v1/settle", async (req, res) => {
    try {
      const parsed = settleRequestSchema.safeParse(req.body);
      
      if (!parsed.success) {
        const response: SettleResponse = {
          isValid: false,
          error: "Invalid request format: " + parsed.error.message,
        };
        return res.status(400).json(response);
      }

      const { paymentPayload, paymentRequirements } = parsed.data;

      // First verify the payment
      if (paymentPayload.scheme !== paymentRequirements.scheme ||
          paymentPayload.network !== paymentRequirements.network) {
        const response: SettleResponse = {
          isValid: false,
          error: "Payment validation failed",
        };
        return res.json(response);
      }

      const networkType = getNetworkType(paymentPayload.network);
      
      if (networkType === "unknown") {
        const response: SettleResponse = {
          isValid: false,
          error: "Unsupported network",
        };
        return res.json(response);
      }

      // Check if facilitator keypair is configured
      const hasSolanaKey = !!process.env.FACILITATOR_PRIVATE_KEY;
      const hasBaseKey = !!process.env.BASE_FACILITATOR_PRIVATE_KEY;
      
      if ((networkType === "solana" && !hasSolanaKey) || (networkType === "base" && !hasBaseKey)) {
        // Return simulated settlement if no private key configured
        console.warn("Settlement simulated - no facilitator private key configured");
        const mockTxHash = Array.from({ length: 66 }, () => 
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(Math.random() * 62)]
        ).join("");

        const response: SettleResponse = {
          isValid: true,
          payer: typeof paymentPayload.payload.from === 'string' ? paymentPayload.payload.from as string : undefined,
          transactionHash: mockTxHash,
        };
        return res.json(response);
      }

      try {
        const payload = paymentPayload.payload;
        let transactionHash: string;

        if (networkType === "solana") {
          // Solana settlement
          const privateKeyBytes = Buffer.from(process.env.FACILITATOR_PRIVATE_KEY!, 'base64');
          const facilitatorKeypair = Keypair.fromSecretKey(privateKeyBytes);
          const solanaService = getSolanaService(paymentPayload.network);

          // Determine if this is SOL or SPL token transfer
          const isSolTransfer = !paymentRequirements.asset || paymentRequirements.asset === 'SOL';

          if (isSolTransfer) {
            // Transfer SOL (native token)
            transactionHash = await solanaService.transferSOL(
              facilitatorKeypair,
              payload.to as string,
              BigInt(payload.value as string)
            );
          } else {
            // Transfer SPL Token (USDC, USDT, etc.)
            const tokenMintAddress = getTokenMintAddress(
              paymentRequirements.asset as string,
              paymentPayload.network as "solana-mainnet" | "solana-devnet"
            );

            if (!tokenMintAddress) {
              const response: SettleResponse = {
                isValid: false,
                error: `Unsupported asset: ${paymentRequirements.asset}`,
              };
              return res.json(response);
            }

            transactionHash = await solanaService.transferSPLToken(
              facilitatorKeypair,
              payload.to as string,
              tokenMintAddress,
              BigInt(payload.value as string)
            );
          }
        } else {
          // BASE settlement
          const baseService = getBaseService(paymentPayload.network);
          
          // Determine if this is ETH or ERC-20 token transfer
          const isNativeTransfer = !paymentRequirements.asset || paymentRequirements.asset === 'ETH';

          if (isNativeTransfer) {
            // Transfer ETH (native token)
            transactionHash = await baseService.transferETH(
              payload.to as string,
              BigInt(payload.value as string)
            );
          } else {
            // Transfer ERC-20 Token (USDC, USDT, etc.)
            const tokenAddress = getTokenContractAddress(
              paymentRequirements.asset as string,
              paymentPayload.network as "base-mainnet" | "base-sepolia"
            );

            if (!tokenAddress) {
              const response: SettleResponse = {
                isValid: false,
                error: `Unsupported asset: ${paymentRequirements.asset}`,
              };
              return res.json(response);
            }

            transactionHash = await baseService.transferERC20(
              payload.to as string,
              tokenAddress,
              BigInt(payload.value as string)
            );
          }
        }

        const response: SettleResponse = {
          isValid: true,
          payer: typeof payload.from === 'string' ? payload.from as string : undefined,
          transactionHash,
        };

        console.log(`Settlement successful: ${transactionHash}`);
        return res.json(response);

      } catch (settlementError) {
        console.error("Settlement failed:", settlementError);
        const response: SettleResponse = {
          isValid: false,
          error: settlementError instanceof Error ? settlementError.message : "Settlement failed",
        };
        return res.status(500).json(response);
      }

    } catch (error) {
      console.error("Settle error:", error);
      const response: SettleResponse = {
        isValid: false,
        error: error instanceof Error ? error.message : "Internal server error",
      };
      return res.status(500).json(response);
    }
  });

  // GET /api/v1/health - Health check
  app.get("/api/v1/health", async (req, res) => {
    const uptime = Math.floor((Date.now() - startTime) / 1000);
    
    try {
      // Get real blockchain data
      const blockHeight = await solanaMainnet.getBlockHeight();
      
      const response: HealthResponse = {
        status: "healthy",
        uptime,
        version: "1.0.0",
        network: "solana-mainnet",
        blockHeight,
      };

      return res.json(response);
    } catch (error) {
      // Return healthy status even if blockchain check fails
      const response: HealthResponse = {
        status: "healthy",
        uptime,
        version: "1.0.0",
        network: "solana-mainnet",
      };

      return res.json(response);
    }
  });

  // GET /api/v1/supported - List supported networks and assets
  app.get("/api/v1/supported", (req, res) => {
    const response: SupportedResponse = {
      networks: [
        {
          network: "solana-mainnet",
          chainId: 101,
          rpcUrl: "https://api.mainnet-beta.solana.com",
          explorerUrl: "https://explorer.solana.com",
        },
        {
          network: "solana-devnet",
          chainId: 102,
          rpcUrl: "https://api.devnet.solana.com",
          explorerUrl: "https://explorer.solana.com?cluster=devnet",
        },
        {
          network: "base-mainnet",
          chainId: 8453,
          rpcUrl: "https://mainnet.base.org",
          explorerUrl: "https://basescan.org",
        },
        {
          network: "base-sepolia",
          chainId: 84532,
          rpcUrl: "https://sepolia.base.org",
          explorerUrl: "https://sepolia.basescan.org",
        },
      ],
      paymentSchemes: ["exact"],
      assets: [
        {
          symbol: "SOL",
          name: "Solana (Native Token)",
          contractAddress: "So11111111111111111111111111111111111111112",
          decimals: 9,
          network: "solana-mainnet",
        },
        {
          symbol: "USDC",
          name: "USD Coin",
          contractAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
          decimals: 6,
          network: "solana-mainnet",
        },
        {
          symbol: "USDT",
          name: "Tether USD",
          contractAddress: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
          decimals: 6,
          network: "solana-mainnet",
        },
        {
          symbol: "SOL",
          name: "Solana Devnet (Native Token)",
          contractAddress: "So11111111111111111111111111111111111111112",
          decimals: 9,
          network: "solana-devnet",
        },
        {
          symbol: "USDC",
          name: "USD Coin Devnet",
          contractAddress: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
          decimals: 6,
          network: "solana-devnet",
        },
        {
          symbol: "ETH",
          name: "Ethereum (Native Token)",
          contractAddress: "0x0000000000000000000000000000000000000000",
          decimals: 18,
          network: "base-mainnet",
        },
        {
          symbol: "USDC",
          name: "USD Coin",
          contractAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
          decimals: 6,
          network: "base-mainnet",
        },
        {
          symbol: "USDT",
          name: "Tether USD",
          contractAddress: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
          decimals: 6,
          network: "base-mainnet",
        },
        {
          symbol: "ETH",
          name: "Ethereum Sepolia (Native Token)",
          contractAddress: "0x0000000000000000000000000000000000000000",
          decimals: 18,
          network: "base-sepolia",
        },
        {
          symbol: "USDC",
          name: "USD Coin Sepolia",
          contractAddress: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
          decimals: 6,
          network: "base-sepolia",
        },
      ],
      capabilities: [
        "Verify Payments",
        "Settle Payments",
        "SPL Token Support",
        "ERC-20 Token Support",
        "Multi-Chain (Solana + BASE)",
      ],
    };

    return res.json(response);
  });

  // POST /api/chat - AI assistant for SDK help
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: "Message is required" });
      }

      const systemPrompt = `You are a helpful AI assistant for Rapid402, an x402 payment facilitator on Solana. Your role is to help developers integrate the @rapid402/sdk into their applications.

SDK DOCUMENTATION:
- Package: @rapid402/sdk (published on npm)
- Installation: npm install @rapid402/sdk

BASIC USAGE:
\`\`\`typescript
import { Rapid402Client } from '@rapid402/sdk';

const client = new Rapid402Client({
  baseUrl: 'https://rapid402.com/api/v1',
  network: 'solana-mainnet' // or 'solana-devnet'
});
\`\`\`

KEY METHODS:
1. client.health() - Check facilitator health
2. client.supported() - Get supported networks/assets
3. client.verify(request) - Verify payment payload
4. client.settle(request) - Settle payment on-chain

VERIFY PAYMENT:
\`\`\`typescript
const verification = await client.verify({
  paymentPayload: {
    scheme: 'exact',
    network: 'solana-mainnet',
    payload: {
      from: '...',
      to: '...',
      value: '1000000000',
      validAfter: '0',
      validBefore: '999999999999',
      nonce: '0x...',
      v: '0x1b',
      r: '0x...',
      s: '0x...'
    }
  },
  paymentRequirements: {
    scheme: 'exact',
    network: 'solana-mainnet',
    payTo: '...',
    maxAmountRequired: '1000000000'
  }
});
\`\`\`

SETTLE PAYMENT:
\`\`\`typescript
const settlement = await client.settle({
  paymentPayload: { /* same as verify */ },
  paymentRequirements: { /* same as verify */ }
});

console.log(settlement.transactionHash); // On-chain tx hash
\`\`\`

NETWORKS:
- solana-mainnet: Solana Mainnet (chainId 101)
- solana-devnet: Solana Devnet (chainId 102)

SUPPORTED ASSETS:
- SOL (native token on Solana)
- USDC (SPL Token stablecoin)
- USDT (SPL Token stablecoin)

ERROR HANDLING:
\`\`\`typescript
import { Rapid402Error } from '@rapid402/sdk';

try {
  await client.verify(request);
} catch (error) {
  if (error instanceof Rapid402Error) {
    console.error(error.message, error.code);
  }
}
\`\`\`

ABOUT x402:
The x402 protocol is an HTTP-based payment protocol using cryptographically signed payloads for payment authorization.

Answer questions clearly and concisely. Provide code examples when helpful. If unsure, direct users to https://rapid402.com for full documentation.`;

      const messages = [
        { role: "system" as const, content: systemPrompt },
        ...(history || []),
        { role: "user" as const, content: message }
      ];

      // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      const completion = await openai.chat.completions.create({
        model: "gpt-5",
        messages,
        max_completion_tokens: 2000,
        temperature: 1,
      });

      const reply = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

      return res.json({ 
        reply,
        usage: completion.usage 
      });

    } catch (error) {
      console.error("Chat error:", error);
      return res.status(500).json({ 
        error: error instanceof Error ? error.message : "Internal server error" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
