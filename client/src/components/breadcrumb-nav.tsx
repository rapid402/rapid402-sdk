import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useLocation } from "wouter";

const pathMap: Record<string, { label: string; parent?: string }> = {
  "/": { label: "Home" },
  "/quick-start": { label: "Quick Start", parent: "/" },
  "/api/verify": { label: "Verify Payment", parent: "/" },
  "/api/settle": { label: "Settle Payment", parent: "/" },
  "/api/health": { label: "Health Check", parent: "/" },
  "/api/supported": { label: "Supported Networks", parent: "/" },
  "/examples/javascript": { label: "JavaScript", parent: "/" },
  "/examples/python": { label: "Python", parent: "/" },
  "/examples/curl": { label: "cURL", parent: "/" },
  "/support/faq": { label: "FAQ", parent: "/" },
  "/support/community": { label: "Community", parent: "/" },
};

export function BreadcrumbNav() {
  const [location] = useLocation();
  const current = pathMap[location];

  if (!current) return null;

  const breadcrumbs: Array<{ label: string; url: string }> = [];

  if (current.parent) {
    breadcrumbs.push({ label: "Home", url: "/" });
  }

  return (
    <div className="border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto max-w-7xl px-6 md:px-8 py-3">
        <Breadcrumb data-testid="breadcrumb-nav">
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
              <span key={crumb.url} className="contents">
                <BreadcrumbItem>
                  <BreadcrumbLink href={crumb.url}>{crumb.label}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </span>
            ))}
            <BreadcrumbItem>
              <BreadcrumbPage>{current.label}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
}
