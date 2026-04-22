"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { LivabilityInput } from "@/types/livability";

{/* zod schema */ }
export const formSchema = z.object({
  salinity: z.coerce.number({ invalid_type_error: "Enter a number" }).min(0, "Min 0").max(45, "Max 45"),
  ph: z.coerce.number({ invalid_type_error: "Enter a number" }).min(0, "Min 0").max(14, "Max 14"),
  secchi_depth: z.coerce.number({ invalid_type_error: "Enter a number" }).min(0, "Min 0"),
  water_depth: z.coerce.number({ invalid_type_error: "Enter a number" }).positive("Must be greater than 0"),
  water_temp: z.coerce.number({ invalid_type_error: "Enter a number" }).min(-5, "Min −5").max(45, "Max 45"),
  air_temp: z.coerce.number({ invalid_type_error: "Enter a number" }).min(-20, "Min −20").max(60, "Max 60"),
}).superRefine((data, ctx) => {
  if (data.secchi_depth > data.water_depth) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["secchi_depth"],
      message: "Cannot exceed water depth",
    });
  }
});

{/* measure fields */ }
const measureFields: { name: keyof LivabilityInput; label: string; unit: string; step: string; placeholder: string; }[] = [
  { name: "salinity", label: "Salinity", unit: "ppt", step: "0.01", placeholder: "Measure water salt content (0-45)" },
  { name: "ph", label: "pH", unit: "", step: "0.1", placeholder: "Assess acidity or alkalinity (0-14)" },
  { name: "secchi_depth", label: "Secchi depth", unit: "m", step: "0.01", placeholder: "Record water clarity depth (min 0)" },
  { name: "water_depth", label: "Water depth", unit: "m", step: "0.01", placeholder: "Total depth of sample point (min 0.01)" },
  { name: "water_temp", label: "Water temperature", unit: "°C", step: "0.1", placeholder: "Capture water temperature level (-5 to 45)" },
  { name: "air_temp", label: "Air temperature", unit: "°C", step: "0.1", placeholder: "Ambient surface temperature (-20 to 60)" },
];

interface LivabilityFormProps {
  pending: boolean;
  onSubmit: (values: LivabilityInput) => Promise<void>;
}

export function LivabilityForm({ pending, onSubmit }: LivabilityFormProps) {
  const form = useForm<LivabilityInput>({ resolver: zodResolver(formSchema), });

  {/* randomize inputs function */ }
  const randomize = () => {
    const wd = parseFloat((Math.random() * 3 + 0.5).toFixed(2));
    form.reset({
      salinity: parseFloat((Math.random() * 1.5 + 0.1).toFixed(2)),
      ph: parseFloat((Math.random() * 2 + 6.1).toFixed(1)),
      water_depth: wd,
      secchi_depth: parseFloat((Math.random() * (wd * 0.8)).toFixed(2)),
      water_temp: parseFloat((Math.random() * 10 + 19).toFixed(1)),
      air_temp: parseFloat((Math.random() * 10 + 21).toFixed(1)),
    });
  };

  return (
    <Card className="relative border-border/80 shadow-md shadow-black/10 ring-1 ring-border/40">
      {/* header */}
      <CardHeader className="space-y-1 pb-2">
        <CardTitle className="text-xl">Sample inputs</CardTitle>
        <CardDescription>
          Fill in the metrics extracted from your seawater sample to assess its quality and predict its livability class.
        </CardDescription>
      </CardHeader>
      {/* form */}
      <CardContent className="pt-2">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-5 sm:grid-cols-2">
            {measureFields.map((f) => (
              <div key={f.name} className="space-y-2">
                {/* label */}
                <Label htmlFor={f.name} className="text-foreground/90">
                  {f.label}
                  {f.unit ? (
                    <span className="font-normal text-muted-foreground"> ({f.unit})</span>
                  ) : null}
                </Label>
                {/* input */}
                <Input id={f.name} type="number" step={f.step} placeholder={f.placeholder}
                  className="h-10 bg-muted/40 transition-colors focus-visible:bg-background"
                  {...form.register(f.name, { valueAsNumber: true })}
                  aria-invalid={!!form.formState.errors[f.name]}
                />
                {/* errors */}
                {form.formState.errors[f.name] ? (
                  <p className="text-xs text-destructive">
                    {form.formState.errors[f.name]?.message}
                  </p>
                ) : null}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            {/* submit button */}
            <Button type="submit" size="lg" disabled={pending} className="min-w-40 gap-2">
              {pending ? (
                <> <Loader2 className="size-4 animate-spin" /> Running… </>
              ) : (
                "Run prediction"
              )}
            </Button>
            {/* randomize button */}
            <Button type="button" variant="outline" size="lg" onClick={randomize} disabled={pending}>
              Randomize
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
