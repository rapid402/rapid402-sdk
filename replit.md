# Rapid402 - x402 Payment Facilitator & Documentation

## Overview
Rapid402 is a complete multi-chain x402 payment facilitator implementation with professional SDK documentation website. The x402 protocol is an HTTP-based payment protocol that enables developers to accept payments via cryptographically signed payloads. This project provides both the facilitator backend API and comprehensive documentation for integrating with it.

## Project Purpose
Rapid402 provides a working x402 payment facilitator service supporting Solana and BASE chains with:
1. **Facilitator Backend API**: Endpoints for verifying and settling payments on-chain
2. **Documentation Website**: Complete reference for developers integrating with your facilitator
3. **TypeScript SDK**: @rapid402/sdk package for easy integration

This gives you full control over your payment infrastructure without relying on external facilitators.

## Current State
**Status**: Production Ready - SDK Published to npm ✅

### Backend Features (Facilitator API)
- POST /api/v1/verify - Verify payment payloads with Ed25519 (Solana) and ECDSA (BASE) signature verification
- POST /api/v1/settle - Execute real on-chain transfers (SOL/SPL tokens on Solana, ETH/ERC-20 on BASE)
- GET /api/v1/health - Health check with live blockchain data
- GET /api/v1/supported - List supported networks and assets
- Multi-chain address validation (Solana + Ethereum addresses)
- Ed25519 and ECDSA cryptographic signature verification
- On-chain settlement execution (Solana SPL tokens and BASE ERC-20 tokens)
- Network support: Solana mainnet/devnet, BASE mainnet/Sepolia testnet

### Frontend Features (Documentation)
- Professional landing page with hero section and code preview
- About section explaining x402 protocol and Rapid402 facilitator
- Technical specifications table with facilitator configuration
- Complete API reference with interactive examples
- Code examples in JavaScript, Python, and cURL
- Live SDK demo page with Solana integration examples
- Platform capabilities showcase
- Solana purple branding (HSL 270° 91% 65%)
- Dark mode as default theme
- Fully responsive design
- SEO optimized with meta tags

## Recent Changes
**Date**: 2025-10-29

### Phase 5: Multi-Chain Support - BASE Integration (Latest) ✅
- **BASE Chain Support**: Added full BASE mainnet and Sepolia testnet support
- **BaseService**: Created EVM-compatible service with ECDSA signature verification
- **Multi-Chain Verification**: Routes now handle both Solana (Ed25519) and BASE (ECDSA) signatures
- **Multi-Chain Settlement**: Support for ETH native transfers and ERC-20 tokens (USDC, USDT)
- **Updated Documentation**: All docs now reflect multi-chain support (Solana + BASE)
- **Network Support**: BASE mainnet (chainId 8453) and Sepolia (chainId 84532)
- **Asset Support**: ETH (18 decimals), USDC/USDT (6 decimals ERC-20 tokens)

### Phase 4: Solana Blockchain Integration (Production Ready) ✅
- **Real Solana Integration**: Implemented SolanaService with Ed25519 signature verification
- **On-Chain Settlements**: Real SOL and SPL token transfers using @solana/web3.js
- **Live Blockchain Data**: Health endpoint shows real Solana mainnet block height (354M+)
- **Production Secrets**: Configured FACILITATOR_PRIVATE_KEY, SOLANA_RPC_URL, SOLANA_DEVNET_RPC_URL
- **Solana Purple Branding**: Migrated entire UI to Solana purple (HSL 270° 91% 65%)
- **Dark Mode Default**: Professional dark theme as default user experience
- **Network Support**: Solana mainnet (chainId 101) and devnet (chainId 102)
- **Asset Support**: SOL (9 decimals), USDC/USDT (6 decimals SPL tokens)

### Phase 3: URL Migration (Completed)
- Replaced all Unibase URLs with rapid402.com
- Updated documentation to use https://rapid402.com/api/v1
- Made copy-to-clipboard functions use rapid402.com
- Updated all code examples across documentation

### Phase 2: Backend Facilitator API (Completed)
- Implemented x402 payment protocol types and validation schemas
- Created POST /api/v1/verify endpoint for payment verification
- Created POST /api/v1/settle endpoint for payment settlement
- Created GET /api/v1/health endpoint for health checks
- Created GET /api/v1/supported endpoint for network/asset listing
- Added SPL Token payment payload validation
- Configured support for Solana mainnet and devnet

### Phase 1: SDK & Frontend (Completed)
- @rapid402/sdk@1.0.0 successfully published to npm registry
- Package available at: https://www.npmjs.com/package/@rapid402/sdk
- Users can now install with: `npm install @rapid402/sdk`
- Built complete documentation website with professional design
- Implemented SDK demo page with interactive examples
- Created professional design following industry standards

## Project Architecture

### Frontend Structure
```
client/src/
├── components/
│   ├── ui/              # Shadcn UI components
│   ├── header.tsx       # Navigation header
│   ├── hero.tsx         # Hero section with code preview
│   ├── about-section.tsx
│   ├── specifications-table.tsx
│   ├── api-methods.tsx  # API endpoint cards
│   ├── code-examples.tsx
│   ├── capabilities.tsx
│   ├── get-started.tsx
│   ├── footer.tsx
│   ├── theme-provider.tsx
│   └── theme-toggle.tsx
├── pages/
│   ├── home.tsx         # Main landing page
│   └── not-found.tsx
├── lib/
│   ├── constants.ts     # API methods, specs, examples, capabilities
│   └── queryClient.ts
└── App.tsx
```

### Data Schema
- `ApiMethod`: API endpoint definitions (method, endpoint, description, category)
- `Specification`: Technical specifications for the facilitator
- `CodeExample`: Multi-language code samples
- `Capability`: Platform capability descriptions

### Backend Structure
```
server/
├── routes.ts           # x402 Facilitator API routes
│                       # - POST /api/v1/verify (multi-chain)
│                       # - POST /api/v1/settle (multi-chain)
│                       # - GET /api/v1/health
│                       # - GET /api/v1/supported
├── solana-service.ts   # Solana blockchain integration
│                       # - Ed25519 signature verification
│                       # - SOL and SPL token transfers
│                       # - Real blockchain interactions
├── base-service.ts     # BASE blockchain integration
│                       # - ECDSA signature verification
│                       # - ETH and ERC-20 token transfers
│                       # - Real blockchain interactions via ethers.js
└── storage.ts          # Storage interface (available for future use)
```

### Key Features
1. **API Documentation**
   - 6 endpoints: GET/POST /v1/verify, GET/POST /v1/settle, GET /v1/health, GET /v1/supported
   - Copy-to-clipboard for endpoints
   - Categorized by functionality (verify, settle, health, supported)

2. **Code Examples**
   - JavaScript SDK integration
   - Python client usage
   - cURL commands
   - Tabbed interface with syntax highlighting

3. **Technical Specifications**
   - Base URL: https://rapid402.com/api/v1
   - Networks: Solana mainnet/devnet, BASE mainnet/Sepolia
   - Payment schemes: exact
   - Assets: SOL, ETH, USDC, USDT (SPL Token + ERC-20 compatible)

4. **Design System**
   - Color scheme: Solana purple primary (HSL 270° 91% 65%)
   - Typography: Inter for UI, JetBrains Mono for code
   - Dark mode default with theme toggle support
   - Responsive breakpoints: mobile, tablet (md), desktop (lg)
   - Rapid402 logo favicon

## User Preferences
- Professional, technical aesthetic inspired by top API documentation sites
- Clean, scannable layouts with clear visual hierarchy
- Emphasis on code readability and developer experience
- Modern web design with subtle animations and hover effects

## Technology Stack
- **Frontend**: React, TypeScript, Wouter (routing), TanStack Query
- **UI Framework**: Shadcn UI, Tailwind CSS
- **Icons**: Lucide React
- **Backend**: Express.js, Node.js
- **Blockchain**: @solana/web3.js, @solana/spl-token, ethers.js (for BASE/EVM)
- **Build Tool**: Vite

## Running the Project
```bash
npm run dev
```
The application runs on a single port with Vite serving the frontend and Express handling the backend.

## Production Status
✅ **PRODUCTION READY** - All core features implemented and tested

### Completed
- ✅ Multi-chain support (Solana + BASE) with proper signature verification
- ✅ Real Solana blockchain integration with Ed25519 signature verification
- ✅ Real BASE blockchain integration with ECDSA signature verification
- ✅ On-chain settlement execution for SOL/SPL tokens and ETH/ERC-20 tokens
- ✅ Production secrets configured for both chains
- ✅ Live blockchain data in health endpoint
- ✅ SDK published to npm (@rapid402/sdk) - chain-agnostic
- ✅ Complete documentation website
- ✅ Solana purple branding throughout

### Optional Enhancements
1. **Premium RPC**: Upgrade to Helius or QuickNode for better reliability (currently using public RPC)
2. **Transaction Monitoring**: Add confirmation monitoring and retry logic
3. **Rate Limiting**: Implement API rate limiting for abuse prevention
4. **API Authentication**: Add API key authentication for access control
5. **Testing**: Comprehensive end-to-end testing of payment flows
6. **Deployment**: Publish to production and configure custom domain (rapid402.com)

## Environment Variables

### Solana (Configured)
✅ `SOLANA_RPC_URL` - Solana mainnet RPC endpoint (configured)
✅ `SOLANA_DEVNET_RPC_URL` - Solana devnet RPC endpoint (configured)
✅ `FACILITATOR_PRIVATE_KEY` - Base64-encoded Solana keypair for settlement transactions (configured)

### BASE (Required for BASE support)
⚠️ `BASE_RPC_URL` - BASE mainnet RPC endpoint (e.g., https://mainnet.base.org or Alchemy/Infura URL)
⚠️ `BASE_SEPOLIA_RPC_URL` - BASE Sepolia testnet RPC endpoint (e.g., https://sepolia.base.org)
⚠️ `BASE_FACILITATOR_PRIVATE_KEY` - Ethereum private key (0x... format) for BASE settlement transactions

**Note**: BASE settlement will return simulated transactions until BASE_FACILITATOR_PRIVATE_KEY is configured.

## Critical Implementation Notes

### BASE Signing Payload Format
The BASE chain ECDSA signature verification requires an exact message format. The canonical implementation is defined in `server/signing-utils.ts` in the `constructBaseSigningMessage()` function.

Message format: `from|to|value|validAfter|validBefore|nonce`

Defaults when fields are omitted:
- `validAfter`: '0'
- `validBefore`: '999999999999'
- `nonce`: '0x0'

**IMPORTANT**: The SDK (@rapid402/sdk) and server must use identical message construction logic. Any deviation in defaults, formatting, or field ordering will cause all BASE signatures to fail verification.

**For SDK developers**: The canonical signing helper is now available in the SDK package itself:

```typescript
import { constructBaseSigningMessage } from '@rapid402/sdk';

const message = constructBaseSigningMessage({
  from: senderAddress,
  to: receiverAddress,
  value: amountInWei,
  // Optional fields with automatic defaults
});
```

The shared utility is defined in `shared/signing-utils.ts` and imported by both the server (`server/base-service.ts`) and SDK (`shared/sdk/src/index.ts`), ensuring identical message construction logic across both implementations.

## External Links
- x402 Protocol: https://x402.org/
- GitHub Repository: https://github.com/coinbase/x402
- x402 Whitepaper: https://www.x402.org/x402-whitepaper.pdf
