import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

export default function JavaScriptExample() {
  const [copied, setCopied] = useState(false);

  const exampleCode = `import { Rapid402Client } from '@rapid402/sdk';

// Initialize the client
const client = new Rapid402Client({
  baseUrl: 'https://rapid402.com/api/v1',
  network: 'solana-mainnet'
});

// Verify a payment
const verification = await client.verify({
  paymentPayload: signedPayload,
  amount: '1000000000', // 1 SOL
  asset: 'SOL'
});

// Settle the payment
if (verification.valid) {
  const settlement = await client.settle({
    transactionId: verification.id
  });
  console.log('Payment settled:', settlement);
}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(exampleCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto max-w-4xl px-6 md:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">JavaScript Integration</h1>
        <p className="text-lg text-muted-foreground">
          Complete example using the x402 JavaScript SDK
        </p>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Full Example</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={copyToClipboard}
                data-testid="button-copy-code"
              >
                {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <code className="block p-4 bg-muted rounded-md font-mono text-sm whitespace-pre">
              {exampleCode}
            </code>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Installation</CardTitle>
          </CardHeader>
          <CardContent>
            <code className="block p-4 bg-muted rounded-md font-mono text-sm">
              npm install @rapid402/sdk
            </code>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>TypeScript Support</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              The SDK includes full TypeScript definitions for type safety.
            </p>
            <code className="block p-4 bg-muted rounded-md font-mono text-sm whitespace-pre">
{`import { Rapid402Client, VerifyPaymentResponse } from '@rapid402/sdk';

const result: VerifyPaymentResponse = await client.verify({
  paymentPayload: '0x...',
  amount: '1000000000', // 1 SOL
  asset: 'SOL'
});`}
            </code>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
