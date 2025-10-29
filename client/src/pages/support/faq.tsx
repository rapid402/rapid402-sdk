import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  return (
    <div className="container mx-auto max-w-4xl px-6 md:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-lg text-muted-foreground">
          Common questions about the x402 payment protocol
        </p>
      </div>

      <Accordion type="single" collapsible className="space-y-4">
        <AccordionItem value="item-1">
          <Card>
            <CardHeader>
              <AccordionTrigger className="hover:no-underline">
                <CardTitle className="text-lg text-left">
                  What is the x402 payment protocol?
                </CardTitle>
              </AccordionTrigger>
            </CardHeader>
            <AccordionContent>
              <CardContent>
                <p className="text-muted-foreground">
                  The x402 payment protocol is an HTTP-based payment protocol that enables developers running resource servers to accept payments from users using a variety of payment methods. It uses cryptographically signed payloads for secure payment verification and settlement on-chain.
                </p>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>

        <AccordionItem value="item-2">
          <Card>
            <CardHeader>
              <AccordionTrigger className="hover:no-underline">
                <CardTitle className="text-lg text-left">
                  Which networks are supported?
                </CardTitle>
              </AccordionTrigger>
            </CardHeader>
            <AccordionContent>
              <CardContent>
                <p className="text-muted-foreground">
                  The Rapid402 facilitator currently supports Solana mainnet and devnet. The architecture is extensible to support additional networks in the future.
                </p>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>

        <AccordionItem value="item-3">
          <Card>
            <CardHeader>
              <AccordionTrigger className="hover:no-underline">
                <CardTitle className="text-lg text-left">
                  What payment schemes are supported?
                </CardTitle>
              </AccordionTrigger>
            </CardHeader>
            <AccordionContent>
              <CardContent>
                <p className="text-muted-foreground">
                  Currently, the "exact" payment scheme is supported, which requires the exact payment amount specified in the request. Additional schemes may be added in future releases.
                </p>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>

        <AccordionItem value="item-4">
          <Card>
            <CardHeader>
              <AccordionTrigger className="hover:no-underline">
                <CardTitle className="text-lg text-left">
                  How do I get started with the SDK?
                </CardTitle>
              </AccordionTrigger>
            </CardHeader>
            <AccordionContent>
              <CardContent>
                <p className="text-muted-foreground">
                  Install the SDK via npm (npm install @rapid402/sdk), initialize the client with your facilitator endpoint, and start verifying and settling payments. Check out our Quick Start guide for a complete walkthrough.
                </p>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>

        <AccordionItem value="item-5">
          <Card>
            <CardHeader>
              <AccordionTrigger className="hover:no-underline">
                <CardTitle className="text-lg text-left">
                  Is there a testnet available?
                </CardTitle>
              </AccordionTrigger>
            </CardHeader>
            <AccordionContent>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! Solana devnet is fully supported. Use network: 'solana-devnet' when initializing the client to test your integration without real funds.
                </p>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
