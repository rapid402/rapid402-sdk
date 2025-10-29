import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { API_METHODS } from "@/lib/constants";
import { Copy, Check, ChevronDown } from "lucide-react";
import { useState } from "react";

export function ApiMethods() {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const copyToClipboard = (text: string) => {
    const baseUrl = 'https://rapid402.com/api/v1';
    navigator.clipboard.writeText(`${baseUrl}${text}`);
    setCopiedEndpoint(text);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const getMethodVariant = (method: string) => {
    return method === "GET" ? "secondary" : "default";
  };

  const toggleExpanded = (key: string) => {
    const newSet = new Set(expandedCards);
    if (newSet.has(key)) {
      newSet.delete(key);
    } else {
      newSet.add(key);
    }
    setExpandedCards(newSet);
  };

  return (
    <section id="api-reference" className="py-20 md:py-24">
      <div className="container mx-auto max-w-7xl px-6 md:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-semibold md:text-4xl">
            API Reference
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive API endpoints for payment verification and settlement
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {API_METHODS.map((method) => {
            const key = `${method.method}-${method.endpoint}`;
            const isExpanded = expandedCards.has(key);
            
            return (
              <Collapsible
                key={key}
                open={isExpanded}
                onOpenChange={() => toggleExpanded(key)}
              >
                <Card
                  className="hover-elevate"
                  data-testid={`card-api-${method.category}-${method.method.toLowerCase()}`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge
                            variant={getMethodVariant(method.method)}
                            className="font-mono text-xs"
                          >
                            {method.method}
                          </Badge>
                          <code className="text-sm font-mono text-muted-foreground">
                            {method.endpoint}
                          </code>
                        </div>
                        <CardTitle className="text-lg capitalize">
                          {method.category} Payment
                        </CardTitle>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(method.endpoint);
                          }}
                          data-testid={`button-copy-${method.category}-${method.method.toLowerCase()}`}
                        >
                          {copiedEndpoint === method.endpoint ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            data-testid={`button-expand-${method.category}-${method.method.toLowerCase()}`}
                          >
                            <ChevronDown
                              className={`h-4 w-4 transition-transform ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                    </div>
                    <CardDescription className="leading-relaxed">
                      {method.description}
                    </CardDescription>
                  </CardHeader>
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <div className="space-y-4 text-sm">
                        <div>
                          <h4 className="font-semibold mb-2">Request</h4>
                          <code className="block p-3 rounded-md bg-muted text-xs font-mono">
                            {method.method} https://rapid402.com/api/v1{method.endpoint}
                          </code>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Response</h4>
                          <code className="block p-3 rounded-md bg-muted text-xs font-mono whitespace-pre">
                            {`{
  "status": "success",
  "data": { ... }
}`}
                          </code>
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            );
          })}
        </div>
      </div>
    </section>
  );
}
