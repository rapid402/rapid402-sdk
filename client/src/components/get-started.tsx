import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Github, BookOpen } from "lucide-react";
import { Link } from "wouter";

export function GetStarted() {
  return (
    <section id="get-started" className="py-20 md:py-24 bg-muted/30">
      <div className="container mx-auto max-w-7xl px-6 md:px-8">
        <Card className="overflow-hidden border-primary/20">
          <div className="p-12 text-center">
            <h2 className="mb-4 text-3xl font-semibold md:text-4xl">
              Ready to Get Started?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground max-w-2xl mx-auto">
              Start accepting payments with the x402 protocol today. Explore our documentation and integrate in minutes.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                size="lg"
                asChild
                data-testid="button-view-documentation"
              >
                <Link href="/api/verify">
                  <BookOpen className="mr-2 h-4 w-4" />
                  View Documentation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                data-testid="button-github-repo"
              >
                <a
                  href="https://github.com/x402"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="mr-2 h-4 w-4" />
                  GitHub Repository
                </a>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
