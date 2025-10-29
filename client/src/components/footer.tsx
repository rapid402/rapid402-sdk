import { Code2, Github } from "lucide-react";
import { SiX } from "react-icons/si";

export function Footer() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto max-w-7xl px-6 md:px-8">
        <div className="grid gap-8 py-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Code2 className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Rapid402</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              x402 payment facilitator on Solana for developers building the future of commerce.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Protocol</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <button
                  onClick={() => scrollToSection("about")}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="footer-link-about"
                >
                  About Rapid402
                </button>
              </li>
              <li>
                <a
                  href="https://x402.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="footer-link-specification"
                >
                  Specification
                </a>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("capabilities")}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="footer-link-capabilities"
                >
                  Capabilities
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Documentation</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <button
                  onClick={() => scrollToSection("api-reference")}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="footer-link-api-reference"
                >
                  API Reference
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("examples")}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="footer-link-code-examples"
                >
                  Code Examples
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("get-started")}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="footer-link-get-started"
                >
                  Get Started
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Community</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="https://github.com/rapid402"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="footer-link-github"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/rapid402?s=21"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="footer-link-x"
                >
                  <SiX className="h-4 w-4" />
                  X (Twitter)
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-muted-foreground">
              © 2025 x402 Protocol. Open source under MIT License.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a
                href="/status"
                className="hover:text-foreground transition-colors"
                data-testid="footer-link-status"
              >
                Status
              </a>
              <a
                href="/privacy"
                className="hover:text-foreground transition-colors"
                data-testid="footer-link-privacy"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="hover:text-foreground transition-colors"
                data-testid="footer-link-terms"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
