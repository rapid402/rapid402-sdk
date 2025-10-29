import { Card } from "@/components/ui/card";
import { Check, X, Shield, Zap, Lock, Code } from "lucide-react";

interface ComparisonFeature {
  feature: string;
  rapid402: boolean | string;
  payai: boolean | string;
  explanation?: string;
}

interface FeatureCategory {
  title: string;
  description: string;
  icon: typeof Shield;
  features: ComparisonFeature[];
}

const categories: FeatureCategory[] = [
  {
    title: "Protocol Authenticity",
    description: "True x402 implementation vs proprietary wrapper",
    icon: Shield,
    features: [
      {
        feature: "x402 Protocol Native",
        rapid402: true,
        payai: false,
        explanation: "Built from the ground up following x402 spec, not a proprietary API disguised as x402",
      },
      {
        feature: "Ed25519 Signature Verification",
        rapid402: true,
        payai: false,
        explanation: "Cryptographically secure payment verification using x402 standard signatures",
      },
      {
        feature: "Open Source",
        rapid402: true,
        payai: false,
        explanation: "Full transparency - audit the code, contribute improvements, or fork for custom needs",
      },
    ],
  },
  {
    title: "Operational Control",
    description: "Own your infrastructure vs platform dependency",
    icon: Lock,
    features: [
      {
        feature: "Self-Hosted Option",
        rapid402: true,
        payai: false,
        explanation: "Deploy on your own infrastructure for complete control and privacy",
      },
      {
        feature: "Vendor Lock-in",
        rapid402: false,
        payai: true,
        explanation: "No proprietary APIs - switch facilitators anytime without code changes",
      },
      {
        feature: "Data Privacy",
        rapid402: "Complete control",
        payai: "Shared with platform",
        explanation: "Your payment data stays on your servers, never shared with third parties",
      },
      {
        feature: "Custom Integration",
        rapid402: "Full control",
        payai: "Limited",
        explanation: "Customize settlement logic, add business rules, integrate with any system",
      },
    ],
  },
  {
    title: "Performance & Reliability",
    description: "Optimized for speed and Solana's architecture",
    icon: Zap,
    features: [
      {
        feature: "API Response Time",
        rapid402: "< 100ms",
        payai: "Variable",
        explanation: "Optimized direct Solana integration ensures consistently fast verification",
      },
      {
        feature: "Solana Integration",
        rapid402: "Native & Optimized",
        payai: "Limited",
        explanation: "Built specifically for Solana - supports mainnet, devnet, and all SPL tokens",
      },
      {
        feature: "SPL Token Support",
        rapid402: true,
        payai: "Limited",
        explanation: "Accept any SPL token (USDC, USDT, etc.) with native token account handling",
      },
    ],
  },
  {
    title: "Cost & Developer Experience",
    description: "Lower costs and faster time to market",
    icon: Code,
    features: [
      {
        feature: "Transaction Fees",
        rapid402: "Network fees only",
        payai: "Platform fees + network",
        explanation: "No platform fees, no revenue sharing - you keep 100% of your payments",
      },
      {
        feature: "Setup Time",
        rapid402: "< 5 minutes",
        payai: "Account approval required",
        explanation: "npm install and go - no waiting for account approval or KYC",
      },
      {
        feature: "TypeScript SDK",
        rapid402: "Full-featured",
        payai: "Basic",
        explanation: "Complete SDK with client wallet integration and server verification helpers",
      },
    ],
  },
];

export function Comparison() {
  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto max-w-7xl px-6 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Why{" "}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Rapid402
            </span>{" "}
            Beats PayAI
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A true x402 implementation that gives you full control over your payment infrastructure
          </p>
        </div>

        <div className="grid gap-8 mb-8">
          {categories.map((category, categoryIndex) => {
            const Icon = category.icon;
            return (
              <Card key={categoryIndex} className="overflow-hidden" data-testid={`category-${categoryIndex}`}>
                <div className="border-b bg-muted/50 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{category.title}</h3>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/30">
                        <th className="text-left py-3 px-6 font-medium text-sm text-muted-foreground">
                          Feature
                        </th>
                        <th className="text-center py-3 px-6 font-medium text-sm text-primary">
                          Rapid402
                        </th>
                        <th className="text-center py-3 px-6 font-medium text-sm text-muted-foreground">
                          PayAI
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.features.map((item, index) => (
                        <tr
                          key={index}
                          className="border-b last:border-b-0"
                          data-testid={`comparison-row-${categoryIndex}-${index}`}
                        >
                          <td className="py-4 px-6">
                            <div className="font-medium text-foreground mb-1">{item.feature}</div>
                            {item.explanation && (
                              <div className="text-xs text-muted-foreground">{item.explanation}</div>
                            )}
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
                                <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-destructive/10">
                                  <X className="h-4 w-4 text-destructive" data-testid="icon-x-payai" />
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
            );
          })}
        </div>

        <div className="text-center space-y-4">
          <Card className="inline-block px-8 py-6 max-w-2xl">
            <h3 className="text-xl font-semibold mb-2 text-foreground">The Bottom Line</h3>
            <p className="text-muted-foreground">
              PayAI wraps proprietary APIs in x402-like syntax. Rapid402 <span className="font-semibold text-foreground">IS</span> x402 - 
              built on the protocol standard with full transparency, zero lock-in, and complete developer control.
            </p>
          </Card>
          <p className="text-sm text-muted-foreground">
            Switch to Rapid402 and own your payment infrastructure
          </p>
        </div>
      </div>
    </section>
  );
}
