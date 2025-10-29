// Main entry point - exports types only
export * from './types';

// Re-export client for convenience
export { createRapid402Client } from './client';
export type { Rapid402Client } from './client';

// Re-export server for convenience  
export { Rapid402PaymentHandler } from './server';
export type { PaymentHandler } from './server';

// Re-export signing utilities for BASE chain support
export { constructBaseSigningMessage } from '../../signing-utils';
