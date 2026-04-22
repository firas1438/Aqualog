"use client";

import Container from "@/components/global/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/index";
import type { LivabilityPrediction } from "@/types/livability";

interface LivabilityResultsProps {
  result: LivabilityPrediction;
}

export function LivabilityResults({ result }: LivabilityResultsProps) {
  const sortedProba = Object.entries(result.probabilities).sort((a, b) => b[1] - a[1]);
  const maxProb = Math.max(...sortedProba.map(([, p]) => p));
  const isApproxMax = (p: number) => p >= maxProb - 1e-9;

  return (
    <Container key={`${result.class_id}-${result.confidence}`} delay={0.1} className="mt-10 block w-full" >
      <Card className="relative border-border/80 shadow-md shadow-black/10 ring-1 ring-primary/20">
        {/* header */}
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl">Result</CardTitle>
          <CardDescription>
            Predicted class and probability distribution over all labels.
          </CardDescription>
        </CardHeader>
        {/* results */}
        <CardContent className="space-y-8 pt-4">
          <div className="rounded-xl border border-border/60 bg-muted/20 p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Predicted class
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-primary md:text-3xl">
              {result.label}
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Confidence{" "}
              <span className="font-medium text-foreground">
                {(result.confidence * 100).toFixed(1)}%
              </span>
              <span className="mx-2 text-border">·</span>
              <span className="font-mono text-xs text-muted-foreground">
                class_id {result.class_id}
              </span>
            </p>
          </div>

          <Separator className="bg-border/60" />

          <div className="space-y-4">
            <p className="text-md mb-4 font-medium underline">Class probabilities</p>
            <ul className="space-y-4">
              {sortedProba.map(([label, p]) => (
                <li key={label}>
                  <div className="mb-1.5 flex justify-between gap-3 text-sm">
                    <span className="font-medium text-foreground/90">{label}</span>
                    <span className="font-mono tabular-nums text-muted-foreground">
                      {(p * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted/80">
                    <div
                      className={cn(
                        "h-full rounded-full transition-colors duration-300",
                        isApproxMax(p) ? "bg-primary" : "bg-primary/20"
                      )}
                      style={{ width: `${Math.min(100, p * 100)}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}
