"use client";

import { ImageIcon, Loader2, Upload, X } from "lucide-react";
import { useCallback, useId, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPT = "image/png,image/jpeg,image/jpg,image/webp,image/gif";

function isImageFile(f: File) {
  return f.type.startsWith("image/");
}

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

interface AlgaeUploadProps {
  file: File | null;
  setFile: (f: File | null) => void;
  pending: boolean;
  onRun: () => Promise<void>;
  onClear: () => void;
  hasResult: boolean;
}

export function AlgaeUpload({ file, setFile, pending, onRun, onClear, hasResult }: AlgaeUploadProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const pickFile = useCallback((f: File | null | undefined) => {
    if (!f) return;
    if (!isImageFile(f)) {
      toast({ variant: "destructive", title: "Invalid file", description: "Please choose an image (PNG, JPEG, WebP, or GIF).", });
      return;
    }
    if (f.size > MAX_BYTES) {
      toast({ variant: "destructive", title: "File too large", description: `Maximum size is ${formatBytes(MAX_BYTES)}.`, });
      return;
    }
    setFile(f);
    if (inputRef.current) inputRef.current.value = "";
  }, [setFile]);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => pickFile(e.target.files?.[0]);
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    pickFile(e.dataTransfer.files?.[0]);
  };

  return (
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
            <Upload className="mx-auto size-8 shrink-0 text-muted-foreground sm:mx-0 sm:size-6" aria-hidden />
            <div className="text-sm leading-6 text-foreground">
              <p className="inline sm:block">
                <span>Drag and drop or </span>
                <Label htmlFor={inputId} className="cursor-pointer font-medium text-primary underline-offset-4 hover:underline" >
                  choose file
                </Label>
                <span> to upload</span>
              </p>
              <input ref={inputRef} id={inputId} type="file" accept={ACCEPT} className="sr-only" onChange={onInputChange} />
            </div>
          </div>
        </div>

        {file ? (
          <div className="relative rounded-lg border border-border/60 bg-muted/30 p-3">
            <div className="absolute right-1 top-1">
              <Button type="button" variant="ghost" size="sm" className="rounded-sm p-2 text-muted-foreground hover:text-foreground" onClick={onClear} aria-label="Remove file" >
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
          <Button type="button" variant="outline" onClick={onClear} disabled={!file && !hasResult}>
            Clear
          </Button>
          <Button type="button" disabled={!file || pending} className="min-w-40 gap-2" onClick={onRun} >
            {pending ? (
              <> <Loader2 className="size-4 animate-spin" /> Processing… </>
            ) : (
              "Run segmentation"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
