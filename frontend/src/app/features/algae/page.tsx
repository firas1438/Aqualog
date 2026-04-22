"use client";

import Container from "@/components/global/container";
import { Header } from "@/components/global/header";
import { AlgaeUpload } from "./components/algae-upload";
import { AlgaeResults } from "./components/algae-results";
import { useAlgae } from "./hooks/use-algae";

export default function AlgaePage() {
  const { file, setFile, originalUrl, resultBlob, resultUrl, pending, clearFile, runSegment, } = useAlgae();

  return (
    <div className="flex min-h-screen flex-col px-3 lg:px-0">
      <main className="flex-1 py-20">
        <div className="relative mx-auto w-full max-w-7xl px-4 pt-6 md:pt-10">

          {/* header */}
          <Header
            title="Algae segmentation"
            description="Detect and assess algal blooms from water sample imagery. Upload microscopy or field observations to automatically segment bloom boundaries and classify bloom extent."
          />

          {/* upload image */}
          <Container delay={0.2} className="w-full">
            <AlgaeUpload
              file={file}
              setFile={setFile}
              pending={pending}
              onRun={runSegment}
              onClear={clearFile}
              hasResult={!!resultBlob}
            />
          </Container>

          {/* results */}
          <AlgaeResults
            originalUrl={originalUrl}
            resultUrl={resultUrl}
          />
        </div>
      </main>
    </div>
  );
}
