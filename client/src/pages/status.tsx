import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, XCircle, Clock, Activity } from "lucide-react";
import type { HealthResponse } from "@shared/schema";

export default function StatusPage() {
  const { data: health, isLoading, error } = useQuery<HealthResponse>({
    queryKey: ['/api/v1/health'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const isHealthy = health?.status === 'healthy';
  const uptimeHours = health?.uptime ? Math.floor(health.uptime / 3600) : 0;
  const uptimeDays = Math.floor(uptimeHours / 24);

  return (
    <div className="container mx-auto max-w-4xl px-6 md:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">System Status</h1>
        <p className="text-lg text-muted-foreground">
          Real-time status of Rapid402 facilitator services
        </p>
      </div>

      <div className="space-y-6">
        {/* Overall Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isLoading ? (
                <Clock className="h-5 w-5 animate-spin text-muted-foreground" />
              ) : isHealthy ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              Overall Status
            </CardTitle>
            <CardDescription>
              Current operational status of all services
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Badge variant="secondary" data-testid="status-loading">
                Checking...
              </Badge>
            ) : error ? (
              <Badge variant="destructive" data-testid="status-error">
                Error - Unable to connect
              </Badge>
            ) : isHealthy ? (
              <Badge className="bg-green-500 hover:bg-green-600" data-testid="status-operational">
                All Systems Operational
              </Badge>
            ) : (
              <Badge variant="destructive" data-testid="status-degraded">
                Degraded Performance
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* Service Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Service Components
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium">API Endpoints</p>
                  <p className="text-sm text-muted-foreground">Payment verification and settlement</p>
                </div>
                {isHealthy ? (
                  <Badge className="bg-green-500 hover:bg-green-600" data-testid="service-api">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Operational
                  </Badge>
                ) : (
                  <Badge variant="secondary">Unknown</Badge>
                )}
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium">Solana Blockchain</p>
                  <p className="text-sm text-muted-foreground">On-chain settlement network</p>
                </div>
                {health?.blockHeight ? (
                  <Badge className="bg-green-500 hover:bg-green-600" data-testid="service-blockchain">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Block {health.blockHeight.toLocaleString()}
                  </Badge>
                ) : (
                  <Badge variant="secondary">Unknown</Badge>
                )}
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium">Signature Verification</p>
                  <p className="text-sm text-muted-foreground">Ed25519 cryptographic validation</p>
                </div>
                {isHealthy ? (
                  <Badge className="bg-green-500 hover:bg-green-600" data-testid="service-verification">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Operational
                  </Badge>
                ) : (
                  <Badge variant="secondary">Unknown</Badge>
                )}
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">Documentation Website</p>
                  <p className="text-sm text-muted-foreground">API docs and SDK resources</p>
                </div>
                <Badge className="bg-green-500 hover:bg-green-600" data-testid="service-docs">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Operational
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Uptime Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Uptime Statistics</CardTitle>
            <CardDescription>
              Current session uptime for facilitator API
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 border rounded-md">
                <p className="text-sm text-muted-foreground mb-1">Current Uptime</p>
                <p className="text-2xl font-bold" data-testid="uptime-current">
                  {isLoading ? '...' : uptimeDays > 0 ? `${uptimeDays}d ${uptimeHours % 24}h` : `${uptimeHours}h`}
                </p>
              </div>
              <div className="p-4 border rounded-md">
                <p className="text-sm text-muted-foreground mb-1">API Version</p>
                <p className="text-2xl font-bold" data-testid="api-version">
                  {health?.version || 'v1'}
                </p>
              </div>
              <div className="p-4 border rounded-md">
                <p className="text-sm text-muted-foreground mb-1">Network</p>
                <p className="text-2xl font-bold" data-testid="network-status">
                  {health?.network || 'Solana'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Network Information */}
        <Card>
          <CardHeader>
            <CardTitle>Supported Networks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <p className="font-medium">Solana Mainnet</p>
                  <p className="text-sm text-muted-foreground">Chain ID: 101</p>
                </div>
                <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <p className="font-medium">Solana Devnet</p>
                  <p className="text-sm text-muted-foreground">Chain ID: 102</p>
                </div>
                <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Incident History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Incidents</CardTitle>
            <CardDescription>
              No incidents reported in the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
              <p className="text-sm">All systems running smoothly</p>
            </div>
          </CardContent>
        </Card>

        {/* Subscribe to Updates */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Stay Updated</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>Get notified about system status changes and scheduled maintenance:</p>
            <ul className="space-y-1 ml-4">
              <li>• Follow us on <a href="https://x.com/rapid402?s=21" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">X/Twitter @rapid402</a></li>
              <li>• Watch our <a href="https://github.com/rapid402" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">GitHub repository</a></li>
              <li>• Join our <a href="/support/community" className="text-primary hover:underline">Community</a></li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
