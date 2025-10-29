import { Hero } from "@/components/hero";
import { AboutSection } from "@/components/about-section";
import { SpecificationsTable } from "@/components/specifications-table";
import { ApiMethods } from "@/components/api-methods";
import { CodeExamples } from "@/components/code-examples";
import { Capabilities } from "@/components/capabilities";
import { GetStarted } from "@/components/get-started";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <AboutSection />
      <SpecificationsTable />
      <ApiMethods />
      <CodeExamples />
      <Capabilities />
      <GetStarted />
      <Footer />
    </div>
  );
}
