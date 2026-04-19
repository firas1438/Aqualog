import axios from "axios";
import type { LivabilityInput, LivabilityPrediction } from "@/types/livability";

export const API = axios.create({
  baseURL: "http://localhost:8000",
});

export async function predictLivability(
  body: LivabilityInput
): Promise<LivabilityPrediction> {
  const { data } = await API.post<LivabilityPrediction>("/api/v1/predict", body);
  return data;
}

/** POST multipart image; response body is the processed image bytes. */
export async function postSegmentImage(file: File): Promise<Blob> {
  const form = new FormData();
  form.append("image", file);
  const { data } = await API.post<Blob>("/api/v1/segment", form, {
    responseType: "blob",
  });
  return data;
}