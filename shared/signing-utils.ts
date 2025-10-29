/**
 * Signing Utilities for x402 Payment Protocol
 * 
 * CRITICAL: These utilities define the canonical message format for ECDSA signatures
 * on BASE chain. The SDK (@rapid402/sdk) MUST use identical logic to construct
 * signing messages, or signature verification will fail.
 * 
 * This file serves as the single source of truth for message construction.
 */

/**
 * Constructs the canonical signing message for BASE ECDSA signatures.
 * 
 * Format: from|to|value|validAfter|validBefore|nonce
 * 
 * Defaults when fields are omitted:
 *   - validAfter: '0'
 *   - validBefore: '999999999999'
 *   - nonce: '0x0'
 * 
 * @param payload - The payment payload containing signature fields
 * @returns The canonical message string to be signed/verified
 */
export function constructBaseSigningMessage(payload: {
  from: string;
  to: string;
  value: string;
  validAfter?: string;
  validBefore?: string;
  nonce?: string;
}): string {
  return [
    payload.from,
    payload.to,
    payload.value,
    payload.validAfter || '0',
    payload.validBefore || '999999999999',
    payload.nonce || '0x0'
  ].join('|');
}

/**
 * Constructs the canonical signing message for Bitcoin signatures.
 * 
 * Format: from|to|value|validAfter|validBefore|nonce
 * Same format as BASE for consistency across chains.
 * 
 * @param payload - The payment payload containing signature fields
 * @returns The canonical message string to be signed/verified
 */
export function constructBitcoinSigningMessage(payload: {
  from: string;
  to: string;
  value: string;
  validAfter?: string;
  validBefore?: string;
  nonce?: string;
}): string {
  return [
    payload.from,
    payload.to,
    payload.value,
    payload.validAfter || '0',
    payload.validBefore || '999999999999',
    payload.nonce || '0x0'
  ].join('|');
}

/**
 * Constructs the canonical signing message for BSC (Binance Smart Chain) signatures.
 * 
 * Format: from|to|value|validAfter|validBefore|nonce
 * Same format as BASE for consistency across EVM chains.
 * 
 * @param payload - The payment payload containing signature fields
 * @returns The canonical message string to be signed/verified
 */
export function constructBscSigningMessage(payload: {
  from: string;
  to: string;
  value: string;
  validAfter?: string;
  validBefore?: string;
  nonce?: string;
}): string {
  return [
    payload.from,
    payload.to,
    payload.value,
    payload.validAfter || '0',
    payload.validBefore || '999999999999',
    payload.nonce || '0x0'
  ].join('|');
}

/**
 * Example usage:
 * 
 * ```typescript
 * // For SDK developers - import from @rapid402/sdk:
 * import { constructBaseSigningMessage } from '@rapid402/sdk';
 * 
 * // When creating a payment payload:
 * const message = constructBaseSigningMessage({
 *   from: senderAddress,
 *   to: receiverAddress,
 *   value: amountInWei,
 *   // Optional fields can be omitted, defaults will be applied
 * });
 * 
 * // Sign the message with your wallet
 * const signature = await wallet.signMessage(message);
 * 
 * // For server developers - import from shared/signing-utils:
 * import { constructBaseSigningMessage } from '../shared/signing-utils';
 * 
 * // When verifying signatures:
 * const message = constructBaseSigningMessage(payload);
 * const recoveredAddress = ethers.verifyMessage(message, signature);
 * ```
 */
