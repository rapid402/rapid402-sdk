import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, Twitter, Bot, Book } from "lucide-react";

export default function Community() {
  return (
    <div className="container mx-auto max-w-4xl px-6 md:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Community & Support</h1>
        <p className="text-lg text-muted-foreground">
          Connect with the x402 community and get help
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="hover-elevate">
          <CardHeader>
            <Github className="h-8 w-8 text-primary mb-2" />
            <CardTitle>GitHub</CardTitle>
            <CardDescription>
              View SDK source code, report issues, and contribute
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild className="w-full">
              <a
                href="https://github.com/rapid402/rapid402-sdk"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link-github-community"
              >
                Visit GitHub
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader>
            <Bot className="h-8 w-8 text-primary mb-2" />
            <CardTitle>AI Assistant</CardTitle>
            <CardDescription>
              Get instant help from our AI-powered development assistant
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild className="w-full">
              <a
                href="https://replit.com/@rapid402/rapid402"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link-ai-assistant"
              >
                Chat with AI
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader>
            <Twitter className="h-8 w-8 text-primary mb-2" />
            <CardTitle>X (Twitter)</CardTitle>
            <CardDescription>
              Follow for updates, announcements, and x402 protocol news
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild className="w-full">
              <a
                href="https://x402.org"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link-twitter"
              >
                Visit x402.org
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader>
            <Book className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Protocol Specification</CardTitle>
            <CardDescription>
              Read the complete x402 protocol whitepaper
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild className="w-full">
              <a
                href="https://www.x402.org/x402-whitepaper.pdf"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link-spec"
              >
                Read Whitepaper
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Getting Help</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Before asking for help:</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Check the FAQ section for common questions</li>
              <li>Review the API documentation and examples</li>
              <li>Search existing GitHub issues</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">When reporting issues:</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Include your SDK version and network</li>
              <li>Provide a minimal reproducible example</li>
              <li>Share relevant error messages or logs</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
