import CTA from "@/components/home/cta";
import Faq from "@/components/home/faq";
import Hero from "@/components/home/hero";
import HowItWorks from "@/components/home/how-it-works";
import MarqueeSlide from "@/components/home/marquee";


const HomePage = () => {
  return (
    <div className="w-full relative flex flex-col pt-16">
      <Hero />
      <MarqueeSlide />
      <HowItWorks />
      <Faq />
      <CTA />
    </div>
  );
};

export default HomePage;
