import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CAPABILITIES } from "@/lib/constants";
import { ShieldCheck, Database, Network, Code2, Terminal, Cpu } from "lucide-react";

const iconMap: Record<string, any> = {
  "shield-check": ShieldCheck,
  database: Database,
  network: Network,
  code: Code2,
  terminal: Terminal,
  cpu: Cpu,
};

export function Capabilities() {
  return (
    <section id="capabilities" className="py-20 md:py-24">
      <div className="container mx-auto max-w-7xl px-6 md:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-semibold md:text-4xl">
            Platform Capabilities
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built for modern developers and autonomous AI agents
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map((capability) => {
            const Icon = iconMap[capability.icon];
            return (
              <Card
                key={capability.title}
                className="hover-elevate"
                data-testid={`card-capability-${capability.title.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <CardHeader>
                  <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{capability.title}</CardTitle>
                  <CardDescription className="leading-relaxed">
                    {capability.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
