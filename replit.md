# Rapid402 - x402 Payment Facilitator & Documentation

## Overview
Rapid402 is a multi-chain x402 payment facilitator implementation, providing a backend API for verifying and settling payments, a comprehensive documentation website, and a TypeScript SDK. It enables developers to accept payments via cryptographically signed payloads on various blockchain networks, offering full control over payment infrastructure. The project supports Solana and BASE chains, allowing for on-chain transfers of native tokens and SPL/ERC-20 tokens.

## User Preferences
- Professional, technical aesthetic inspired by top API documentation sites
- Clean, scannable layouts with clear visual hierarchy
- Emphasis on code readability and developer experience
- Modern web design with subtle animations and hover effects

## System Architecture

### Frontend
The frontend is a documentation website built with React, TypeScript, and Shadcn UI. It features a professional landing page, an "About" section explaining the x402 protocol, technical specifications, a complete API reference with interactive examples, and a live SDK demo. The design emphasizes Solana purple branding, dark mode as default, and full responsiveness.

### Backend
The backend, built with Express.js and Node.js, provides the core facilitator API. It includes endpoints for:
- `/api/v1/verify`: Verifies payment payloads using Ed25519 for Solana and ECDSA for BASE.
- `/api/v1/settle`: Executes real on-chain transfers for SOL/SPL tokens on Solana and ETH/ERC-20 tokens on BASE.
- `/api/v1/health`: Provides a health check with live blockchain data.
- `/api/v1/supported`: Lists supported networks and assets.

It incorporates `SolanaService` for Solana blockchain interactions (Ed25519 signature verification, SOL/SPL token transfers) and `BaseService` for BASE blockchain interactions (ECDSA signature verification, ETH/ERC-20 token transfers via ethers.js). Multi-chain address validation and cryptographic signature verification are core features.

### Key Features
- **API Documentation**: Detailed reference for `/verify`, `/settle`, `/health`, and `/supported` endpoints with copy-to-clipboard functionality.
- **Code Examples**: Provided in JavaScript (SDK), Python, and cURL, with a tabbed interface and syntax highlighting.
- **Technical Specifications**: Defines supported networks (Solana mainnet/devnet, BASE mainnet/Sepolia), payment schemes (exact), and assets (SOL, ETH, USDC, USDT).
- **Design System**: Solana purple primary color (HSL 270° 91% 65%), Inter font for UI, JetBrains Mono for code, dark mode by default, and responsive design.

### Testing
The project includes a comprehensive Vitest-based testing suite with fully mocked services to ensure deterministic, CI-ready tests. It covers API endpoints, signature verification (Ed25519 and ECDSA), and service layer logic for both Solana and BASE chains. Real cryptographic operations are used for authentic validation without external RPC dependencies. The `@rapid402/sdk` also has its own Jest-based test suite.

## External Dependencies
- **Blockchain SDKs**:
    - `@solana/web3.js` for Solana interactions.
    - `@solana/spl-token` for Solana SPL token operations.
    - `ethers.js` for BASE/EVM blockchain interactions.
- **UI Libraries**:
    - `Shadcn UI` for UI components.
    - `Tailwind CSS` for styling.
    - `Lucide React` for icons.
- **Development Tools**:
    - `Wouter` for frontend routing.
    - `TanStack Query` for data fetching.
    - `Vite` for build tooling.
    - `Vitest` for backend testing.
    - `Jest` for SDK testing.
- **External Services (RPCs)**:
    - Solana mainnet and devnet RPC endpoints.
    - BASE mainnet and Sepolia testnet RPC endpoints.
- **npm Registry**: For publishing and distributing the `@rapid402/sdk` package.