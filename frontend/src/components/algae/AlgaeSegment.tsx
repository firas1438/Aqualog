"use client";

import { isAxiosError } from "axios";
import { ImageIcon, Loader2, Upload, X } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";

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
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { postSegmentImage } from "@/services/api";

const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPT = "image/png,image/jpeg,image/jpg,image/webp,image/gif";

function isImageFile(f: File) {
  return f.type.startsWith("image/");
}

async function formatSegmentError(err: unknown): Promise<string> {
  if (isAxiosError(err)) {
    const data = err.response?.data;
    if (data instanceof Blob) {
      try {
        const text = await data.text();
        try {
          const j = JSON.parse(text) as { detail?: unknown };
          if (typeof j.detail === "string") return j.detail;
          if (Array.isArray(j.detail)) {
            return j.detail
              .map((x) =>
                typeof x === "object" && x && "msg" in x
                  ? String((x as { msg?: string }).msg)
                  : JSON.stringify(x)
              )
              .join(", ");
          }
        } catch {
          if (text.trim()) return text.slice(0, 280);
        }
      } catch {
        /* ignore */
      }
    }
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

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export function AlgaeSegment() {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!file) {
      setOriginalUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setOriginalUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    if (!resultBlob) {
      setResultUrl(null);
      return;
    }
    const url = URL.createObjectURL(resultBlob);
    setResultUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [resultBlob]);

  const pickFile = useCallback((f: File | null | undefined) => {
    if (!f) return;
    if (!isImageFile(f)) {
      toast({
        variant: "destructive",
        title: "Invalid file",
        description: "Please choose an image (PNG, JPEG, WebP, or GIF).",
      });
      return;
    }
    if (f.size > MAX_BYTES) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: `Maximum size is ${formatBytes(MAX_BYTES)}.`,
      });
      return;
    }
    setFile(f);
    setResultBlob(null);
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      pickFile(e.target.files?.[0]);
    },
    [pickFile]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      pickFile(e.dataTransfer.files?.[0]);
    },
    [pickFile]
  );

  const clearFile = useCallback(() => {
    setFile(null);
    setResultBlob(null);
    if (inputRef.current) inputRef.current.value = "";
  }, []);

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
        description: await formatSegmentError(e),
      });
    } finally {
      setPending(false);
    }
  }, [file]);

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
              Algae segmentation
            </h1>
            <ReturnButton className="shrink-0" />
          </div>
        </Container>
        <Container delay={0.1} className="w-full">
          <p className="mt-3 max-w-2xl text-pretty text-muted-foreground sm:mt-4">
            Detect and assess algal blooms from water sample imagery. Upload microscopy or field observations to 
            automatically segment bloom boundaries and classify bloom extent.
          </p>
        </Container>
      </div>

      <Container delay={0.2} className="w-full">
        <Card className="relative border-border/80 shadow-md shadow-black/10 ring-1 ring-border/40">
          <CardHeader className="space-y-1 pb-2">
            <CardTitle className="text-xl">Image upload</CardTitle>
            <CardDescription>
              Drag and drop or choose a file. Max {formatBytes(MAX_BYTES)}. Images only.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-2">
            <div
              role="presentation"
              onDragOver={(e) => e.preventDefault()}
              onDrop={onDrop}
              className="flex justify-center rounded-lg border border-dashed border-input bg-muted/20 px-6 py-12 transition-colors"
            >
              <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:gap-4 sm:text-left">
                <Upload
                  className="mx-auto size-8 shrink-0 text-muted-foreground sm:mx-0 sm:size-6"
                  aria-hidden
                />
                <div className="text-sm leading-6 text-foreground">
                  <p className="inline sm:block">
                    <span>Drag and drop or </span>
                    <Label
                      htmlFor={inputId}
                      className="cursor-pointer font-medium text-primary underline-offset-4 hover:underline"
                    >
                      choose file
                    </Label>
                    <span> to upload</span>
                  </p>
                  <input
                    ref={inputRef}
                    id={inputId}
                    type="file"
                    accept={ACCEPT}
                    className="sr-only"
                    onChange={onInputChange}
                  />
                </div>
              </div>
            </div>

            {file ? (
              <div className="relative rounded-lg border border-border/60 bg-muted/30 p-3">
                <div className="absolute right-1 top-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="rounded-sm p-2 text-muted-foreground hover:text-foreground"
                    aria-label="Remove file"
                    onClick={clearFile}
                  >
                    <X className="size-4 shrink-0" aria-hidden />
                  </Button>
                </div>
                <div className="flex items-center gap-2.5 pr-8">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-background shadow-sm ring-1 ring-inset ring-border">
                    <ImageIcon className="size-5 text-foreground" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-foreground">{file.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{formatBytes(file.size)}</p>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="flex flex-wrap items-center justify-end gap-3">
              <Button type="button" variant="outline" onClick={clearFile} disabled={!file && !resultBlob}>
                Clear
              </Button>
              <Button type="button" disabled={!file || pending} className="min-w-40 gap-2" onClick={runSegment} >
                {pending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Processing…
                  </>
                ) : (
                  "Run segmentation"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </Container>

      {(originalUrl && resultUrl) && (
        <Container delay={0.15} className="mt-10 w-full">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-border/80 shadow-md shadow-black/10 ring-1 ring-border/40">
              <CardHeader className="space-y-1 pb-2">
                <CardTitle className="text-lg">Original</CardTitle>
                <CardDescription>Your uploaded image.</CardDescription>
              </CardHeader>
              <CardContent>
                {originalUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- blob preview
                  <img
                    src={originalUrl}
                    alt="Original upload preview"
                    className="mx-auto max-h-[min(55vh,520px)] w-full rounded-md border border-border/50 bg-muted/40 object-contain"
                  />
                ) : (
                  <p className="py-12 text-center text-sm text-muted-foreground">No image yet.</p>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/80 shadow-md shadow-black/10 ring-1 ring-primary/20">
              <CardHeader className="space-y-1 pb-2">
                <CardTitle className="text-lg">Segmented</CardTitle>
                <CardDescription>Output from the segmentation API.</CardDescription>
              </CardHeader>
              <CardContent>
                {resultUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- blob preview
                  <img
                    src={resultUrl}
                    alt="Segmentation result"
                    className="mx-auto max-h-[min(55vh,520px)] w-full rounded-md border border-border/50 bg-muted/40 object-contain"
                  />
                ) : (
                  <p className="py-12 text-center text-sm text-muted-foreground">
                    Run segmentation to see the processed image here.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </Container>
      )}
    </div>
  );
}
