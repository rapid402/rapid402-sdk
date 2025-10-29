# @rapid402/sdk

> TypeScript SDK for integrating x402 payments with Rapid402 facilitator on Solana

[![npm version](https://img.shields.io/npm/v/@rapid402/sdk.svg)](https://www.npmjs.com/package/@rapid402/sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## What is x402?

x402 is a protocol for HTTP-based payments that enables developers to accept payments via cryptographically signed payloads. Instead of traditional payment processing, users sign transactions with their crypto wallet and include them in HTTP headers.

**Rapid402** is a complete x402 payment facilitator running on Solana that verifies and settles payments on-chain.

## Features

✅ **Client-Side Integration** - Automatic 402 payment handling in browser/Node.js  
✅ **Server-Side Middleware** - Express/Connect middleware for payment-gated APIs  
✅ **Solana Wallet Support** - Works with any Solana wallet adapter  
✅ **Type-Safe** - Full TypeScript support with detailed types  
✅ **Zero Configuration** - Sensible defaults, minimal setup required  

## Installation

```bash
npm install @rapid402/sdk
```

### Peer Dependencies

```bash
npm install @solana/web3.js @solana/spl-token zod
```

## Quick Start

### Client-Side (Browser/Frontend)

Use the Rapid402 client to automatically handle 402 payment responses:

```typescript
import { createRapid402Client } from '@rapid402/sdk/client';

// Initialize client with wallet adapter
const rapid402 = createRapid402Client({
  facilitatorUrl: 'https://rapid402.com/api/v1',
  network: 'solana-devnet',
  wallet: myWalletAdapter, // Any Solana wallet adapter
  maxPaymentAmount: BigInt('1000000000'), // Optional: max 1 SOL
});

// Automatically handles 402 payments
const response = await rapid402.fetch('https://api.example.com/premium-data', {
  method: 'POST',
  body: JSON.stringify({ query: 'something' }),
});

const data = await response.json();
console.log('Got data:', data);
```

**What happens:**
1. First request gets 402 Payment Required
2. SDK automatically creates and signs payment
3. SDK retries request with payment header
4. Payment is verified and settled by Rapid402
5. Your app gets the response seamlessly

### Server-Side (Node.js/Express)

Protect your API endpoints with payment requirements:

```typescript
import express from 'express';
import { Rapid402PaymentHandler } from '@rapid402/sdk/server';

const app = express();

const rapid402 = new Rapid402PaymentHandler({
  facilitatorUrl: 'https://rapid402.com/api/v1',
  network: 'solana-devnet',
  treasuryAddress: process.env.TREASURY_WALLET!,
});

// Payment-gated endpoint using middleware
app.get('/api/premium-data',
  rapid402.middleware({
    amount: '1000000000', // 1 SOL in lamports
    onPaymentVerified: (payment) => {
      console.log('Payment received:', payment);
    },
  }),
  (req, res) => {
    res.json({ data: 'Premium content!' });
  }
);

// Manual payment handling
app.post('/api/custom', async (req, res) => {
  const payment = rapid402.extractPayment(req.headers);

  if (!payment) {
    const requirements = await rapid402.createPaymentRequirements({
      amount: '500000000', // 0.5 SOL
      resource: '/api/custom',
      description: 'Custom API access',
    });
    const response = rapid402.create402Response(requirements);
    return res.status(response.status).json(response.body);
  }

  // Verify payment
  const requirements = await rapid402.createPaymentRequirements({
    amount: '500000000',
    resource: '/api/custom',
  });

  const isValid = await rapid402.verifyPayment(payment, requirements);
  if (!isValid) {
    return res.status(402).json({ error: 'Invalid payment' });
  }

  // Settle payment (async, don't wait)
  rapid402.settlePayment(payment, requirements).catch(console.error);

  res.json({ success: true, data: 'Your data' });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

## API Reference

### Client API

#### `createRapid402Client(config)`

Creates a Rapid402 client for handling payments.

**Parameters:**
- `facilitatorUrl` (string) - Rapid402 facilitator URL
- `network` ('solana-mainnet' | 'solana-devnet') - Solana network
- `wallet` (WalletAdapter) - Solana wallet adapter for signing
- `maxPaymentAmount` (bigint, optional) - Maximum payment amount in lamports

**Returns:** `Rapid402Client` with methods:
- `fetch(url, options)` - Enhanced fetch with automatic 402 handling
- `getHealth()` - Get facilitator health status
- `getSupported()` - Get supported networks and assets

### Server API

#### `new Rapid402PaymentHandler(config)`

Creates a payment handler for server-side verification.

**Parameters:**
- `facilitatorUrl` (string) - Rapid402 facilitator URL
- `network` ('solana-mainnet' | 'solana-devnet') - Solana network
- `treasuryAddress` (string) - Your Solana wallet address for receiving payments

**Methods:**
- `extractPayment(headers)` - Extract payment from request headers
- `createPaymentRequirements(config)` - Create payment requirements object
- `verifyPayment(payment, requirements)` - Verify payment with facilitator
- `settlePayment(payment, requirements)` - Settle payment on-chain
- `create402Response(requirements)` - Create 402 response object
- `middleware(config)` - Express/Connect middleware

## Examples

### React + Phantom Wallet

```typescript
import { useWallet } from '@solana/wallet-adapter-react';
import { createRapid402Client } from '@rapid402/sdk/client';

function MyComponent() {
  const wallet = useWallet();

  const fetchPremiumData = async () => {
    const rapid402 = createRapid402Client({
      facilitatorUrl: 'https://rapid402.com/api/v1',
      network: 'solana-devnet',
      wallet: wallet,
    });

    const response = await rapid402.fetch('/api/premium-data');
    const data = await response.json();
    console.log(data);
  };

  return (
    <button onClick={fetchPremiumData}>
      Get Premium Data
    </button>
  );
}
```

### Next.js API Route

```typescript
import { Rapid402PaymentHandler } from '@rapid402/sdk/server';
import type { NextApiRequest, NextApiResponse } from 'next';

const rapid402 = new Rapid402PaymentHandler({
  facilitatorUrl: process.env.RAPID402_URL!,
  network: 'solana-mainnet',
  treasuryAddress: process.env.TREASURY_WALLET!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const payment = rapid402.extractPayment(req.headers);

  if (!payment) {
    const requirements = await rapid402.createPaymentRequirements({
      amount: '1000000000', // 1 SOL
      resource: '/api/premium',
    });
    const response = rapid402.create402Response(requirements);
    return res.status(response.status).json(response.body);
  }

  const requirements = await rapid402.createPaymentRequirements({
    amount: '1000000000',
    resource: '/api/premium',
  });

  const isValid = await rapid402.verifyPayment(payment, requirements);
  if (!isValid) {
    return res.status(402).json({ error: 'Invalid payment' });
  }

  // Settlement happens async
  rapid402.settlePayment(payment, requirements).catch(console.error);

  res.json({ data: 'Premium content' });
}
```

## Networks & Assets

### Supported Networks
- **Solana Mainnet** (chainId: 101)
- **Solana Devnet** (chainId: 102)

### Supported Assets
- **SOL** (9 decimals)
- **USDC** (SPL Token, 6 decimals)
- **USDT** (SPL Token, 6 decimals)

## Payment Amounts

All amounts are in the smallest unit (lamports for SOL):
- 1 SOL = 1,000,000,000 lamports
- 1 USDC = 1,000,000 (6 decimals)

```typescript
// 1 SOL payment
amount: '1000000000'

// 0.1 SOL payment
amount: '100000000'

// 10 USDC payment
amount: '10000000'
```

## Environment Variables

### Client-Side
No environment variables needed - configuration is passed to the client.

### Server-Side
```bash
RAPID402_URL=https://rapid402.com/api/v1
TREASURY_WALLET=YourSolanaWalletAddress...
```

## Testing

Use Solana devnet for testing:

```typescript
// Client
const rapid402 = createRapid402Client({
  facilitatorUrl: 'https://rapid402.com/api/v1',
  network: 'solana-devnet',
  wallet: testWallet,
});

// Server
const rapid402 = new Rapid402PaymentHandler({
  facilitatorUrl: 'https://rapid402.com/api/v1',
  network: 'solana-devnet',
  treasuryAddress: testWalletAddress,
});
```

Get devnet SOL from the [Solana Faucet](https://faucet.solana.com/).

## Error Handling

```typescript
try {
  const response = await rapid402.fetch('/api/endpoint');
  const data = await response.json();
} catch (error) {
  if (error.message.includes('Payment amount')) {
    console.error('Payment exceeds maximum allowed');
  } else {
    console.error('Request failed:', error);
  }
}
```

## TypeScript Support

Full TypeScript support with exported types:

```typescript
import type {
  PaymentPayload,
  PaymentRequirements,
  VerifyResponse,
  SettleResponse,
  Rapid402Config,
} from '@rapid402/sdk';
```

## Resources

- **Documentation**: https://rapid402.com
- **GitHub**: https://github.com/rapid402/rapid402-sdk
- **NPM**: https://www.npmjs.com/package/@rapid402/sdk
- **x402 Protocol**: https://x402.org
- **Support**: hello@rapid402.com

## License

MIT © Rapid402

---

Built with ❤️ for the Solana ecosystem
