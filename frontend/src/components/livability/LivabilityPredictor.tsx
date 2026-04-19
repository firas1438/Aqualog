"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Container from "@/components/global/container";
import { ReturnButton } from "@/components/global/return-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/index";
import { predictLivability } from "@/services/api";
import type { LivabilityInput, LivabilityPrediction } from "@/types/livability";

const formSchema = z
  .object({
    salinity: z.coerce
      .number({ invalid_type_error: "Enter a number" })
      .min(0, "Min 0")
      .max(45, "Max 45"),
    ph: z.coerce
      .number({ invalid_type_error: "Enter a number" })
      .min(0, "Min 0")
      .max(14, "Max 14"),
    secchi_depth: z.coerce
      .number({ invalid_type_error: "Enter a number" })
      .min(0, "Min 0"),
    water_depth: z.coerce
      .number({ invalid_type_error: "Enter a number" })
      .positive("Must be greater than 0"),
    water_temp: z.coerce
      .number({ invalid_type_error: "Enter a number" })
      .min(-5, "Min −5")
      .max(45, "Max 45"),
    air_temp: z.coerce
      .number({ invalid_type_error: "Enter a number" })
      .min(-20, "Min −20")
      .max(60, "Max 60"),
  })
  .superRefine((data, ctx) => {
    if (data.secchi_depth > data.water_depth) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["secchi_depth"],
        message: "Cannot exceed water depth",
      });
    }
  });

function formatApiError(err: unknown): string {
  if (isAxiosError(err)) {
    const d = err.response?.data as
      | { detail?: string | Array<{ msg?: string }> }
      | undefined;
    if (typeof d?.detail === "string") return d.detail;
    if (Array.isArray(d?.detail)) {
      return d.detail
        .map((x) =>
          typeof x === "object" && x && "msg" in x ? String(x.msg) : JSON.stringify(x)
        )
        .join(", ");
    }
    if (err.response?.status) {
      return `Server error (${err.response.status})`;
    }
  }
  return err instanceof Error ? err.message : "Request failed";
}

const measureFields: {
  name: keyof LivabilityInput;
  label: string;
  unit: string;
  step: string;
}[] = [
  { name: "salinity", label: "Salinity", unit: "ppt", step: "0.01" },
  { name: "ph", label: "pH", unit: "", step: "0.1" },
  { name: "secchi_depth", label: "Secchi depth", unit: "m", step: "0.01" },
  { name: "water_depth", label: "Water depth", unit: "m", step: "0.01" },
  { name: "water_temp", label: "Water temperature", unit: "°C", step: "0.1" },
  { name: "air_temp", label: "Air temperature", unit: "°C", step: "0.1" },
];

export function LivabilityPredictor() {
  const [result, setResult] = useState<LivabilityPrediction | null>(null);
  const [pending, setPending] = useState(false);

  const form = useForm<LivabilityInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      salinity: 0.8,
      ph: 7.1,
      secchi_depth: 0.5,
      water_depth: 2.0,
      water_temp: 24.0,
      air_temp: 26.0,
    },
  });

  async function onSubmit(values: LivabilityInput) {
    setPending(true);
    setResult(null);
    try {
      const data = await predictLivability(values);
      setResult(data);
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Prediction failed",
        description: formatApiError(e),
      });
    } finally {
      setPending(false);
    }
  }

  const sortedProba = result
    ? Object.entries(result.probabilities).sort((a, b) => b[1] - a[1])
    : [];
  const maxProb =
    result && sortedProba.length > 0
      ? Math.max(...sortedProba.map(([, p]) => p))
      : 0;
  const isApproxMax = (p: number) => p >= maxProb - 1e-9;

  return (
    <div className="relative mx-auto w-full max-w-7xl px-4 pb-16 pt-6 md:pt-10">
      <div
        className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-primary/15 blur-3xl md:-top-32 md:h-80 md:w-80"
        aria-hidden
      />

      <div className="relative mb-10 space-y-0 sm:mb-12">
        <Container className="w-full">
          <div className="flex items-start justify-between gap-3 sm:items-center sm:gap-4">
            <h1 className="min-w-0 max-w-2xl font-heading text-3xl font-semibold tracking-tight md:text-4xl">
              Seawater livability
            </h1>
            <ReturnButton className="shrink-0" />
          </div>
        </Container>
        <Container delay={0.1} className="w-full">
          <p className="mt-3 max-w-2xl text-pretty text-muted-foreground sm:mt-4">
            Assess seawater livability from water quality measurements. The model predicts habitat suitability 
            and algal bloom risk based on temperature, salinity, pH, and light penetration.
          </p>
        </Container>
      </div>

      <Container delay={0.2} className="w-full">
        <Card className="relative border-border/80 shadow-md shadow-black/10 ring-1 ring-border/40">
          <CardHeader className="space-y-1 pb-2">
            <CardTitle className="text-xl">Sample inputs</CardTitle>
            <CardDescription>
              Secchi depth must not exceed water depth (same rule as the API).
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-5 sm:grid-cols-2">
                {measureFields.map((f) => (
                  <div key={f.name} className="space-y-2">
                    <Label htmlFor={f.name} className="text-foreground/90">
                      {f.label}
                      {f.unit ? (
                        <span className="font-normal text-muted-foreground"> ({f.unit})</span>
                      ) : null}
                    </Label>
                    <Input
                      id={f.name}
                      type="number"
                      step={f.step}
                      className="h-10 bg-muted/40 transition-colors focus-visible:bg-background"
                      {...form.register(f.name, { valueAsNumber: true })}
                      aria-invalid={!!form.formState.errors[f.name]}
                    />
                    {form.formState.errors[f.name] ? (
                      <p className="text-xs text-destructive">
                        {form.formState.errors[f.name]?.message}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>

              <Button type="submit" size="lg" disabled={pending} className="min-w-40 gap-2">
                {pending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Running…
                  </>
                ) : (
                  "Run prediction"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>

      {result ? (
        <Container
          key={`${result.class_id}-${result.confidence}`}
          delay={0.1}
          className="mt-10 block w-full"
        >
          <Card className="relative border-border/80 shadow-md shadow-black/10 ring-1 ring-primary/20">
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl">Result</CardTitle>
              <CardDescription>
                Predicted class and probability distribution over all labels.
              </CardDescription>
            </CardHeader>
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
      ) : null}
    </div>
  );
}
