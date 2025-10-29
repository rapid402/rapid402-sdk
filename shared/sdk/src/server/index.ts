import type { 
  PaymentHandler, 
  PaymentPayload, 
  PaymentRequirements,
  VerifyResponse,
  SettleResponse 
} from '../types';

/**
 * Rapid402 Payment Handler for server-side payment verification and settlement
 * 
 * @example
 * ```ts
 * import { Rapid402PaymentHandler } from '@rapid402/sdk/server';
 * 
 * const rapid402 = new Rapid402PaymentHandler({
 *   facilitatorUrl: 'https://rapid402.com/api/v1',
 *   network: 'solana-devnet',
 *   treasuryAddress: process.env.TREASURY_WALLET!
 * });
 * 
 * // In your API route
 * const payment = rapid402.extractPayment(req.headers);
 * if (!payment) {
 *   const requirements = rapid402.createPaymentRequirements({
 *     amount: '1000000000', // 1 SOL
 *     resource: '/api/endpoint'
 *   });
 *   return rapid402.create402Response(requirements);
 * }
 * ```
 */
export class Rapid402PaymentHandler implements PaymentHandler {
  private facilitatorUrl: string;
  private network: string;
  private treasuryAddress: string;

  constructor(config: {
    facilitatorUrl: string;
    network: 'solana-mainnet' | 'solana-devnet' | 'base-mainnet' | 'base-sepolia' | 'bsc-mainnet' | 'bsc-testnet';
    treasuryAddress: string;
  }) {
    this.facilitatorUrl = config.facilitatorUrl.replace(/\/$/, '');
    this.network = config.network;
    this.treasuryAddress = config.treasuryAddress;
  }

  /**
   * Extract payment from request headers
   */
  extractPayment(headers: Headers | Record<string, string | string[] | undefined>): { 
    x402Version: number;
    paymentPayload: PaymentPayload;
    paymentRequirements: PaymentRequirements;
  } | null {
    let paymentHeader: string | null = null;
    
    if (headers instanceof Headers) {
      paymentHeader = headers.get('X-Payment');
    } else {
      // Handle Express-style headers (can be string, string[], or undefined)
      const xPayment = headers['x-payment'] || headers['X-Payment'];
      if (typeof xPayment === 'string') {
        paymentHeader = xPayment;
      } else if (Array.isArray(xPayment) && xPayment.length > 0 && typeof xPayment[0] === 'string') {
        paymentHeader = xPayment[0];
      }
    }

    if (!paymentHeader) return null;

    try {
      const parsed = JSON.parse(paymentHeader) as {
        x402Version: number;
        paymentPayload: PaymentPayload;
        paymentRequirements: PaymentRequirements;
      };
      
      // Basic validation that required fields exist
      if (!parsed.paymentPayload || !parsed.paymentRequirements) {
        return null;
      }
      
      return parsed;
    } catch {
      return null;
    }
  }

  /**
   * Create payment requirements for a resource
   */
  async createPaymentRequirements(config: {
    amount: string;
    resource: string;
    asset?: string;
    description?: string;
  }): Promise<PaymentRequirements> {
    return {
      scheme: 'exact' as const,
      network: this.network,
      payTo: this.treasuryAddress,
      maxAmountRequired: config.amount,
      resource: config.resource,
      asset: config.asset,
    };
  }

  /**
   * Verify payment with facilitator
   */
  async verifyPayment(
    payment: { paymentPayload: PaymentPayload; paymentRequirements: PaymentRequirements }, 
    requirements: PaymentRequirements
  ): Promise<boolean> {
    try {
      const response = await fetch(`${this.facilitatorUrl}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          x402Version: 1,
          paymentPayload: payment.paymentPayload,
          paymentRequirements: requirements,
        }),
      });

      const result: VerifyResponse = await response.json();
      return result.isValid === true;
    } catch (error) {
      console.error('Payment verification failed:', error);
      return false;
    }
  }

  /**
   * Settle payment with facilitator
   */
  async settlePayment(
    payment: { paymentPayload: PaymentPayload; paymentRequirements: PaymentRequirements }, 
    requirements: PaymentRequirements
  ): Promise<SettleResponse> {
    try {
      const response = await fetch(`${this.facilitatorUrl}/settle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          x402Version: 1,
          paymentPayload: payment.paymentPayload,
          paymentRequirements: requirements,
        }),
      });

      return await response.json() as SettleResponse;
    } catch (error) {
      console.error('Payment settlement failed:', error);
      throw error;
    }
  }

  /**
   * Create a 402 Payment Required response
   */
  create402Response(requirements: PaymentRequirements): { 
    status: number; 
    body: { 
      error: string; 
      x402Version: number; 
      paymentRequirements: PaymentRequirements 
    } 
  } {
    return {
      status: 402,
      body: {
        error: 'Payment Required',
        x402Version: 1,
        paymentRequirements: requirements,
      },
    };
  }

  /**
   * Express/Connect middleware for automatic payment handling
   */
  middleware(config: {
    amount: string;
    resource?: string;
    onPaymentVerified?: (payment: { 
      paymentPayload: PaymentPayload; 
      paymentRequirements: PaymentRequirements 
    }) => void;
  }) {
    return async (
      req: { headers: Record<string, string | string[] | undefined>; originalUrl?: string; url?: string },
      res: { status(code: number): { json(body: unknown): unknown } },
      next: () => void
    ): Promise<void> => {
      const payment = this.extractPayment(req.headers);

      const resource = config.resource || req.originalUrl || req.url || '/';
      const requirements = await this.createPaymentRequirements({
        amount: config.amount,
        resource,
      });

      if (!payment) {
        const response = this.create402Response(requirements);
        res.status(response.status).json(response.body);
        return;
      }

      const isValid = await this.verifyPayment(payment, requirements);
      if (!isValid) {
        res.status(402).json({ error: 'Invalid payment' });
        return;
      }

      // Payment verified, call callback if provided
      if (config.onPaymentVerified) {
        config.onPaymentVerified(payment);
      }

      // Settle payment in background
      this.settlePayment(payment, requirements).catch(console.error);

      next();
    };
  }
}

export type { PaymentHandler };
