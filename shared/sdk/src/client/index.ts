import type { Rapid402Config, WalletAdapter, PaymentRequirements, HealthResponse, SupportedResponse } from '../types';
import { randomBytes } from 'crypto';

/**
 * Create a Rapid402 client for automatic x402 payment handling
 * 
 * @example
 * ```ts
 * import { createRapid402Client } from '@rapid402/sdk/client';
 * 
 * const client = createRapid402Client({
 *   facilitatorUrl: 'https://rapid402.com/api/v1',
 *   network: 'solana-devnet',
 *   wallet: myWalletAdapter
 * });
 * 
 * // Automatically handles 402 payments
 * const response = await client.fetch('/api/paid-endpoint', {
 *   method: 'POST',
 *   body: JSON.stringify({ data: 'request' })
 * });
 * ```
 */
export function createRapid402Client(config: Rapid402Config & { wallet: WalletAdapter }) {
  const { facilitatorUrl, network, wallet, maxPaymentAmount } = config;

  return {
    /**
     * Enhanced fetch that automatically handles 402 payment responses
     */
    async fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
      // Make initial request
      let response = await fetch(input, init);

      // If 402 Payment Required, handle payment
      if (response.status === 402) {
        const body: {
          error: string;
          x402Version: number;
          paymentRequirements: PaymentRequirements;
        } = await response.json();
        const paymentRequirements = body.paymentRequirements;

        // Check max payment limit
        if (maxPaymentAmount && BigInt(paymentRequirements.maxAmountRequired) > maxPaymentAmount) {
          throw new Error(`Payment amount ${paymentRequirements.maxAmountRequired} exceeds maximum ${maxPaymentAmount}`);
        }

        // Create payment payload
        const paymentPayload = await createPaymentPayload({
          wallet,
          requirements: paymentRequirements,
          network,
        });

        // Retry request with payment header
        const headersWithPayment = new Headers(init?.headers);
        headersWithPayment.set('X-Payment', JSON.stringify({
          x402Version: 1,
          paymentPayload,
          paymentRequirements,
        }));

        response = await fetch(input, {
          ...init,
          headers: headersWithPayment,
        });
      }

      return response;
    },

    /**
     * Get facilitator info
     */
    async getHealth(): Promise<HealthResponse> {
      const response = await fetch(`${facilitatorUrl}/health`);
      return response.json() as Promise<HealthResponse>;
    },

    /**
     * Get supported networks and assets
     */
    async getSupported(): Promise<SupportedResponse> {
      const response = await fetch(`${facilitatorUrl}/supported`);
      return response.json() as Promise<SupportedResponse>;
    },
  };
}

/**
 * Create a payment payload by signing with wallet
 * 
 * NOTE: This is a simplified implementation that creates the payload structure
 * but does not implement full Solana transaction signing. In a production
 * implementation, this would:
 * 1. Create a Solana transaction with the payment details
 * 2. Call wallet.signTransaction() to get the signature
 * 3. Extract the Ed25519 signature components for verification
 * 
 * The Rapid402 facilitator backend has full Ed25519 verification implemented,
 * but this client-side signing is left as an exercise for integrators to
 * customize based on their specific wallet adapter and transaction structure.
 */
async function createPaymentPayload(params: {
  wallet: WalletAdapter;
  requirements: PaymentRequirements;
  network: string;
}) {
  const { wallet, requirements, network } = params;

  // Create unsigned payment data
  const paymentData = {
    from: wallet.publicKey.toBase58(),
    to: requirements.payTo,
    value: requirements.maxAmountRequired,
    validAfter: Math.floor(Date.now() / 1000).toString(),
    validBefore: (Math.floor(Date.now() / 1000) + 3600).toString(), // 1 hour validity
    nonce: generateNonce(),
  };

  // TODO: Implement actual Solana transaction signing here
  // This would involve:
  // - Creating a Solana Transaction with transfer instruction
  // - Calling wallet.signTransaction(transaction)
  // - Extracting the signature bytes
  // - Formatting for x402 protocol
  
  return {
    x402Version: 1,
    scheme: requirements.scheme,
    network,
    payload: {
      ...paymentData,
      // Placeholder signature - real implementation would sign with wallet
      v: '0x00',
      r: '0x' + '0'.repeat(64),
      s: '0x' + '0'.repeat(64),
    },
  };
}

/**
 * Generate a random nonce for payment
 */
function generateNonce(): string {
  // Use Node.js crypto if available (for testing), otherwise use browser crypto
  if (typeof window === 'undefined') {
    // Node.js environment
    return '0x' + randomBytes(32).toString('hex');
  } else {
    // Browser environment
    return '0x' + Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
}

export type Rapid402Client = ReturnType<typeof createRapid402Client>;
