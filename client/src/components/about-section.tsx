import { Card } from "@/components/ui/card";

export function AboutSection() {
  return (
    <section id="about" className="py-20 md:py-24">
      <div className="container mx-auto max-w-7xl px-6 md:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="mb-6 text-3xl font-semibold md:text-4xl">
              About x402
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                The{" "}
                <a
                  href="https://x402.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                  data-testid="link-x402-protocol"
                >
                  x402 payment protocol
                </a>{" "}
                is an HTTP-based payment protocol that enables developers running resource servers to accept payments from users using a variety of payment methods.
              </p>
              <p>
                Servers declare payment requirements for specific routes. Clients send cryptographically signed payment payloads. Facilitators verify and settle payments on-chain.
              </p>
            </div>
          </div>

          <div>
            <h2 className="mb-6 text-3xl font-semibold md:text-4xl">
              Rapid402 Facilitator
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Rapid402 is a multi-chain x402 payment facilitator supporting Solana and BASE that enables AI agents to autonomously search, purchase, and pay for resources.
              </p>
              <p>
                It leverages high-speed, low-cost blockchain infrastructure to bridge intelligent automation and real-world commerce, making payments accessible and affordable for modern applications.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
