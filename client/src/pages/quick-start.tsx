import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function QuickStart() {
  return (
    <div className="container mx-auto max-w-4xl px-6 md:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Quick Start Guide</h1>
        <p className="text-lg text-muted-foreground">
          Get up and running with Rapid402 in minutes
        </p>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Install the SDK</CardTitle>
            <CardDescription>
              Choose your preferred package manager
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <code className="block p-4 bg-muted rounded-md font-mono text-sm">
                  npm install @rapid402/sdk
                </code>
              </div>
              <p className="text-sm text-muted-foreground">Or with yarn:</p>
              <div>
                <code className="block p-4 bg-muted rounded-md font-mono text-sm">
                  yarn add @rapid402/sdk
                </code>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step 2: Initialize the Client</CardTitle>
            <CardDescription>
              Configure the Rapid402 client
            </CardDescription>
          </CardHeader>
          <CardContent>
            <code className="block p-4 bg-muted rounded-md font-mono text-sm whitespace-pre">
{`import { Rapid402Client } from '@rapid402/sdk';

const client = new Rapid402Client({
  baseUrl: 'https://rapid402.com/api/v1',
  network: 'solana-mainnet'
});`}
            </code>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step 3: Verify a Payment</CardTitle>
            <CardDescription>
              Verify cryptographically signed payment payloads
            </CardDescription>
          </CardHeader>
          <CardContent>
            <code className="block p-4 bg-muted rounded-md font-mono text-sm whitespace-pre">
{`const verification = await client.verify({
  paymentPayload: signedPayload,
  amount: '1000000000', // 1 SOL
  asset: 'SOL'
});

if (verification.valid) {
  console.log('Payment verified!');
}`}
            </code>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step 4: Settle the Payment</CardTitle>
            <CardDescription>
              Finalize the transaction on-chain
            </CardDescription>
          </CardHeader>
          <CardContent>
            <code className="block p-4 bg-muted rounded-md font-mono text-sm whitespace-pre">
{`const settlement = await client.settle({
  transactionId: verification.id
});

console.log('Payment settled:', settlement);`}
            </code>
          </CardContent>
        </Card>

        <div className="flex gap-4 pt-4">
          <Button asChild data-testid="button-api-reference">
            <Link href="/api/verify">
              View API Reference
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild data-testid="button-full-examples">
            <Link href="/examples/javascript">
              See Full Examples
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
