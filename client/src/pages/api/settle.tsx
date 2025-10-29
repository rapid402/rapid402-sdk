import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SettlePayment() {
  return (
    <div className="container mx-auto max-w-4xl px-6 md:px-8 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="default" className="font-mono">POST</Badge>
          <Badge variant="secondary" className="font-mono">GET</Badge>
        </div>
        <h1 className="text-4xl font-bold mb-4">Settle Payment</h1>
        <p className="text-lg text-muted-foreground">
          Finalize verified payments on-chain with Solana
        </p>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Endpoints</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <code className="text-sm font-mono">POST /v1/settle</code>
              <p className="text-sm text-muted-foreground mt-2">
                Settle a verified payment on-chain. Finalizes the transaction and updates balances.
              </p>
            </div>
            <div className="border-t pt-4">
              <code className="text-sm font-mono">GET /v1/settle</code>
              <p className="text-sm text-muted-foreground mt-2">
                Retrieve settlement status for a specific payment transaction.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Request Body</CardTitle>
            <CardDescription>POST /v1/settle</CardDescription>
          </CardHeader>
          <CardContent>
            <code className="block p-4 bg-muted rounded-md font-mono text-sm whitespace-pre">
{`{
  "transactionId": "tx_abc123" // ID from verification response
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
  "settled": true,
  "txHash": "0x...",
  "blockNumber": 123456,
  "gasUsed": "21000"
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
{`const settlement = await client.settle({
  transactionId: verification.id
});

console.log('Settled:', settlement.settled);
console.log('TX Hash:', settlement.txHash);`}
            </code>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
