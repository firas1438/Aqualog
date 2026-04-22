"use client";

import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import type { LivabilityInput, LivabilityPrediction } from "@/types/livability";
import { predictLivability } from "../api/predict";

export function useLivability() {
  // prediction result and loading states
  const [result, setResult] = useState<LivabilityPrediction | null>(null);
  const [pending, setPending] = useState(false);

  // handle form submission and API call
  async function onSubmit(values: LivabilityInput) {
    setPending(true);
    setResult(null);
    try {
      const data = await predictLivability(values);
      setResult(data);
    } catch (e) {
      toast({ variant: "destructive", title: "Prediction failed", description: e instanceof Error ? e.message : "Request failed, please try again later", });
    } finally {
      setPending(false);
    }
  }

  return { result, pending, onSubmit, };
}
