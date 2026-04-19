"use client"

import React from 'react'
import Wrapper from "../global/wrapper";
import Icons from "../global/icons";
import Image from "next/image";
import Container from "../global/container";
import { Button } from "../ui/button";
import Link from "next/link";

const Hero = () => {
    return (
      <section id="hero" className="relative z-0 w-full h-full">
        <div className="absolute -top-16 inset-x-0 -z-10 mx-auto w-3/4 h-32 lg:h-40 rounded-full blur-[5rem] bg-[radial-gradient(86.02%_172.05%_at_50%_-40%,rgba(18,139,135,1)_0%,rgba(5,5,5,0)_80%)]"></div>

        <Image src="/images/hero.svg" alt="" width={1024} height={1024} className="absolute inset-x-0 -top-16 w-full z-10 min-w-full" />

        <Wrapper className="pt-14 md:pt-10 pb-14 px-4 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center w-full z-10">
            {/* left column */}
            <div className="flex flex-col items-center lg:items-start justify-center">
              <Container>
                <div className="flex items-center justify-center lg:justify-start gap-x-1 px-2 py-1.5 relative w-max mx-auto lg:mx-0 rounded-full before:absolute before:inset-0 before:-z-10 before:p-px before:rounded-3xl before:bg-linear-to-b before:from-neutral-700 before:to-neutral-900 before:content-[''] after:absolute after:inset-px after:-z-10 after:rounded-[22px] after:bg-card/60">
                  <Icons.stars className="size-5" />
                  <span className="text-sm text-white">
                    Aqualog – Seawater & Satellite AI
                  </span>
                </div>
              </Container>

              <Container delay={0.1}>
                <h2 className="text-balance leading-tight! text-center lg:text-left text-5xl md:text-6xl font-semibold tracking-tight mt-6 w-full">
                  Coastal Water Quality
                </h2>
              </Container>

              <Container delay={0.2}>
                <p className="text-base md:text-lg font-normal text-center lg:text-left text-balance text-muted-foreground max-w-3xl mx-auto lg:mx-0 mt-4">
                  Add seawater sample data and coastal satellite imagery, our AI scores marine livability and flags algae risk.
                  No extra setup needed.
                </p>
              </Container>

              <Container delay={0.3}>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                  <Link href="/algae">
                    <Button size="lg">
                      Detect Algae
                    </Button>
                  </Link>
                  <Link href="/livability">
                    <Button size="lg" variant="outline">
                      Test Livability
                    </Button>
                  </Link>
                </div>
              </Container>
            </div>

            {/* right column */}
            <Container className="w-full">
              <div className="relative mx-auto max-w-lg">
                <Image src="/alges.png" alt="Aqualog coastal water dashboard" priority width={1280} height={1280} loading="eager" className="rounded-2xl md:rounded-[26px] w-full h-auto" />
              </div>
            </Container>
          </div>
        </Wrapper>
      </section>
    );
};

export default Hero;