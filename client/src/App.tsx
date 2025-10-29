import type { CSSProperties } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { ChatWidget } from "@/components/chat-widget";
import Home from "@/pages/home";
import QuickStart from "@/pages/quick-start";
import ComparisonPage from "@/pages/comparison";
import VerifyPayment from "@/pages/api/verify";
import SettlePayment from "@/pages/api/settle";
import HealthCheck from "@/pages/api/health";
import SupportedNetworks from "@/pages/api/supported";
import JavaScriptExample from "@/pages/examples/javascript";
import PythonExample from "@/pages/examples/python";
import CurlExample from "@/pages/examples/curl";
import SolanaSdkPage from "@/pages/sdk-solana";
import BaseSdkPage from "@/pages/sdk-base";
import BnbSdkPage from "@/pages/sdk-bnb";
import QRGeneratorPage from "@/pages/qr-generator";
import PayPage from "@/pages/pay";
import AIAssistant from "@/pages/ai-assistant";
import Whitepaper from "@/pages/whitepaper";
import FAQ from "@/pages/support/faq";
import Community from "@/pages/support/community";
import PrivacyPolicy from "@/pages/privacy";
import TermsOfService from "@/pages/terms";
import StatusPage from "@/pages/status";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/quick-start" component={QuickStart} />
      <Route path="/comparison" component={ComparisonPage} />
      <Route path="/api/verify" component={VerifyPayment} />
      <Route path="/api/settle" component={SettlePayment} />
      <Route path="/api/health" component={HealthCheck} />
      <Route path="/api/supported" component={SupportedNetworks} />
      <Route path="/examples/javascript" component={JavaScriptExample} />
      <Route path="/examples/python" component={PythonExample} />
      <Route path="/examples/curl" component={CurlExample} />
      <Route path="/sdk/solana" component={SolanaSdkPage} />
      <Route path="/sdk/base" component={BaseSdkPage} />
      <Route path="/sdk/bnb" component={BnbSdkPage} />
      <Route path="/qr-generator" component={QRGeneratorPage} />
      <Route path="/pay/:id" component={PayPage} />
      <Route path="/ai-assistant" component={AIAssistant} />
      <Route path="/whitepaper" component={Whitepaper} />
      <Route path="/support/faq" component={FAQ} />
      <Route path="/support/community" component={Community} />
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route path="/terms" component={TermsOfService} />
      <Route path="/status" component={StatusPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const style: CSSProperties = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  } as CSSProperties;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="rapid402-theme">
        <TooltipProvider>
          <SidebarProvider style={style}>
            <div className="flex h-screen w-full">
              <AppSidebar />
              <div className="flex flex-col flex-1 overflow-hidden">
                <Header />
                <BreadcrumbNav />
                <main className="flex-1 overflow-auto">
                  <Router />
                </main>
              </div>
            </div>
          </SidebarProvider>
          <ChatWidget />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
