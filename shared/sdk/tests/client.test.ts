/// <reference types="jest" />

import { createRapid402Client } from '../src/client';
import type { WalletAdapter } from '../src/types';

describe('createRapid402Client', () => {
  const mockWallet: WalletAdapter = {
    publicKey: {
      toBase58: () => 'mockPublicKey123'
    },
    signTransaction: jest.fn()
  };

  const config = {
    facilitatorUrl: 'https://rapid402.com/api/v1',
    network: 'solana-devnet' as const,
    wallet: mockWallet
  };

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('client creation', () => {
    it('should create a client with the correct configuration', () => {
      const client = createRapid402Client(config);
      expect(client).toBeDefined();
      expect(client.fetch).toBeDefined();
      expect(client.getHealth).toBeDefined();
      expect(client.getSupported).toBeDefined();
    });
  });

  describe('fetch', () => {
    it('should make a regular fetch request for non-402 responses', async () => {
      const client = createRapid402Client(config);
      const mockResponse = {
        ok: true,
        status: 200,
        json: async () => ({ data: 'success' })
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      const response = await client.fetch('https://api.example.com/data');

      expect(global.fetch).toHaveBeenCalledWith('https://api.example.com/data', undefined);
      expect(response.status).toBe(200);
    });

    it('should handle 402 payment required responses', async () => {
      const client = createRapid402Client(config);
      
      const paymentRequiredResponse = {
        status: 402,
        json: async () => ({
          error: 'Payment Required',
          x402Version: 1,
          paymentRequirements: {
            scheme: 'exact',
            network: 'solana-devnet',
            payTo: 'recipientAddress',
            maxAmountRequired: '1000000',
            resource: '/api/data'
          }
        })
      };

      const successResponse = {
        ok: true,
        status: 200,
        json: async () => ({ data: 'success' })
      };

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce(paymentRequiredResponse)
        .mockResolvedValueOnce(successResponse);

      const response = await client.fetch('https://api.example.com/data');

      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(response.status).toBe(200);
    });

    it('should reject payments exceeding maxPaymentAmount', async () => {
      const clientWithLimit = createRapid402Client({
        ...config,
        maxPaymentAmount: BigInt(500000)
      });

      const paymentRequiredResponse = {
        status: 402,
        json: async () => ({
          error: 'Payment Required',
          x402Version: 1,
          paymentRequirements: {
            scheme: 'exact',
            network: 'solana-devnet',
            payTo: 'recipientAddress',
            maxAmountRequired: '1000000',
            resource: '/api/data'
          }
        })
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce(paymentRequiredResponse);

      await expect(clientWithLimit.fetch('https://api.example.com/data'))
        .rejects.toThrow('Payment amount 1000000 exceeds maximum 500000');
    });
  });

  describe('getHealth', () => {
    it('should fetch health status from facilitator', async () => {
      const client = createRapid402Client(config);
      const mockHealth = {
        status: 'healthy',
        uptime: 12345,
        version: '1.0.0',
        network: 'solana-mainnet',
        blockHeight: 354123456
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockHealth
      });

      const health = await client.getHealth();

      expect(global.fetch).toHaveBeenCalledWith('https://rapid402.com/api/v1/health');
      expect(health.status).toBe('healthy');
      expect(health.uptime).toBe(12345);
    });
  });

  describe('getSupported', () => {
    it('should fetch supported networks and assets from facilitator', async () => {
      const client = createRapid402Client(config);
      const mockSupported = {
        networks: [
          { network: 'solana-mainnet', chainId: 101 },
          { network: 'solana-devnet', chainId: 102 }
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

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSupported
      });

      const supported = await client.getSupported();

      expect(global.fetch).toHaveBeenCalledWith('https://rapid402.com/api/v1/supported');
      expect(supported.networks).toHaveLength(2);
      expect(supported.paymentSchemes).toContain('exact');
    });
  });
});
