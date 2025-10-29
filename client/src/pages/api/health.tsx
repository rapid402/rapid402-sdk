import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HealthCheck() {
  return (
    <div className="container mx-auto max-w-4xl px-6 md:px-8 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="secondary" className="font-mono">GET</Badge>
        </div>
        <h1 className="text-4xl font-bold mb-4">Health Check</h1>
        <p className="text-lg text-muted-foreground">
          Monitor facilitator service health and system metrics
        </p>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Endpoint</CardTitle>
          </CardHeader>
          <CardContent>
            <code className="text-sm font-mono">GET /v1/health</code>
            <p className="text-sm text-muted-foreground mt-2">
              Check the health status of the facilitator service. Returns uptime and system metrics.
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
  "status": "healthy",
  "uptime": 123456,
  "version": "1.0.0",
  "network": "solana-mainnet",
  "blockHeight": 123456789
}`}
            </code>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Example</CardTitle>
            <CardDescription>cURL request</CardDescription>
          </CardHeader>
          <CardContent>
            <code className="block p-4 bg-muted rounded-md font-mono text-sm whitespace-pre">
{`curl https://rapid402.com/api/v1/health`}
            </code>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
