import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, BookOpen } from "lucide-react";
import { Link } from "wouter";

export function Hero() {
  return (
    <section className="relative overflow-hidden min-h-[600px] flex items-center py-20 md:py-32">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(to bottom right, hsl(var(--primary) / 0.1), hsl(var(--primary) / 0.05)),
            repeating-linear-gradient(45deg, transparent, transparent 35px, hsl(var(--border) / 0.3) 35px, hsl(var(--border) / 0.3) 36px)
          `,
        }}
      />
      
      <div className="container mx-auto max-w-7xl px-6 md:px-8 relative z-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col justify-center">
            <div className="mb-4 inline-flex">
              <span className="rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary border border-primary/20">
                x402 Payment Protocol
              </span>
            </div>
            <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl">
              Accept Payments
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Via x402
              </span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground max-w-lg leading-relaxed">
              Rapid402 enables developers to build resource servers that accept payments using the x402 protocol with cryptographically signed payloads. Simple, secure, and efficient.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                asChild
                data-testid="button-view-docs"
              >
                <Link href="/api/verify">
                  View Documentation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                data-testid="button-examples"
              >
                <Link href="/examples/javascript">
                  <BookOpen className="mr-2 h-4 w-4" />
                  See Examples
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg blur-xl"></div>
            <Card className="relative overflow-hidden bg-card shadow-lg">
              <div className="border-b bg-muted/50 px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-destructive/80"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500/80"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500/80"></div>
                  </div>
                  <span className="ml-2 text-xs font-medium text-muted-foreground font-mono">
                    api-request.js
                  </span>
                </div>
              </div>
              <div className="p-6 bg-gradient-to-br from-muted/30 to-muted/10">
                <pre className="text-sm leading-relaxed">
                  <code className="font-mono">
                    <span className="text-purple-500">const</span>{" "}
                    <span className="text-foreground">response</span>{" "}
                    <span className="text-primary">=</span>{" "}
                    <span className="text-purple-500">await</span>{" "}
                    <span className="text-yellow-500">fetch</span>
                    <span className="text-muted-foreground">(</span>
                    {"\n  "}
                    <span className="text-green-600">'https://rapid402.com/api/v1/verify'</span>
                    <span className="text-muted-foreground">,</span>
                    {"\n  "}
                    <span className="text-muted-foreground">{"{"}</span>
                    {"\n    "}
                    <span className="text-foreground">method</span>
                    <span className="text-primary">:</span>{" "}
                    <span className="text-green-600">'POST'</span>
                    <span className="text-muted-foreground">,</span>
                    {"\n    "}
                    <span className="text-foreground">headers</span>
                    <span className="text-primary">:</span>{" "}
                    <span className="text-muted-foreground">{"{"}</span>
                    {"\n      "}
                    <span className="text-green-600">'Content-Type'</span>
                    <span className="text-primary">:</span>{" "}
                    <span className="text-green-600">'application/json'</span>
                    {"\n    "}
                    <span className="text-muted-foreground">{"},"}</span>
                    {"\n    "}
                    <span className="text-foreground">body</span>
                    <span className="text-primary">:</span>{" "}
                    <span className="text-yellow-500">JSON</span>
                    <span className="text-muted-foreground">.</span>
                    <span className="text-yellow-500">stringify</span>
                    <span className="text-muted-foreground">({"{"}</span>
                    {"\n      "}
                    <span className="text-foreground">paymentPayload</span>
                    <span className="text-primary">:</span>{" "}
                    <span className="text-green-600">'0x...'</span>
                    <span className="text-muted-foreground">,</span>
                    {"\n      "}
                    <span className="text-foreground">amount</span>
                    <span className="text-primary">:</span>{" "}
                    <span className="text-green-600">'100000000'</span>
                    {"\n    "}
                    <span className="text-muted-foreground">{"})"})</span>
                    {"\n  "}
                    <span className="text-muted-foreground">{"}"}</span>
                    {"\n"}
                    <span className="text-muted-foreground">);</span>
                  </code>
                </pre>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
