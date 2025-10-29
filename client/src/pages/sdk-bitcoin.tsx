import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Package, BookOpen, Code2 } from "lucide-react";

export default function BitcoinSdkPage() {
  return (
    <div className="container mx-auto max-w-4xl px-6 md:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Bitcoin SDK Demo</h1>
        <p className="text-lg text-muted-foreground">
          TypeScript SDK for integrating x402 payments with Rapid402 facilitator on Bitcoin
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Installation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Install the SDK via npm:
            </p>
            <code className="block p-4 bg-muted rounded-md font-mono text-sm">
              npm install @rapid402/sdk
            </code>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="default" data-testid="button-npm-package">
                <a href="https://www.npmjs.com/package/@rapid402/sdk" target="_blank" rel="noopener noreferrer">
                  <Package className="h-4 w-4 mr-2" />
                  View on npm
                  <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </Button>
              <Button asChild variant="secondary" data-testid="button-github-repo">
                <a href="https://github.com/rapid402/rapid402-sdk" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4 mr-2" />
                  View on GitHub
                  <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code2 className="h-5 w-5" />
              Client-Side Usage (Bitcoin)
            </CardTitle>
            <CardDescription>
              Automatic 402 payment handling with Bitcoin wallet support
            </CardDescription>
          </CardHeader>
          <CardContent>
            <code className="block p-4 bg-muted rounded-md font-mono text-sm whitespace-pre overflow-x-auto">
{`import { createRapid402Client } from '@rapid402/sdk/client';
import { constructBitcoinSigningMessage } from '@rapid402/sdk';

const btcClient = createRapid402Client({
  facilitatorUrl: 'https://rapid402.com/api/v1',
  network: 'bitcoin-mainnet', // or 'bitcoin-testnet'
  wallet: myBitcoinWallet,
  maxPaymentAmount: BigInt('100000000') // 1 BTC max (in satoshis)
});

// Automatically handles 402 payments!
const response = await btcClient.fetch('/api/premium-data');
const data = await response.json();

// For manual signing (advanced):
const message = constructBitcoinSigningMessage({
  from: senderAddress,
  to: receiverAddress,
  value: amountInSatoshis
});
const signature = await wallet.signMessage(message);`}
            </code>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code2 className="h-5 w-5" />
              Server-Side Usage (Bitcoin)
            </CardTitle>
            <CardDescription>
              Create payment-gated APIs with Express middleware for Bitcoin payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <code className="block p-4 bg-muted rounded-md font-mono text-sm whitespace-pre overflow-x-auto">
{`import { Rapid402PaymentHandler } from '@rapid402/sdk/server';

const btcHandler = new Rapid402PaymentHandler({
  facilitatorUrl: 'https://rapid402.com/api/v1',
  network: 'bitcoin-mainnet',
  treasuryAddress: process.env.BITCOIN_TREASURY_ADDRESS
});

// Payment-gated endpoint with Bitcoin!
app.get('/api/premium', 
  btcHandler.middleware({ 
    amount: '100000', // 0.001 BTC (100,000 satoshis)
    asset: 'BTC'
  }),
  (req, res) => res.json({ data: 'Premium content' })
);

// Note: Bitcoin doesn't support tokens on L1
// Only native BTC is supported`}
            </code>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code2 className="h-5 w-5" />
              Bitcoin Message Signing
            </CardTitle>
            <CardDescription>
              Manual signing for Bitcoin payments using the shared signing utility
            </CardDescription>
          </CardHeader>
          <CardContent>
            <code className="block p-4 bg-muted rounded-md font-mono text-sm whitespace-pre overflow-x-auto">
{`import { constructBitcoinSigningMessage } from '@rapid402/sdk';

// Construct the canonical signing message
// Bitcoin uses same format as other chains for consistency
const message = constructBitcoinSigningMessage({
  from: 'bc1qxy2...', // sender Bitcoin address
  to: 'bc1qab3...',   // receiver Bitcoin address
  value: '100000',    // 0.001 BTC (100,000 satoshis)
  // Optional fields with defaults:
  validAfter: '0',
  validBefore: '999999999999',
  nonce: '0x0'
});

// Sign with Bitcoin wallet
// Bitcoin uses ECDSA signatures
const signature = await bitcoinWallet.signMessage(message);

// For x402 protocol, signature should be split into v, r, s
// (Implementation depends on your Bitcoin wallet library)
const payload = {
  from: senderAddress,
  to: receiverAddress,
  value: amountInSatoshis,
  v: recoveryId,
  r: signatureR,
  s: signatureS
};`}
            </code>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Bitcoin-Specific Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✓</span>
                <div>
                  <strong>ECDSA Signature Verification:</strong> Cryptographic verification of Bitcoin wallet signatures
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✓</span>
                <div>
                  <strong>UTXO Model:</strong> Bitcoin's unique transaction model handled seamlessly by the facilitator
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✓</span>
                <div>
                  <strong>Multiple Address Formats:</strong> Support for Legacy, SegWit, and Native SegWit (Bech32) addresses
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✓</span>
                <div>
                  <strong>Network Support:</strong> Bitcoin mainnet and testnet with seamless switching
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✓</span>
                <div>
                  <strong>Native BTC Only:</strong> Layer 1 Bitcoin - no token complexity, just pure BTC payments
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✓</span>
                <div>
                  <strong>Security:</strong> Most secure blockchain with decades of proven track record
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✓</span>
                <div>
                  <strong>Shared Signing Utility:</strong> Export <code className="text-xs bg-muted px-1 py-0.5 rounded">constructBitcoinSigningMessage</code> ensures SDK and server use identical message format
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✓</span>
                <div>
                  <strong>Satoshi Precision:</strong> All amounts in satoshis (1 BTC = 100,000,000 satoshis) for precise micropayments
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Differences from EVM Chains</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Bitcoin uses satoshis (8 decimals) instead of wei (18 decimals)</li>
              <li>• UTXO model vs account-based model</li>
              <li>• No smart contracts on Bitcoin L1</li>
              <li>• No token support - only native BTC</li>
              <li>• Different address formats (bc1q... for mainnet, tb1q... for testnet)</li>
              <li>• Slower block times (~10 minutes) but higher security</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline">
                <a href="/api" data-testid="link-api-docs">
                  <BookOpen className="h-4 w-4 mr-2" />
                  API Documentation
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href="/quick-start" data-testid="link-quick-start">
                  <Code2 className="h-4 w-4 mr-2" />
                  Quick Start Guide
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href="/whitepaper" data-testid="link-whitepaper">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Whitepaper
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
