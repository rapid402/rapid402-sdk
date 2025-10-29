import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Package, BookOpen, Code2 } from "lucide-react";

export default function BaseSdkPage() {
  return (
    <div className="container mx-auto max-w-4xl px-6 md:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">BASE SDK Demo</h1>
        <p className="text-lg text-muted-foreground">
          TypeScript SDK for integrating x402 payments with Rapid402 facilitator on BASE (Ethereum L2)
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
              Client-Side Usage (BASE)
            </CardTitle>
            <CardDescription>
              Automatic 402 payment handling with Ethereum/BASE wallet support
            </CardDescription>
          </CardHeader>
          <CardContent>
            <code className="block p-4 bg-muted rounded-md font-mono text-sm whitespace-pre overflow-x-auto">
{`import { createRapid402Client } from '@rapid402/sdk/client';
import { constructBaseSigningMessage } from '@rapid402/sdk';

const baseClient = createRapid402Client({
  facilitatorUrl: 'https://rapid402.com/api/v1',
  network: 'base-mainnet', // or 'base-sepolia'
  wallet: myEthWallet,
  maxPaymentAmount: BigInt('1000000000000000000') // 1 ETH max
});

// Automatically handles 402 payments!
const response = await baseClient.fetch('/api/premium-data');
const data = await response.json();

// For manual signing (advanced):
const message = constructBaseSigningMessage({
  from: senderAddress,
  to: receiverAddress,
  value: amountInWei
});
const signature = await wallet.signMessage(message);`}
            </code>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code2 className="h-5 w-5" />
              Server-Side Usage (BASE)
            </CardTitle>
            <CardDescription>
              Create payment-gated APIs with Express middleware for BASE payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <code className="block p-4 bg-muted rounded-md font-mono text-sm whitespace-pre overflow-x-auto">
{`import { Rapid402PaymentHandler } from '@rapid402/sdk/server';

const baseHandler = new Rapid402PaymentHandler({
  facilitatorUrl: 'https://rapid402.com/api/v1',
  network: 'base-mainnet',
  treasuryAddress: process.env.BASE_TREASURY_WALLET
});

// Payment-gated endpoint with BASE!
app.get('/api/premium', 
  baseHandler.middleware({ 
    amount: '1000000000000000000', // 1 ETH
    asset: 'ETH'
  }),
  (req, res) => res.json({ data: 'Premium content' })
);`}
            </code>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code2 className="h-5 w-5" />
              ECDSA Signature Signing (BASE)
            </CardTitle>
            <CardDescription>
              Manual signing for BASE payments using the shared signing utility
            </CardDescription>
          </CardHeader>
          <CardContent>
            <code className="block p-4 bg-muted rounded-md font-mono text-sm whitespace-pre overflow-x-auto">
{`import { constructBaseSigningMessage } from '@rapid402/sdk';
import { ethers } from 'ethers';

// Construct the canonical signing message
const message = constructBaseSigningMessage({
  from: '0x1234...', // sender address
  to: '0x5678...',   // receiver address
  value: '1000000000000000000', // 1 ETH in wei
  // Optional fields with defaults:
  validAfter: '0',
  validBefore: '999999999999',
  nonce: '0x0'
});

// Sign with Ethereum wallet
const signer = new ethers.Wallet(privateKey);
const signature = await signer.signMessage(message);

// Split signature for x402 protocol
const sig = ethers.Signature.from(signature);
const payload = {
  from: senderAddress,
  to: receiverAddress,
  value: amountInWei,
  v: sig.v,
  r: sig.r,
  s: sig.s
};`}
            </code>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              BASE-Specific Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✓</span>
                <div>
                  <strong>ECDSA Signature Verification:</strong> Cryptographic verification of Ethereum wallet signatures
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✓</span>
                <div>
                  <strong>ERC-20 Token Support:</strong> Works with ETH, USDC, USDT, WETH, and all ERC-20 tokens
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✓</span>
                <div>
                  <strong>Network Support:</strong> BASE mainnet and Sepolia testnet with seamless switching
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✓</span>
                <div>
                  <strong>Low L2 Fees:</strong> Leverage BASE's optimized L2 costs for affordable payments
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✓</span>
                <div>
                  <strong>Ethereum Compatibility:</strong> Works with all Ethereum wallets (MetaMask, WalletConnect, etc.)
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✓</span>
                <div>
                  <strong>Shared Signing Utility:</strong> Export <code className="text-xs bg-muted px-1 py-0.5 rounded">constructBaseSigningMessage</code> ensures SDK and server use identical message format
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Need Help?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>If you encounter any issues or have questions:</p>
            <ul className="space-y-1 ml-4">
              <li>• Ask the AI assistant in the bottom left</li>
              <li>• Open an issue on <a href="https://github.com/rapid402/rapid402-sdk/issues" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">GitHub</a></li>
              <li>• Check our <a href="/support/faq" className="text-primary hover:underline">FAQ</a></li>
              <li>• Join our <a href="/support/community" className="text-primary hover:underline">Community</a></li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
