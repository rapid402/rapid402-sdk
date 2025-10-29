import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CODE_EXAMPLES } from "@/lib/constants";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

export function CodeExamples() {
  const [activeTab, setActiveTab] = useState<"javascript" | "python" | "curl">("javascript");
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentExample = CODE_EXAMPLES.find((ex) => ex.language === activeTab);

  return (
    <section id="examples" className="py-20 md:py-24 bg-muted/30">
      <div className="container mx-auto max-w-7xl px-6 md:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-semibold md:text-4xl">
            Code Examples
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get started quickly with examples in your preferred language
          </p>
        </div>

        <Card className="overflow-hidden">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle>Integration Example</CardTitle>
              <div className="flex gap-2">
                {CODE_EXAMPLES.map((example) => (
                  <Button
                    key={example.language}
                    variant={activeTab === example.language ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveTab(example.language)}
                    data-testid={`button-tab-${example.language}`}
                  >
                    {example.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4 h-8 w-8"
                onClick={() => currentExample && copyToClipboard(currentExample.code)}
                data-testid="button-copy-code"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              <div className="overflow-x-auto bg-muted/50 p-6">
                <pre className="text-sm leading-relaxed">
                  <code className="font-mono text-foreground">
                    {currentExample?.code}
                  </code>
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
