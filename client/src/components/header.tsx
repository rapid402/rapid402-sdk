import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Link } from "wouter";
import logoImage from "@assets/rapid402-logo-transparent.png";
import { SiX } from "react-icons/si";
import { Github } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6 md:px-8">
        <div className="flex items-center gap-4">
          <SidebarTrigger data-testid="button-sidebar-toggle" />
          <Link href="/">
            <img 
              src={logoImage} 
              alt="Rapid402" 
              className="h-24 cursor-pointer"
              data-testid="logo-image"
            />
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            asChild
            data-testid="button-status"
          >
            <Link href="/status">Status</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            asChild
            data-testid="button-github"
          >
            <a
              href="https://github.com/rapid402"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit our GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            asChild
            data-testid="button-x-twitter"
          >
            <a
              href="https://x.com/rapid402?s=21"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on X"
            >
              <SiX className="h-4 w-4" />
            </a>
          </Button>
          <Button
            size="sm"
            asChild
            data-testid="button-get-started"
          >
            <Link href="/quick-start">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
