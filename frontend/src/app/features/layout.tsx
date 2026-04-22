import { generateMetadata } from "@/utils";

export const metadata = generateMetadata({
  title: "Select Feature | Aqualog",
  description:
    "Choose between water livability assessment or algae bloom detection to analyze coastal water data.",
});

export default function FeaturesLayout({ children, }: { children: React.ReactNode; }) {
  return (
    <div className="relative">
      {/* gradient */}
      <div className="pointer-events-none absolute -top-24 right-6 h-64 w-64 rounded-full bg-primary/15 blur-3xl md:-top-32 md:h-80 md:w-80" aria-hidden />
      {children}
    </div>
  );
}
