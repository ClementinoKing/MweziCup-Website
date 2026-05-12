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
import AdminLayout from '@/admin/layout/AdminLayout';
import AdminDashboard from '@/admin/pages/AdminDashboard';
import HomepageManager from '@/admin/pages/HomepageManager';
import BlogManager from '@/admin/pages/BlogManager';
import BlogPostFormPage from '@/admin/pages/BlogPostFormPage';
import SectionsManager from '@/admin/pages/SectionsManager';
import MediaLibrary from '@/admin/pages/MediaLibrary';
import ContactMessages from '@/admin/pages/ContactMessages';
import NewsletterSubscribers from '@/admin/pages/NewsletterSubscribers';
import SiteSettings from '@/admin/pages/SiteSettings';
import AdminUsers from '@/admin/pages/AdminUsers';
import { Navigate } from 'react-router-dom';
import { AdminAuthProvider } from '@/admin/auth/AdminAuthProvider';
import RequireAdminAuth from '@/admin/auth/RequireAdminAuth';
import AdminLoginPage from '@/admin/pages/AdminLoginPage';
import AdminChangePasswordPage from '@/admin/pages/AdminChangePasswordPage';

export default function AppRoutes() {
  return (
    <AdminAuthProvider>
      <Routes>
        <Route path="/admin/login" element={<AdminLoginPage />} />

        <Route element={<RequireAdminAuth />}>
          <Route path="/admin/change-password" element={<AdminChangePasswordPage />} />
          <Route path="/martinee" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
          </Route>

          <Route path="/admin/*" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="homepage" element={<HomepageManager />} />
            <Route path="blog">
              <Route index element={<BlogManager />} />
              <Route path="new" element={<BlogPostFormPage />} />
              <Route path=":id/edit" element={<BlogPostFormPage />} />
            </Route>
            <Route path="sections" element={<SectionsManager />} />
            <Route path="media" element={<MediaLibrary />} />
            <Route path="messages" element={<ContactMessages />} />
            <Route path="subscribers" element={<NewsletterSubscribers />} />
            <Route path="settings" element={<SiteSettings />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
        </Route>

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
    </AdminAuthProvider>
  );
}
