/// <reference types="jest" />

import type {
  PaymentPayload,
  PaymentRequirements,
  VerifyRequest,
  VerifyResponse,
  SettleRequest,
  SettleResponse,
  HealthResponse,
  SupportedResponse,
  WalletAdapter
} from '../src/types';

describe('Type definitions', () => {
  it('should compile with correct PaymentPayload type', () => {
    const payload: PaymentPayload = {
      x402Version: 1,
      scheme: 'exact',
      network: 'solana-devnet',
      payload: {
        from: 'senderAddress',
        to: 'recipientAddress',
        value: '1000000000',
        validAfter: '1234567890',
        validBefore: '1234571490',
        nonce: '0x1234567890abcdef',
        v: '0x00',
        r: '0x' + '0'.repeat(64),
        s: '0x' + '0'.repeat(64)
      }
    };
    expect(payload.x402Version).toBe(1);
    expect(payload.scheme).toBe('exact');
  });

  it('should compile with correct PaymentRequirements type', () => {
    const requirements: PaymentRequirements = {
      scheme: 'exact',
      network: 'solana-devnet',
      payTo: 'recipientAddress',
      maxAmountRequired: '1000000000',
      resource: '/api/test'
    };
    expect(requirements.scheme).toBe('exact');
    expect(requirements.network).toBe('solana-devnet');
  });

  it('should compile with correct VerifyRequest type', () => {
    const request: VerifyRequest = {
      x402Version: 1,
      paymentPayload: {
        x402Version: 1,
        scheme: 'exact',
        network: 'solana-devnet',
        payload: {}
      },
      paymentRequirements: {
        scheme: 'exact',
        network: 'solana-devnet',
        payTo: 'recipientAddress',
        maxAmountRequired: '1000000000',
        resource: '/api/test'
      }
    };
    expect(request.x402Version).toBe(1);
  });

  it('should compile with correct VerifyResponse type', () => {
    const response: VerifyResponse = {
      isValid: true,
      payer: 'payerAddress'
    };
    expect(response.isValid).toBe(true);
  });

  it('should compile with correct SettleResponse type', () => {
    const response: SettleResponse = {
      isValid: true,
      payer: 'payerAddress',
      transactionHash: '0xabc123def456'
    };
    expect(response.isValid).toBe(true);
    expect(response.transactionHash).toBeDefined();
  });

  it('should compile with correct HealthResponse type', () => {
    const response: HealthResponse = {
      status: 'healthy',
      uptime: 12345,
      version: '1.0.0',
      network: 'solana-mainnet',
      blockHeight: 354000000
    };
    expect(response.status).toBe('healthy');
  });

  it('should compile with correct SupportedResponse type', () => {
    const response: SupportedResponse = {
      networks: [
        { network: 'solana-mainnet', chainId: 101 }
      ],
      paymentSchemes: ['exact'],
      assets: [
        {
          network: 'solana-mainnet',
          symbol: 'SOL',
          decimals: 9,
          contractAddress: undefined
        }
      ],
      capabilities: ['verify', 'settle']
    };
    expect(response.networks).toHaveLength(1);
    expect(response.paymentSchemes).toContain('exact');
  });

  it('should compile with correct WalletAdapter type', () => {
    const wallet: WalletAdapter = {
      publicKey: {
        toBase58: () => 'mockAddress123'
      },
      signTransaction: jest.fn()
    };
    expect(wallet.publicKey.toBase58()).toBe('mockAddress123');
  });
});
