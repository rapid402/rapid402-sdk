// Re-export types from the main schema
export type {
  PaymentPayload,
  PaymentRequirements,
  VerifyRequest,
  VerifyResponse,
  SettleRequest,
  SettleResponse,
  HealthResponse,
  SupportedResponse,
  SupportedNetwork,
  SupportedAsset,
} from '../../../shared/schema';

// Additional SDK-specific types
export interface Rapid402Config {
  facilitatorUrl: string;
  network: 'solana-mainnet' | 'solana-devnet';
  maxPaymentAmount?: bigint;
}

export interface WalletAdapter {
  publicKey: { toBase58(): string };
  signTransaction<T>(transaction: T): Promise<T>;
}

export interface PaymentHandler {
  extractPayment(headers: Headers | Record<string, string | string[] | undefined>): {
    x402Version: number;
    paymentPayload: PaymentPayload;
    paymentRequirements: PaymentRequirements;
  } | null;
  createPaymentRequirements(config: {
    amount: string;
    resource: string;
    asset?: string;
    description?: string;
  }): Promise<PaymentRequirements>;
  verifyPayment(
    payment: { paymentPayload: PaymentPayload; paymentRequirements: PaymentRequirements },
    requirements: PaymentRequirements
  ): Promise<boolean>;
  settlePayment(
    payment: { paymentPayload: PaymentPayload; paymentRequirements: PaymentRequirements },
    requirements: PaymentRequirements
  ): Promise<SettleResponse>;
  create402Response(requirements: PaymentRequirements): {
    status: number;
    body: {
      error: string;
      x402Version: number;
      paymentRequirements: PaymentRequirements;
    };
  };
}
