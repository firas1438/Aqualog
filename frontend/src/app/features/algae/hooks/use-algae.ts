"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { postSegmentImage } from "../api/segment";

export function useAlgae() {
  // state for current selected file and preview URLs
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  // create temporary URL for the uploaded file
  useEffect(() => {
    if (!file) {
      setOriginalUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setOriginalUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // create temporary URL for the segmentation result
  useEffect(() => {
    if (!resultBlob) {
      setResultUrl(null);
      return;
    }
    const url = URL.createObjectURL(resultBlob);
    setResultUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [resultBlob]);

  // reset all states
  const clearFile = useCallback(() => {
    setFile(null);
    setResultBlob(null);
  }, []);

  // upload image and run segmentation
  const runSegment = useCallback(async () => {
    if (!file) return;
    setPending(true);
    setResultBlob(null);
    try {
      const blob = await postSegmentImage(file);
      setResultBlob(blob);
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Segmentation failed",
        description: e instanceof Error ? e.message : "Request failed, please try again later!",
      });
    } finally {
      setPending(false);
    }
  }, [file]);

  return { file, setFile, originalUrl, resultBlob, resultUrl, pending, clearFile, runSegment, };
}
