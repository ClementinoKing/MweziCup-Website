import HeroSection from '@/components/home/HeroSection';
import LifestyleStrip from '@/components/home/LifestyleStrip';
import WhyMweziCupSection from '@/components/home/WhyMweziCupSection';
import ProductFeatureSection from '@/components/home/ProductFeatureSection';
import EducationSupportSection from '@/components/home/EducationSupportSection';
import BlogPreviewSection from '@/components/home/BlogPreviewSection';
import FAQPreviewSection from '@/components/home/FAQPreviewSection';
import FinalCTASection from '@/components/home/FinalCTASection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <LifestyleStrip />
      <WhyMweziCupSection />
      <ProductFeatureSection />
      <EducationSupportSection />
      <BlogPreviewSection />
      <FAQPreviewSection />
      <FinalCTASection />
    </>
  );
}
