import HeroSection from '@/components/home/HeroSection';
import MarqueeBanner from '@/components/layout/MarqueeBanner';
import WhyMweziCupSection from '@/components/home/WhyMweziCupSection';
import BlogPreviewSection from '@/components/home/BlogPreviewSection';
import FAQPreviewSection from '@/components/home/FAQPreviewSection';
import FinalCTASection from '@/components/home/FinalCTASection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MarqueeBanner />
      <WhyMweziCupSection />
      <BlogPreviewSection />
      <FAQPreviewSection />
      <FinalCTASection />
    </>
  );
}
