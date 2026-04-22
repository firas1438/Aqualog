import { isAxiosError } from "axios";
import { API } from "@/services/api";
import type { LivabilityInput, LivabilityPrediction } from "@/types/livability";

export async function predictLivability(body: LivabilityInput): Promise<LivabilityPrediction> {
  try {
    const { data } = await API.post<LivabilityPrediction>("/api/v1/predict", body);
    return data;
  } catch (e) {
    if (isAxiosError(e)) {
      throw new Error(e.response?.data?.detail || "Prediction failed, please try again later");
    }
    throw e;
  }
}
