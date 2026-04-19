import { CheckCircle2, Droplets, Satellite } from "lucide-react";
import React from 'react'
import Wrapper from "../global/wrapper";
import Container from "../global/container";
import { Button } from "../ui/button";
import Link from "next/link";

const CTA = () => {
    return (
      <section id="cta" className="flex flex-col items-center justify-center relative w-full py-16 lg:py-20 overflow-hidden">
        <div className="absolute bottom-0 lg:bottom-0 inset-x-0 mx-auto bg-primary/50 lg:bg-primary/70 rounded-full w-1/3 h-1/16 blur-3xl"></div>

        <Wrapper>
          <div className="grid grid-cols-1 lg:grid-cols-2 w-full py-8 gap-10 items-center">
            <div className="flex flex-col items-center lg:items-start justify-center w-full">
              <Container className="w-full">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl leading-tight text-center lg:text-left text-transparent bg-clip-text bg-linear-to-b from-neutral-100 to-neutral-400 font-semibold">
                  Unify Coastal <br className="hidden sm:inline" /> Water Intelligence
                </h2>
                <div className="flex flex-col sm:flex-row sm:flex-wrap items-center sm:items-start justify-center lg:justify-start gap-3 mt-6">
                  <div className="flex items-center gap-2 max-w-xs text-center sm:text-left">
                    <CheckCircle2 className="size-4 text-primary" />
                    <span className="text-sm font-medium">
                      Seawater livability from sample inputs
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-primary" />
                    <span className="text-sm font-medium">
                      Satellite algae classification on demand
                    </span>
                  </div>
                </div>
              </Container>
            </div>
            <div className="flex flex-col justify-center w-full mt-8 lg:mt-0">
              <Container className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto lg:max-w-lg">
                <div className="rounded-2xl border border-border/70 bg-card/50 p-6 shadow-sm">
                  <p className="text-sm font-medium text-foreground">
                    Run a model on your data
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Pick seawater samples or a satellite scene—same region focus for Monastir and Mahdia.
                  </p>
                  <div className="mt-5 flex flex-col gap-3">
                    <Link href="/livability" className="block">
                      <Button variant="outline" size="lg" className="w-full justify-start gap-3 h-auto py-3">
                        <Droplets className="size-5 shrink-0 text-primary" aria-hidden />
                        <span className="text-left">
                          <span className="block font-semibold">Test Livability</span>
                          <span className="block text-xs font-normal text-muted-foreground">From lab or field sample metrics</span>
                        </span>
                      </Button>
                    </Link>
                    <Link href="/algae" className="block">
                      <Button size="lg" className="w-full justify-start gap-3 h-auto py-3">
                        <Satellite className="size-5 shrink-0 text-primary-foreground/90" aria-hidden />
                        <span className="text-left">
                          <span className="block font-semibold">Detect Algae</span>
                          <span className="block text-xs font-normal text-primary-foreground/75">From a coastal satellite image</span>
                        </span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </Container>
            </div>
          </div>
        </Wrapper>
      </section>
    );
};

export default CTA;