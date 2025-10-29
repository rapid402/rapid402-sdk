import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, Twitter, MessageCircle, Book } from "lucide-react";

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
              View source code, report issues, and contribute to the project
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild className="w-full">
              <a
                href="https://github.com/x402"
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
            <MessageCircle className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Discord</CardTitle>
            <CardDescription>
              Join our Discord server for real-time chat and support
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild className="w-full">
              <a
                href="https://discord.gg/x402"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link-discord"
              >
                Join Discord
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader>
            <Twitter className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Twitter</CardTitle>
            <CardDescription>
              Follow us for updates, announcements, and protocol news
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild className="w-full">
              <a
                href="https://twitter.com/x402protocol"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link-twitter"
              >
                Follow on Twitter
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader>
            <Book className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Protocol Specification</CardTitle>
            <CardDescription>
              Read the full x402 protocol specification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild className="w-full">
              <a
                href="https://x402.org/"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link-spec"
              >
                Read Spec
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
