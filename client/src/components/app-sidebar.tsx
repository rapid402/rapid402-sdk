import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Home, BookOpen, Code2, Lightbulb, HelpCircle, ChevronDown, Package } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";

const menuItems = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", url: "/", icon: Home },
      { title: "Quick Start", url: "/quick-start", icon: Lightbulb },
    ],
  },
  {
    title: "API Reference",
    items: [
      { title: "Verify Payment", url: "/api/verify", icon: Code2 },
      { title: "Settle Payment", url: "/api/settle", icon: Code2 },
      { title: "Health Check", url: "/api/health", icon: Code2 },
      { title: "Supported Networks", url: "/api/supported", icon: Code2 },
    ],
  },
  {
    title: "SDK",
    items: [
      { title: "Live Demo", url: "/sdk-demo", icon: Package },
    ],
  },
  {
    title: "Examples",
    items: [
      { title: "JavaScript", url: "/examples/javascript", icon: BookOpen },
      { title: "Python", url: "/examples/python", icon: BookOpen },
      { title: "cURL", url: "/examples/curl", icon: BookOpen },
    ],
  },
  {
    title: "Support",
    items: [
      { title: "FAQ", url: "/support/faq", icon: HelpCircle },
      { title: "Community", url: "/support/community", icon: HelpCircle },
    ],
  },
];

export function AppSidebar() {
  const [location] = useLocation();
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(["Getting Started", "API Reference", "SDK", "Examples", "Support"])
  );

  const toggleSection = (title: string) => {
    const newSet = new Set(openSections);
    if (newSet.has(title)) {
      newSet.delete(title);
    } else {
      newSet.add(title);
    }
    setOpenSections(newSet);
  };

  return (
    <Sidebar data-testid="sidebar-main">
      <SidebarContent>
        {menuItems.map((group) => (
          <Collapsible
            key={group.title}
            open={openSections.has(group.title)}
            onOpenChange={() => toggleSection(group.title)}
          >
            <SidebarGroup>
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel
                  className="cursor-pointer flex items-center justify-between hover-elevate"
                  data-testid={`sidebar-section-${group.title.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <span>{group.title}</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      openSections.has(group.title) ? "" : "-rotate-90"
                    }`}
                  />
                </SidebarGroupLabel>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={location === item.url}
                          data-testid={`sidebar-item-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                        >
                          <Link href={item.url}>
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
