"use client";

import { Header } from "@/components/global/header";
import { LivabilityForm } from "./forms/livability-form";
import { LivabilityResults } from "./components/livability-results";
import Container from "@/components/global/container";
import { useLivability } from "./hooks/use-livability";

export default function LivabilityPage() {
  const { result, pending, onSubmit } = useLivability();

  return (
    <div className="flex min-h-screen flex-col px-3 lg:px-0">
      <main className="flex-1 py-20">
        <div className="relative mx-auto w-full max-w-7xl px-4 pt-6 md:pt-10">
          
          {/* header */}
          <Header
            title="Seawater livability"
            description="Assess seawater livability from water quality measurements. The model predicts habitat suitability and algal bloom risk based on temperature, salinity, pH, and light penetration."
          />

          {/* input form*/}
          <Container delay={0.2} className="w-full">
            <LivabilityForm pending={pending} onSubmit={onSubmit} />
          </Container>

          {/* result */}
          {result && <LivabilityResults result={result} />}
        </div>
      </main>
    </div>
  );
}
