import { AlgaeSegment } from "@/components/algae/AlgaeSegment";
import { generateMetadata } from "@/utils";

export const metadata = generateMetadata({
  title: "Algae segmentation | Aqualog",
  description:
    "Upload an image, run POST /api/v1/segment, and compare the original with the post-processed output.",
});

export default function AlgaePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 pt-20 pb-8">
        <AlgaeSegment />
      </main>
    </div>
  );
}
