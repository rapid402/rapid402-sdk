import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SupportedNetworks() {
  return (
    <div className="container mx-auto max-w-4xl px-6 md:px-8 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="secondary" className="font-mono">GET</Badge>
        </div>
        <h1 className="text-4xl font-bold mb-4">Supported Networks</h1>
        <p className="text-lg text-muted-foreground">
          List all supported networks, payment schemes, and asset types
        </p>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Endpoint</CardTitle>
          </CardHeader>
          <CardContent>
            <code className="text-sm font-mono">GET /v1/supported</code>
            <p className="text-sm text-muted-foreground mt-2">
              List all supported networks, payment schemes, and asset types for the facilitator.
            </p>
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
  "networks": [
    "solana-mainnet",
    "solana-devnet"
  ],
  "paymentSchemes": [
    "exact"
  ],
  "assets": [
    "SPL Token"
  ],
  "capabilities": [
    "verify",
    "settle",
    "batch"
  ]
}`}
            </code>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Support</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Networks</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge>Solana Mainnet</Badge>
                  <Badge>Solana Devnet</Badge>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Payment Schemes</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge>Exact</Badge>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Supported Assets</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge>SPL Token</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
