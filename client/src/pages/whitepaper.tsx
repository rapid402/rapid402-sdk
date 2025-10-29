import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Whitepaper() {
  return (
    <div className="container mx-auto max-w-4xl px-6 md:px-8 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-bold mb-4">Rapid402 Whitepaper</h1>
        <p className="text-xl text-muted-foreground mb-2">
          x402 Payment Facilitator on Solana
        </p>
        <p className="text-sm text-muted-foreground">
          Version 1.0.0 | October 2025
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-3xl font-bold mb-4">Abstract</h2>
          <p className="text-muted-foreground leading-relaxed">
            Rapid402 is a production-ready x402 payment facilitator built on Solana, enabling HTTP-based micropayments through cryptographically signed payment payloads. By implementing the x402 protocol specification, Rapid402 provides developers with a complete solution for monetizing API endpoints and digital resources without traditional payment infrastructure. The system leverages Solana's high throughput and low transaction costs to enable real-time payment verification with on-chain settlement, offering a frictionless payment experience for both service providers and consumers.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-4">1. Introduction</h2>
          
          <h3 className="text-2xl font-semibold mb-3">1.1 Background</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            The HTTP 402 Payment Required status code has existed since HTTP/1.1 but remained largely unused due to the lack of standardized payment protocols. The x402 protocol addresses this gap by defining a specification for cryptographically verified payments over HTTP, enabling per-request micropayments for digital services.
          </p>

          <h3 className="text-2xl font-semibold mb-3">1.2 Problem Statement</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Traditional payment systems impose significant barriers to API monetization:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
            <li>High setup costs and merchant account requirements</li>
            <li>Percentage-based fees that make micropayments uneconomical</li>
            <li>Complex integration requiring payment gateway SDKs</li>
            <li>Delayed settlements and chargeback risks</li>
            <li>Subscription-only models that don't align with pay-per-use consumption</li>
          </ul>

          <h3 className="text-2xl font-semibold mb-3">1.3 Solution Overview</h3>
          <p className="text-muted-foreground leading-relaxed">
            Rapid402 solves these challenges by implementing the x402 protocol on Solana, providing instant payment verification, cryptographic security, low transaction costs, and seamless integration through a TypeScript SDK. Service providers can monetize individual API requests without subscription overhead, while consumers pay only for resources they actually use.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-4">2. Technical Architecture</h2>
          
          <h3 className="text-2xl font-semibold mb-3">2.1 System Components</h3>
          
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Client-Side SDK</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                Browser and Node.js library for payment integration
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Automatic 402 response handling</li>
                <li>• Wallet adapter integration</li>
                <li>• Payment payload creation and signing</li>
                <li>• Network configuration (mainnet/devnet)</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Server-Side SDK</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                Backend library for payment verification and settlement
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Payment requirement generation</li>
                <li>• Header-based payment extraction</li>
                <li>• Facilitator API integration</li>
                <li>• Express/Connect middleware support</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Facilitator Backend</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                Core verification and settlement service
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• POST /api/v1/verify - Ed25519 signature verification</li>
                <li>• POST /api/v1/settle - On-chain transaction execution</li>
                <li>• GET /api/v1/health - Service health and blockchain status</li>
                <li>• GET /api/v1/supported - Network and asset capabilities</li>
              </ul>
            </CardContent>
          </Card>

          <h3 className="text-2xl font-semibold mb-3 mt-6">2.2 Payment Flow</h3>
          <div className="bg-muted p-6 rounded-lg space-y-3 text-sm">
            <p><strong>Step 1:</strong> Client requests protected resource without payment</p>
            <p><strong>Step 2:</strong> Server responds with 402 Payment Required and payment requirements</p>
            <p><strong>Step 3:</strong> Client creates payment payload and signs with wallet</p>
            <p><strong>Step 4:</strong> Client retries request with X-Payment header containing signed payload</p>
            <p><strong>Step 5:</strong> Server extracts payment and calls facilitator verify endpoint</p>
            <p><strong>Step 6:</strong> Facilitator validates signature and payment parameters</p>
            <p><strong>Step 7:</strong> Server grants access to resource</p>
            <p><strong>Step 8:</strong> Server calls facilitator settle endpoint for on-chain execution</p>
            <p><strong>Step 9:</strong> Facilitator executes Solana transaction and returns confirmation</p>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-4">3. Cryptographic Security</h2>
          
          <h3 className="text-2xl font-semibold mb-3">3.1 Ed25519 Signature Verification</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Rapid402 implements Ed25519 elliptic curve signature verification, the same cryptographic system used by Solana for transaction signing. This provides:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
            <li>128-bit security level equivalent to 3072-bit RSA</li>
            <li>Fast signature verification (sub-millisecond)</li>
            <li>Compact signatures (64 bytes)</li>
            <li>Resistance to timing attacks</li>
          </ul>

          <h3 className="text-2xl font-semibold mb-3">3.2 Payment Payload Structure</h3>
          <div className="bg-muted p-4 rounded-lg">
            <pre className="text-xs overflow-x-auto">
{`{
  "x402Version": 1,
  "scheme": "exact",
  "network": "solana-mainnet",
  "payload": {
    "from": "<payer_public_key>",
    "to": "<recipient_public_key>",
    "value": "<amount_in_lamports>",
    "validAfter": "<unix_timestamp>",
    "validBefore": "<unix_timestamp>",
    "nonce": "<random_hex_string>",
    "v": "<recovery_id>",
    "r": "<signature_r_component>",
    "s": "<signature_s_component>"
  }
}`}
            </pre>
          </div>

          <h3 className="text-2xl font-semibold mb-3 mt-4">3.3 Security Properties</h3>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li><strong>Non-repudiation:</strong> Cryptographic proof that payment was authorized by wallet holder</li>
            <li><strong>Replay protection:</strong> Unique nonces prevent duplicate payment submissions</li>
            <li><strong>Time-bounded validity:</strong> validAfter/validBefore prevents indefinite payment authorization</li>
            <li><strong>Amount verification:</strong> Exact payment amount is cryptographically committed</li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-4">4. Solana Integration</h2>
          
          <h3 className="text-2xl font-semibold mb-3">4.1 Network Support</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Rapid402 supports both Solana mainnet (chainId 101) and devnet (chainId 102), enabling development and testing before production deployment.
          </p>

          <h3 className="text-2xl font-semibold mb-3">4.2 Asset Support</h3>
          <Card>
            <CardHeader>
              <CardTitle>Supported Assets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-semibold text-sm">SOL (Native Token)</p>
                <p className="text-xs text-muted-foreground">9 decimals | Direct native transfer</p>
              </div>
              <div>
                <p className="font-semibold text-sm">USDC (SPL Token)</p>
                <p className="text-xs text-muted-foreground">6 decimals | Token program transfer</p>
              </div>
              <div>
                <p className="font-semibold text-sm">USDT (SPL Token)</p>
                <p className="text-xs text-muted-foreground">6 decimals | Token program transfer</p>
              </div>
            </CardContent>
          </Card>

          <h3 className="text-2xl font-semibold mb-3 mt-4">4.3 Transaction Execution</h3>
          <p className="text-muted-foreground leading-relaxed">
            Settlement transactions are executed using @solana/web3.js with proper fee estimation and confirmation tracking. The facilitator maintains a hot wallet (private key secured in environment variables) for signing settlement transactions on behalf of service providers.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-4">5. SDK Implementation</h2>
          
          <h3 className="text-2xl font-semibold mb-3">5.1 Client SDK</h3>
          <div className="bg-muted p-4 rounded-lg mb-4">
            <pre className="text-xs overflow-x-auto">
{`import { createRapid402Client } from '@rapid402/sdk/client';

const client = createRapid402Client({
  facilitatorUrl: 'https://rapid402.com/api/v1',
  network: 'solana-mainnet',
  wallet: myWalletAdapter,
  maxPaymentAmount: BigInt(1000000000) // 1 SOL
});

// Automatic 402 handling
const response = await client.fetch('/api/paid-endpoint');`}
            </pre>
          </div>

          <h3 className="text-2xl font-semibold mb-3">5.2 Server SDK</h3>
          <div className="bg-muted p-4 rounded-lg">
            <pre className="text-xs overflow-x-auto">
{`import { Rapid402PaymentHandler } from '@rapid402/sdk/server';

const rapid402 = new Rapid402PaymentHandler({
  facilitatorUrl: 'https://rapid402.com/api/v1',
  network: 'solana-mainnet',
  treasuryAddress: process.env.TREASURY_WALLET
});

// Express middleware
app.use('/api/premium', rapid402.middleware({
  amount: '100000000', // 0.1 SOL
  onPaymentVerified: (payment) => {
    console.log('Payment received:', payment);
  }
}));`}
            </pre>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-4">6. Use Cases</h2>
          
          <h3 className="text-2xl font-semibold mb-3">6.1 API Monetization</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            SaaS providers can charge per API request instead of requiring monthly subscriptions. Users pay only for resources consumed, enabling pay-as-you-go pricing models.
          </p>

          <h3 className="text-2xl font-semibold mb-3">6.2 Content Micropayments</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Publishers can monetize individual articles or media files without paywalls or subscriptions. Readers pay small amounts for specific content they want to access.
          </p>

          <h3 className="text-2xl font-semibold mb-3">6.3 AI Model Access</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Machine learning APIs can charge per inference request, aligning costs with actual usage. Eliminates need for tiered pricing or rate limits based on subscription level.
          </p>

          <h3 className="text-2xl font-semibold mb-3">6.4 Data Services</h3>
          <p className="text-muted-foreground leading-relaxed">
            Real-time data providers can monetize individual data points or queries. Financial data, weather APIs, and analytics services benefit from granular usage-based billing.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-4">7. Performance & Scalability</h2>
          
          <h3 className="text-2xl font-semibold mb-3">7.1 Verification Latency</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Ed25519 signature verification completes in under 1ms on modern hardware. The verify endpoint typically responds within 50-100ms including network overhead.
          </p>

          <h3 className="text-2xl font-semibold mb-3">7.2 Settlement Speed</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Solana transactions achieve sub-second confirmation times (400ms average). Settlement can be executed asynchronously after granting resource access, ensuring zero user-facing latency.
          </p>

          <h3 className="text-2xl font-semibold mb-3">7.3 Cost Structure</h3>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>Verification: Free (off-chain signature check)</li>
            <li>Settlement: ~0.000005 SOL per transaction (~$0.0001 at $20/SOL)</li>
            <li>No percentage fees or merchant account costs</li>
            <li>Fixed costs enable economical micropayments as low as $0.01</li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-4">8. Deployment & Operations</h2>
          
          <h3 className="text-2xl font-semibold mb-3">8.1 Environment Configuration</h3>
          <div className="bg-muted p-4 rounded-lg mb-4">
            <pre className="text-xs overflow-x-auto">
{`# Required environment variables
FACILITATOR_PRIVATE_KEY=<base58_keypair>
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SOLANA_DEVNET_RPC_URL=https://api.devnet.solana.com`}
            </pre>
          </div>

          <h3 className="text-2xl font-semibold mb-3">8.2 Installation</h3>
          <div className="bg-muted p-4 rounded-lg mb-4">
            <pre className="text-xs overflow-x-auto">
{`npm install @rapid402/sdk`}
            </pre>
          </div>

          <h3 className="text-2xl font-semibold mb-3">8.3 Production Recommendations</h3>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>Use premium RPC providers (Helius, QuickNode) for reliability</li>
            <li>Implement rate limiting to prevent abuse</li>
            <li>Monitor settlement transaction confirmations</li>
            <li>Rotate facilitator keypairs periodically</li>
            <li>Implement API key authentication alongside payment verification</li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-4">9. Conclusion</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Rapid402 provides a complete implementation of the x402 protocol on Solana, enabling frictionless micropayments for HTTP-based services. By combining cryptographic payment verification with low-cost blockchain settlement, the system makes pay-per-use monetization practical for API providers and content publishers.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            The TypeScript SDK abstracts protocol complexity while maintaining security and flexibility. Service providers can integrate x402 payments in minutes, while consumers benefit from granular payment options aligned with actual usage.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-4">10. References</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <a 
                href="https://x402.org/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                x402 Protocol Specification
              </a>
            </li>
            <li>
              <a 
                href="https://www.x402.org/x402-whitepaper.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                x402 Protocol Whitepaper
              </a>
            </li>
            <li>
              <a 
                href="https://github.com/rapid402/rapid402-sdk" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Rapid402 SDK Repository
              </a>
            </li>
            <li>
              <a 
                href="https://docs.solana.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Solana Documentation
              </a>
            </li>
            <li>
              <a 
                href="https://ed25519.cr.yp.to/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Ed25519: High-speed high-security signatures
              </a>
            </li>
          </ul>
        </section>

        <section className="mt-12 pt-8 border-t">
          <p className="text-center text-sm text-muted-foreground">
            Rapid402 Whitepaper v1.0.0<br />
            October 2025<br />
            <a 
              href="https://rapid402.com" 
              className="text-primary hover:underline"
            >
              https://rapid402.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
