import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SPECIFICATIONS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

export function SpecificationsTable() {
  const [copiedCategory, setCopiedCategory] = useState<string | null>(null);

  const copyToClipboard = (text: string, category: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCategory(category);
    setTimeout(() => setCopiedCategory(null), 2000);
  };

  return (
    <section className="py-20 md:py-24 bg-muted/30">
      <div className="container mx-auto max-w-7xl px-6 md:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-semibold md:text-4xl">
            Technical Specifications
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Complete details about the x402 facilitator implementation
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Facilitator Configuration</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {SPECIFICATIONS.map((spec, index) => (
                    <tr
                      key={spec.category}
                      className={`border-b last:border-0 ${
                        index % 2 === 0 ? "bg-background" : "bg-muted/20"
                      }`}
                      data-testid={`row-spec-${spec.category.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      <td className="px-6 py-4 text-sm font-medium">
                        {spec.category}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-between gap-4">
                          <code className="text-sm font-mono text-muted-foreground">
                            {spec.details}
                          </code>
                          {spec.category === "Base URL" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 shrink-0"
                              onClick={() => copyToClipboard(spec.details, spec.category)}
                              data-testid="button-copy-base-url"
                            >
                              {copiedCategory === spec.category ? (
                                <Check className="h-4 w-4 text-green-600" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
