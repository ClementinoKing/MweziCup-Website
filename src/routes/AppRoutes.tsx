import { Route, Routes } from 'react-router-dom';
import SiteLayout from '@/components/layout/SiteLayout';
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import HowItWorksPage from '@/pages/HowItWorksPage';
import ProductPage from '@/pages/ProductPage';
import BlogPage from '@/pages/BlogPage';
import BlogArticlePage from '@/pages/BlogArticlePage';
import FAQsPage from '@/pages/FAQsPage';
import ContactPage from '@/pages/ContactPage';
import NotFoundPage from '@/pages/NotFoundPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogArticlePage />} />
        <Route path="/faqs" element={<FAQsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
