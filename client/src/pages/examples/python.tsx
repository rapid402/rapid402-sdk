import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PythonExample() {
  return (
    <div className="container mx-auto max-w-4xl px-6 md:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Python Integration</h1>
        <p className="text-lg text-muted-foreground">
          Complete example using the x402 Python client
        </p>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Full Example</CardTitle>
          </CardHeader>
          <CardContent>
            <code className="block p-4 bg-muted rounded-md font-mono text-sm whitespace-pre">
{`from rapid402 import Rapid402Client

# Initialize the client
client = Rapid402Client(
    base_url='https://rapid402.com/api/v1',
    network='solana-mainnet'
)

# Verify a payment
verification = client.verify(
    payment_payload=signed_payload,
    amount='1000000000',  # 1 SOL
    asset='SOL'
)

# Settle the payment
if verification['valid']:
    settlement = client.settle(
        transaction_id=verification['id']
    )
    print('Payment settled:', settlement)`}
            </code>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Installation</CardTitle>
          </CardHeader>
          <CardContent>
            <code className="block p-4 bg-muted rounded-md font-mono text-sm">
              pip install rapid402
            </code>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
