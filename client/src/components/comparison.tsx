import { Card } from "@/components/ui/card";
import { Check, X } from "lucide-react";

interface ComparisonFeature {
  feature: string;
  rapid402: boolean | string;
  payai: boolean | string;
}

const features: ComparisonFeature[] = [
  {
    feature: "x402 Protocol Native",
    rapid402: true,
    payai: false,
  },
  {
    feature: "Open Source",
    rapid402: true,
    payai: false,
  },
  {
    feature: "Self-Hosted Option",
    rapid402: true,
    payai: false,
  },
  {
    feature: "Solana Integration",
    rapid402: "Native & Optimized",
    payai: "Limited",
  },
  {
    feature: "Transaction Fees",
    rapid402: "Network fees only",
    payai: "Platform fees + network",
  },
  {
    feature: "Setup Time",
    rapid402: "< 5 minutes",
    payai: "Account approval required",
  },
  {
    feature: "Ed25519 Signature Verification",
    rapid402: true,
    payai: false,
  },
  {
    feature: "SPL Token Support",
    rapid402: true,
    payai: "Limited",
  },
  {
    feature: "API Response Time",
    rapid402: "< 100ms",
    payai: "Variable",
  },
  {
    feature: "Vendor Lock-in",
    rapid402: false,
    payai: true,
  },
  {
    feature: "Custom Integration",
    rapid402: "Full control",
    payai: "Limited",
  },
  {
    feature: "Data Privacy",
    rapid402: "Complete control",
    payai: "Shared with platform",
  },
];

export function Comparison() {
  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto max-w-7xl px-6 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Rapid402
            </span>
            ?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A true x402 implementation that gives you full control over your payment infrastructure
          </p>
        </div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-4 px-6 font-semibold text-foreground">
                    Feature
                  </th>
                  <th className="text-center py-4 px-6 font-semibold text-primary">
                    Rapid402
                  </th>
                  <th className="text-center py-4 px-6 font-semibold text-muted-foreground">
                    PayAI
                  </th>
                </tr>
              </thead>
              <tbody>
                {features.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b last:border-b-0 hover-elevate"
                    data-testid={`comparison-row-${index}`}
                  >
                    <td className="py-4 px-6 font-medium text-foreground">
                      {item.feature}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {typeof item.rapid402 === 'boolean' ? (
                        item.rapid402 ? (
                          <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500/10">
                            <Check className="h-4 w-4 text-green-500" data-testid="icon-check-rapid402" />
                          </div>
                        ) : (
                          <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-muted">
                            <X className="h-4 w-4 text-muted-foreground" data-testid="icon-x-rapid402" />
                          </div>
                        )
                      ) : (
                        <span className="text-sm font-medium text-foreground">
                          {item.rapid402}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {typeof item.payai === 'boolean' ? (
                        item.payai ? (
                          <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500/10">
                            <Check className="h-4 w-4 text-green-500" data-testid="icon-check-payai" />
                          </div>
                        ) : (
                          <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-muted">
                            <X className="h-4 w-4 text-muted-foreground" data-testid="icon-x-payai" />
                          </div>
                        )
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          {item.payai}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Rapid402 is built on the x402 protocol standard, ensuring true decentralization and developer freedom
          </p>
        </div>
      </div>
    </section>
  );
}
