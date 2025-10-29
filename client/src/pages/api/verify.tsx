import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

export default function VerifyPayment() {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    const baseUrl = 'https://rapid402.com/api/v1';
    navigator.clipboard.writeText(baseUrl + '/verify');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto max-w-4xl px-6 md:px-8 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="default" className="font-mono">POST</Badge>
          <Badge variant="secondary" className="font-mono">GET</Badge>
        </div>
        <h1 className="text-4xl font-bold mb-4">Verify Payment</h1>
        <p className="text-lg text-muted-foreground">
          Verify cryptographically signed payment payloads before settlement
        </p>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Endpoints</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <code className="text-sm font-mono">POST /v1/verify</code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => copyToClipboard('https://api.x402.unibase.com/v1/verify')}
                  data-testid="button-copy-post"
                >
                  {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Verify a payment payload with additional parameters. Supports batch verification.
              </p>
            </div>
            <div className="border-t pt-4">
              <code className="text-sm font-mono">GET /v1/verify</code>
              <p className="text-sm text-muted-foreground mt-2">
                Verify a payment payload without settling it. Returns validation status and payment details.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Request Body</CardTitle>
            <CardDescription>POST /v1/verify</CardDescription>
          </CardHeader>
          <CardContent>
            <code className="block p-4 bg-muted rounded-md font-mono text-sm whitespace-pre">
{`{
  "paymentPayload": "...",           // Cryptographically signed payload
  "amount": "1000000000",            // Amount in lamports (1 SOL)
  "asset": "SOL",                    // Asset identifier (SOL, USDC, or USDT)
  "nonce": "123456"                  // Optional: Prevent replay attacks
}`}
            </code>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Response</CardTitle>
            <CardDescription>Success response (200 OK)</CardDescription>
          </CardHeader>
          <CardContent>
            <code className="block p-4 bg-muted rounded-md font-mono text-sm whitespace-pre">
{`{
  "status": "success",
  "valid": true,
  "id": "tx_abc123",
  "data": {
    "signature": "0x...",
    "signer": "0x...",
    "amount": "1000000000",
    "asset": "SOL",
    "timestamp": 1234567890
  }
}`}
            </code>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Example</CardTitle>
            <CardDescription>JavaScript SDK</CardDescription>
          </CardHeader>
          <CardContent>
            <code className="block p-4 bg-muted rounded-md font-mono text-sm whitespace-pre">
{`import { Rapid402Client } from '@rapid402/sdk';

const client = new Rapid402Client({
  baseUrl: 'https://rapid402.com/api/v1',
  network: 'solana-mainnet'
});

const verification = await client.verify({
  paymentPayload: signedPayload,
  amount: '100000000',
  asset: 'USDC'
});

console.log('Valid:', verification.valid);
console.log('Transaction ID:', verification.id);`}
            </code>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
