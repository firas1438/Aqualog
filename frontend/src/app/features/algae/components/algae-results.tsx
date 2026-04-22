"use client";

import Container from "@/components/global/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AlgaeResultsProps {
  originalUrl: string | null;
  resultUrl: string | null;
}

export function AlgaeResults({ originalUrl, resultUrl }: AlgaeResultsProps) {
  if (!originalUrl || !resultUrl) return null;

  return (
    <Container delay={0.15} className="mt-10 w-full">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Original */}
        <Card className="border-border/80 shadow-md shadow-black/10 ring-1 ring-border/40">
          <CardHeader className="space-y-1 pb-2">
            <CardTitle className="text-lg">Original</CardTitle>
            <CardDescription>Your uploaded image.</CardDescription>
          </CardHeader>
          <CardContent>
            <img
              src={originalUrl}
              alt="Original upload preview"
              className="mx-auto max-h-[min(55vh,520px)] w-full rounded-md border border-border/50 bg-muted/40 object-contain"
            />
          </CardContent>
        </Card>

        {/* Segmented */}
        <Card className="border-border/80 shadow-md shadow-black/10 ring-1 ring-primary/20">
          <CardHeader className="space-y-1 pb-2">
            <CardTitle className="text-lg">Segmented</CardTitle>
            <CardDescription>Output from the segmentation API.</CardDescription>
          </CardHeader>
          <CardContent>
            <img
              src={resultUrl}
              alt="Segmentation result"
              className="mx-auto max-h-[min(55vh,520px)] w-full rounded-md border border-border/50 bg-muted/40 object-contain"
            />
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
