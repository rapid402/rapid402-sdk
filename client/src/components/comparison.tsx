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
    title: "Deployment Model",
    description: "Self-hosted infrastructure vs managed service",
    icon: Shield,
    features: [
      {
        feature: "Open Source",
        rapid402: true,
        payai: false,
        explanation: "Full code transparency - audit, modify, and contribute to the codebase",
      },
      {
        feature: "Self-Hosted Option",
        rapid402: true,
        payai: false,
        explanation: "Deploy on your own infrastructure for complete control and privacy",
      },
      {
        feature: "Infrastructure Control",
        rapid402: "Full ownership",
        payai: "Managed service",
        explanation: "Run your own facilitator vs relying on third-party hosted infrastructure",
      },
    ],
  },
  {
    title: "Data & Privacy",
    description: "Who owns and controls your payment data",
    icon: Lock,
    features: [
      {
        feature: "Data Privacy",
        rapid402: "Complete control",
        payai: "Shared with platform",
        explanation: "Your payment data stays on your servers, you control access and retention",
      },
      {
        feature: "Vendor Lock-in",
        rapid402: false,
        payai: true,
        explanation: "Own the code and infrastructure - migrate or customize without restrictions",
      },
      {
        feature: "Compliance Control",
        rapid402: "Self-managed",
        payai: "Platform-managed",
        explanation: "Implement your own compliance rules and data handling policies",
      },
    ],
  },
  {
    title: "Customization & Integration",
    description: "Flexibility to build exactly what you need",
    icon: Code,
    features: [
      {
        feature: "Custom Settlement Logic",
        rapid402: "Full control",
        payai: "Standard only",
        explanation: "Customize payment flows, add business rules, implement custom settlement patterns",
      },
      {
        feature: "Database Integration",
        rapid402: "Direct access",
        payai: "API only",
        explanation: "Direct database access for custom reporting, analytics, and integrations",
      },
      {
        feature: "Source Code Access",
        rapid402: true,
        payai: false,
        explanation: "Modify the facilitator to fit your exact requirements",
      },
    ],
  },
  {
    title: "Cost Structure",
    description: "Transparent costs vs potential future pricing changes",
    icon: Zap,
    features: [
      {
        feature: "Platform Fees",
        rapid402: "None (self-hosted)",
        payai: "None (currently)",
        explanation: "Self-hosting eliminates platform fees entirely vs potential future pricing models",
      },
      {
        feature: "Cost Predictability",
        rapid402: "Network fees only",
        payai: "Subject to change",
        explanation: "Control your own costs vs dependency on third-party pricing decisions",
      },
      {
        feature: "Infrastructure Costs",
        rapid402: "Your hosting",
        payai: "Included",
        explanation: "You pay your own infrastructure costs vs relying on free tier sustainability",
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
              Both are legitimate x402 facilitators. PayAI offers managed hosting (like Stripe). 
              Rapid402 gives you <span className="font-semibold text-foreground">complete ownership</span> - 
              self-host the open-source code, control your data, and customize everything.
            </p>
          </Card>
          <p className="text-sm text-muted-foreground">
            Choose Rapid402 when you need full control over your payment infrastructure
          </p>
        </div>
      </div>
    </section>
  );
}
