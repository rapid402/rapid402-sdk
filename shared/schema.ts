import { z } from "zod";

// x402 Payment Protocol Types

export const paymentPayloadSchema = z.object({
  x402Version: z.number(),
  scheme: z.enum(["exact", "upto", "deferred"]),
  network: z.string(),
  payload: z.record(z.unknown()),
});

export type PaymentPayload = z.infer<typeof paymentPayloadSchema>;

export const paymentRequirementsSchema = z.object({
  scheme: z.enum(["exact", "upto", "deferred"]),
  network: z.string(),
  maxAmountRequired: z.string(),
  payTo: z.string(),
  resource: z.string(),
  asset: z.string().optional(),
  nonce: z.string().optional(),
  validUntil: z.number().optional(),
});

export type PaymentRequirements = z.infer<typeof paymentRequirementsSchema>;

export const verifyRequestSchema = z.object({
  x402Version: z.number(),
  paymentPayload: paymentPayloadSchema,
  paymentRequirements: paymentRequirementsSchema,
});

export type VerifyRequest = z.infer<typeof verifyRequestSchema>;

export const verifyResponseSchema = z.object({
  isValid: z.boolean(),
  payer: z.string().optional(),
  error: z.string().optional(),
});

export type VerifyResponse = z.infer<typeof verifyResponseSchema>;

export const settleRequestSchema = z.object({
  x402Version: z.number(),
  paymentPayload: paymentPayloadSchema,
  paymentRequirements: paymentRequirementsSchema,
});

export type SettleRequest = z.infer<typeof settleRequestSchema>;

export const settleResponseSchema = z.object({
  isValid: z.boolean(),
  payer: z.string().optional(),
  transactionHash: z.string().optional(),
  error: z.string().optional(),
});

export type SettleResponse = z.infer<typeof settleResponseSchema>;

export const healthResponseSchema = z.object({
  status: z.enum(["healthy", "degraded", "unhealthy"]),
  uptime: z.number(),
  version: z.string(),
  network: z.string(),
  blockHeight: z.number().optional(),
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;

export const supportedNetworkSchema = z.object({
  network: z.string(),
  chainId: z.number(),
  rpcUrl: z.string(),
  explorerUrl: z.string(),
});

export type SupportedNetwork = z.infer<typeof supportedNetworkSchema>;

export const supportedAssetSchema = z.object({
  symbol: z.string(),
  name: z.string(),
  contractAddress: z.string(),
  decimals: z.number(),
  network: z.string(),
});

export type SupportedAsset = z.infer<typeof supportedAssetSchema>;

export const supportedResponseSchema = z.object({
  networks: z.array(supportedNetworkSchema),
  paymentSchemes: z.array(z.string()),
  assets: z.array(supportedAssetSchema),
  capabilities: z.array(z.string()),
});

export type SupportedResponse = z.infer<typeof supportedResponseSchema>;

// Frontend documentation types (existing)
export const apiMethodSchema = z.object({
  method: z.enum(["GET", "POST"]),
  endpoint: z.string(),
  description: z.string(),
  category: z.enum(["verify", "settle", "health", "supported"]),
});

export type ApiMethod = z.infer<typeof apiMethodSchema>;

export const specificationSchema = z.object({
  category: z.string(),
  details: z.string(),
});

export type Specification = z.infer<typeof specificationSchema>;

export const codeExampleSchema = z.object({
  language: z.enum(["javascript", "python", "curl"]),
  label: z.string(),
  code: z.string(),
});

export type CodeExample = z.infer<typeof codeExampleSchema>;

export const capabilitySchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string(),
});

export type Capability = z.infer<typeof capabilitySchema>;

// Payment Request Types for QR Code Generation
export const paymentRequestSchema = z.object({
  id: z.string(),
  amount: z.string(),
  asset: z.string(),
  network: z.string(),
  recipientAddress: z.string(),
  description: z.string().optional(),
  createdAt: z.string(),
  expiresAt: z.string().optional(),
  status: z.enum(["pending", "completed", "expired"]).default("pending"),
});

export type PaymentRequest = z.infer<typeof paymentRequestSchema>;

export const insertPaymentRequestSchema = paymentRequestSchema.omit({ id: true, createdAt: true, status: true });

export type InsertPaymentRequest = z.infer<typeof insertPaymentRequestSchema>;

// User types (for authentication if needed)
export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
});

export type User = z.infer<typeof userSchema>;

export const insertUserSchema = userSchema.omit({ id: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
