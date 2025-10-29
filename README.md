# Rapid402 - x402 Payment Facilitator on Solana

<div align="center">

![Rapid402](https://img.shields.io/badge/Rapid402-Production%20Ready-blueviolet?style=for-the-badge)
![Solana](https://img.shields.io/badge/Solana-Mainnet%20%7C%20Devnet-9945FF?style=for-the-badge&logo=solana)
![npm](https://img.shields.io/npm/v/@rapid402/sdk?style=for-the-badge&logo=npm)

**A complete x402 payment facilitator implementation with professional SDK documentation**

[Live Demo](https://rapid402.com) • [SDK on npm](https://www.npmjs.com/package/@rapid402/sdk) • [x402 Protocol](https://x402.org/)

</div>

## Overview

Rapid402 is a production-ready x402 payment facilitator on Solana blockchain that enables developers to accept payments via cryptographically signed payloads using the HTTP-based x402 protocol. This project provides both a facilitator backend API and comprehensive documentation for seamless integration.

### What is x402?

x402 is an HTTP-based payment protocol that enables developers to accept blockchain payments through cryptographically signed payloads. Learn more at [x402.org](https://x402.org/).

## Features

### 🔐 Facilitator Backend API
- **Real Ed25519 Signature Verification** - Cryptographically verify payment authenticity
- **On-Chain Settlement** - Execute real SOL and SPL token transfers on Solana
- **Live Blockchain Data** - Health endpoint with real Solana mainnet metrics (354M+ blocks)
- **Multi-Network Support** - Solana mainnet (chainId 101) and devnet (chainId 102)
- **SPL Token Support** - SOL (native), USDC, USDT with proper decimal handling

### 📚 Documentation Website
- Professional landing page with interactive code previews
- Complete API reference with endpoint documentation
- Multi-language code examples (JavaScript, Python, cURL)
- Live SDK demo page with Solana integration examples
- Solana purple branding (HSL 270° 91% 65%)
- Dark mode as default with theme toggle
- Fully responsive design
- SEO optimized

### 📦 TypeScript SDK
- Published on npm as `@rapid402/sdk`
- Full TypeScript support with type definitions
- Easy integration with Node.js and browser environments

## Quick Start

### Installation

Install the SDK in your project:

```bash
npm install @rapid402/sdk
```

### Basic Usage

```javascript
import { Rapid402Client } from '@rapid402/sdk';

const client = new Rapid402Client('https://rapid402.com/api/v1');

// Verify a payment
const result = await client.verify({
  x402Version: 1,
  paymentPayload: {
    x402Version: 1,
    scheme: 'exact',
    network: 'solana-devnet',
    payload: {
      from: 'sender-address',
      to: 'recipient-address',
      value: '1000000000', // 1 SOL (9 decimals)
      // ... signature fields
    }
  },
  paymentRequirements: {
    scheme: 'exact',
    network: 'solana-devnet',
    payTo: 'recipient-address',
    maxAmountRequired: '1000000000',
    resource: '/api/resource'
  }
});

console.log('Payment valid:', result.isValid);
```

## API Endpoints

### POST /api/v1/verify
Verify payment payloads with Ed25519 signature verification and Solana address validation.

### POST /api/v1/settle
Execute on-chain SOL or SPL token transfers after verification.

### GET /api/v1/health
Health check with live Solana blockchain data.

### GET /api/v1/supported
List supported networks, assets, and capabilities.

## Technology Stack

**Frontend**
- React + TypeScript
- Wouter (routing)
- TanStack Query
- Shadcn UI + Tailwind CSS
- Vite

**Backend**
- Express.js + Node.js
- @solana/web3.js
- @solana/spl-token

## Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Local Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/rapid402.git
cd rapid402
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
# Create .env file with:
SOLANA_RPC_URL=your-mainnet-rpc-url
SOLANA_DEVNET_RPC_URL=your-devnet-rpc-url
FACILITATOR_PRIVATE_KEY=your-base58-encoded-keypair
```

4. Start the development server:
```bash
npm run dev
```

The application runs on a single port with Vite serving the frontend and Express handling the backend.

## Project Structure

```
rapid402/
├── client/src/          # Frontend React application
│   ├── components/      # UI components
│   ├── pages/          # Route pages
│   └── lib/            # Constants and utilities
├── server/             # Backend Express server
│   ├── routes.ts       # x402 API endpoints
│   └── solana-service.ts  # Blockchain integration
├── shared/             # Shared types and schemas
│   ├── schema.ts       # Zod validation schemas
│   └── sdk/            # Published SDK package
└── README.md
```

## Supported Networks & Assets

| Network | Chain ID | Assets |
|---------|----------|--------|
| Solana Mainnet | 101 | SOL, USDC, USDT |
| Solana Devnet | 102 | SOL, USDC, USDT |

**Asset Decimals:**
- SOL: 9 decimals (1 SOL = 1,000,000,000 lamports)
- USDC/USDT: 6 decimals (SPL tokens)

## Production Deployment

### Environment Variables Required
- `SOLANA_RPC_URL` - Mainnet RPC endpoint (Helius/QuickNode recommended)
- `SOLANA_DEVNET_RPC_URL` - Devnet RPC endpoint
- `FACILITATOR_PRIVATE_KEY` - Base58 keypair for settlement transactions

### Optional Enhancements
1. **Premium RPC Provider** - Use Helius or QuickNode for better reliability
2. **Transaction Monitoring** - Add confirmation monitoring and retry logic
3. **Rate Limiting** - Implement API rate limits for abuse prevention
4. **API Authentication** - Add API key authentication
5. **Custom Domain** - Configure rapid402.com

## Security

- Ed25519 cryptographic signature verification on all payloads
- Real Solana address validation
- Environment-based secret management
- No private keys exposed in code or logs

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Resources

- [x402 Protocol Documentation](https://x402.org/)
- [x402 Whitepaper](https://www.x402.org/x402-whitepaper.pdf)
- [GitHub Repository](https://github.com/coinbase/x402)
- [@rapid402/sdk on npm](https://www.npmjs.com/package/@rapid402/sdk)
- [Solana Documentation](https://docs.solana.com/)

## Support

For questions or issues, please open an issue on GitHub or contact the maintainers.

---

<div align="center">

**Built with ❤️ on Solana**

![Solana](https://img.shields.io/badge/Powered%20by-Solana-9945FF?style=flat-square&logo=solana)

</div>
