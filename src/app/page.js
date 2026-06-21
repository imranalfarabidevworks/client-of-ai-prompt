import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import HeroSection from "@/components/home/HeroSection";
import FeaturedPrompts from "@/components/home/FeaturedPrompts";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import TopCreators from "@/components/home/TopCreators";
import ReviewsSection from "@/components/home/ReviewsSection";
import HowItWorks from "@/components/home/HowItWorks";
import CTABanner from "@/components/home/CTABanner";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedPrompts />
        <WhyChooseUs />
        <HowItWorks />
        <TopCreators />
        <ReviewsSection />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
