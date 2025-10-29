import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CurlExample() {
  return (
    <div className="container mx-auto max-w-4xl px-6 md:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">cURL Integration</h1>
        <p className="text-lg text-muted-foreground">
          Direct HTTP requests using cURL
        </p>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Verify Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <code className="block p-4 bg-muted rounded-md font-mono text-sm whitespace-pre">
{`# Verify a payment
curl -X POST https://rapid402.com/api/v1/verify \\
  -H "Content-Type: application/json" \\
  -d '{
    "paymentPayload": "...",
    "amount": "1000000000",
    "asset": "SOL"
  }'`}
            </code>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Settle Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <code className="block p-4 bg-muted rounded-md font-mono text-sm whitespace-pre">
{`# Settle the payment
curl -X POST https://rapid402.com/api/v1/settle \\
  -H "Content-Type: application/json" \\
  -d '{
    "transactionId": "tx_abc123"
  }'`}
            </code>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Check Health</CardTitle>
          </CardHeader>
          <CardContent>
            <code className="block p-4 bg-muted rounded-md font-mono text-sm">
              curl https://rapid402.com/api/v1/health
            </code>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>List Supported Networks</CardTitle>
          </CardHeader>
          <CardContent>
            <code className="block p-4 bg-muted rounded-md font-mono text-sm">
              curl https://rapid402.com/api/v1/supported
            </code>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
