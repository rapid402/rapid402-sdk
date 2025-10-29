import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Package, BookOpen, Code2 } from "lucide-react";

export default function SdkPage() {
  return (
    <div className="container mx-auto max-w-4xl px-6 md:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">@rapid402/sdk</h1>
        <p className="text-lg text-muted-foreground">
          TypeScript SDK for integrating x402 payments with Rapid402 facilitator on Solana
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
              Client-Side Usage
            </CardTitle>
            <CardDescription>
              Automatic 402 payment handling in your browser or Node.js app
            </CardDescription>
          </CardHeader>
          <CardContent>
            <code className="block p-4 bg-muted rounded-md font-mono text-sm whitespace-pre overflow-x-auto">
{`import { createRapid402Client } from '@rapid402/sdk/client';

const rapid402 = createRapid402Client({
  facilitatorUrl: 'https://rapid402.com/api/v1',
  network: 'solana-devnet',
  wallet: myWalletAdapter,
  maxPaymentAmount: BigInt('1000000000') // 1 SOL max
});

// Automatically handles 402 payments!
const response = await rapid402.fetch('/api/premium-data');
const data = await response.json();`}
            </code>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code2 className="h-5 w-5" />
              Server-Side Usage
            </CardTitle>
            <CardDescription>
              Create payment-gated APIs with Express middleware
            </CardDescription>
          </CardHeader>
          <CardContent>
            <code className="block p-4 bg-muted rounded-md font-mono text-sm whitespace-pre overflow-x-auto">
{`import { Rapid402PaymentHandler } from '@rapid402/sdk/server';

const rapid402 = new Rapid402PaymentHandler({
  facilitatorUrl: 'https://rapid402.com/api/v1',
  network: 'solana-mainnet',
  treasuryAddress: process.env.TREASURY_WALLET
});

// Payment-gated endpoint with one line!
app.get('/api/premium', 
  rapid402.middleware({ amount: '1000000000' }),
  (req, res) => res.json({ data: 'Premium content' })
);`}
            </code>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✓</span>
                <div>
                  <strong>Client-Side Integration:</strong> Automatic 402 payment handling with Solana wallet support
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✓</span>
                <div>
                  <strong>Server-Side Middleware:</strong> Express/Connect middleware for payment-gated APIs
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✓</span>
                <div>
                  <strong>Type-Safe:</strong> Full TypeScript support with detailed types from protocol schema
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✓</span>
                <div>
                  <strong>Multiple Exports:</strong> Import from <code className="text-xs bg-muted px-1 py-0.5 rounded">@rapid402/sdk</code>, <code className="text-xs bg-muted px-1 py-0.5 rounded">@rapid402/sdk/client</code>, or <code className="text-xs bg-muted px-1 py-0.5 rounded">@rapid402/sdk/server</code>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✓</span>
                <div>
                  <strong>Solana Networks:</strong> Supports both Solana mainnet and devnet
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✓</span>
                <div>
                  <strong>SPL Token Support:</strong> Works with SOL, USDC, USDT, and all SPL tokens
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documentation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Complete documentation is available in the GitHub repository:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <a 
                  href="https://github.com/rapid402/rapid402-sdk#readme" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  Quick Start Guide
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <a 
                  href="https://github.com/rapid402/rapid402-sdk#api-reference" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  API Reference
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <a 
                  href="https://github.com/rapid402/rapid402-sdk#examples" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  Usage Examples
                  <ExternalLink className="h-3 w-3" />
                </a>
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
