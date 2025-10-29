import type { ApiMethod, Specification, CodeExample, Capability } from "@shared/schema";

// Get the base URL - use current origin when published, or localhost for development
export const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin + '/api';
  }
  return '/api'; // fallback for SSR
};

export const API_METHODS: ApiMethod[] = [
  {
    method: "GET",
    endpoint: "/v1/verify",
    description: "Verify a payment payload without settling it. Returns validation status and payment details.",
    category: "verify",
  },
  {
    method: "POST",
    endpoint: "/v1/verify",
    description: "Verify a payment payload with additional parameters. Supports batch verification.",
    category: "verify",
  },
  {
    method: "GET",
    endpoint: "/v1/settle",
    description: "Retrieve settlement status for a specific payment transaction.",
    category: "settle",
  },
  {
    method: "POST",
    endpoint: "/v1/settle",
    description: "Settle a verified payment on-chain. Finalizes the transaction and updates balances.",
    category: "settle",
  },
  {
    method: "GET",
    endpoint: "/v1/health",
    description: "Check the health status of the facilitator service. Returns uptime and system metrics.",
    category: "health",
  },
  {
    method: "GET",
    endpoint: "/v1/supported",
    description: "List all supported networks, payment schemes, and asset types for the facilitator.",
    category: "supported",
  },
];

export const SPECIFICATIONS: Specification[] = [
  {
    category: "Base URL",
    details: "https://rapid402.com/api/v1",
  },
  {
    category: "Supported Networks",
    details: "Solana mainnet, Solana devnet",
  },
  {
    category: "Payment Schemes",
    details: "exact",
  },
  {
    category: "Supported Assets",
    details: "SOL, USDC, USDT",
  },
  {
    category: "Capabilities",
    details: "Verify Payments, Settle Payments, Supported Endpoint, List Resources",
  },
];

export const CODE_EXAMPLES: CodeExample[] = [
  {
    language: "javascript",
    label: "JavaScript",
    code: `// Client-side: Automatic 402 payment handling
import { createRapid402Client } from '@rapid402/sdk/client';

const rapid402 = createRapid402Client({
  facilitatorUrl: 'https://rapid402.com/api/v1',
  network: 'solana-mainnet',
  wallet: myWalletAdapter,
  maxPaymentAmount: BigInt('1000000000') // 1 SOL max
});

// Automatically handles 402 payments!
const response = await rapid402.fetch('/api/premium-data');
const data = await response.json();

// Server-side: Payment-gated API
import { Rapid402PaymentHandler } from '@rapid402/sdk/server';

const handler = new Rapid402PaymentHandler({
  facilitatorUrl: 'https://rapid402.com/api/v1',
  network: 'solana-mainnet',
  treasuryAddress: process.env.TREASURY_WALLET
});

app.get('/api/premium', 
  handler.middleware({ amount: '1000000000' }),
  (req, res) => res.json({ data: 'Premium content' })
);`,
  },
  {
    language: "python",
    label: "Python",
    code: `# Python SDK coming soon!
# For now, use direct API calls:

import requests

# Verify payment
response = requests.post(
    'https://rapid402.com/api/v1/verify',
    json={
        'x402Version': 1,
        'paymentPayload': payment_payload,
        'paymentRequirements': requirements
    }
)
verification = response.json()

# Settle payment
if verification['isValid']:
    settlement = requests.post(
        'https://rapid402.com/api/v1/settle',
        json={
            'x402Version': 1,
            'paymentPayload': payment_payload,
            'paymentRequirements': requirements
        }
    )
    print('Settled:', settlement.json())`,
  },
  {
    language: "curl",
    label: "cURL",
    code: `# Verify a payment
curl -X POST https://rapid402.com/api/v1/verify \\
  -H "Content-Type: application/json" \\
  -d '{
    "x402Version": 1,
    "paymentPayload": {
      "x402Version": 1,
      "scheme": "exact",
      "network": "solana-mainnet",
      "payload": { "from": "...", "to": "...", "value": "1000000000" }
    },
    "paymentRequirements": {
      "scheme": "exact",
      "network": "solana-mainnet",
      "payTo": "YourWalletAddress",
      "maxAmountRequired": "1000000000",
      "resource": "/api/endpoint"
    }
  }'

# Settle the payment
curl -X POST https://rapid402.com/api/v1/settle \\
  -H "Content-Type: application/json" \\
  -d '{
    "x402Version": 1,
    "paymentPayload": { ... },
    "paymentRequirements": { ... }
  }'`,
  },
];

export const CAPABILITIES: Capability[] = [
  {
    title: "Cryptographic Verification",
    description: "Verify payment payloads with cryptographic signatures before settlement. Ensure authenticity and prevent fraud.",
    icon: "shield-check",
  },
  {
    title: "On-Chain Settlement",
    description: "Settle payments directly on Solana with ultra-low fees and high throughput. Leverage Solana's speed and efficiency.",
    icon: "database",
  },
  {
    title: "Multi-Network Support",
    description: "Support for Solana mainnet and devnet with extensible architecture for additional networks.",
    icon: "network",
  },
  {
    title: "SPL Token Compatible",
    description: "Full support for SPL Token standard for seamless token transfers on Solana.",
    icon: "code",
  },
  {
    title: "Developer Friendly",
    description: "Simple REST API with comprehensive documentation, SDKs in multiple languages, and clear examples.",
    icon: "terminal",
  },
  {
    title: "AI Agent Ready",
    description: "Enable AI agents to autonomously search, purchase, and pay with standardized payment protocol.",
    icon: "cpu",
  },
];
