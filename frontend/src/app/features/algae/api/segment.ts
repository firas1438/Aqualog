import { isAxiosError } from "axios";
import { API } from "@/services/api";

export async function postSegmentImage(file: File): Promise<Blob> {
  try {
    const form = new FormData();
    form.append("image", file);
    const { data } = await API.post<Blob>("/api/v1/segment", form, { responseType: "blob", });
    return data;
  } catch (e) {
    if (isAxiosError(e) && e.response?.data instanceof Blob) {
      const errorText = await e.response.data.text();
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.detail || "Segmentation failed, please try again later");
      } catch {
        throw new Error(errorText || "Segmentation failed, please try again later!");
      }
    }
    throw e;
  }
}
