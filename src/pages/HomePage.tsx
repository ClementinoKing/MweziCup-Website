import HeroSection from '@/components/home/HeroSection';
import MarqueeBanner from '@/components/layout/MarqueeBanner';
import WhyMweziCupSection from '@/components/home/WhyMweziCupSection';
import BlogPreviewSection from '@/components/home/BlogPreviewSection';
import FAQPreviewSection from '@/components/home/FAQPreviewSection';
import FinalCTASection from '@/components/home/FinalCTASection';
import Seo from '@/components/seo/Seo';
import { SITE_DESCRIPTION } from '@/lib/site';

export default function HomePage() {
  return (
    <>
      <Seo
        title="Flow in comfort"
        description={SITE_DESCRIPTION}
        path="/"
        keywords={['reusable menstrual cup', 'period care', 'Malawi', 'sustainable period products']}
        schema={[
          {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Mwezi Cup',
            url: 'https://mwezicup.com',
            logo: 'https://mwezicup.com/Mwezi_Cup_logo.svg',
            sameAs: [],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Mwezi Cup',
            url: 'https://mwezicup.com',
          },
        ]}
      />
      <HeroSection />
      <MarqueeBanner />
      <WhyMweziCupSection />
      <BlogPreviewSection />
      <FAQPreviewSection />
      <FinalCTASection />
    </>
  );
}
