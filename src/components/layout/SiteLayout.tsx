import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Seo from '@/components/seo/Seo';
import { SITE_DESCRIPTION } from '@/lib/site';

export default function SiteLayout() {
  return (
    <div className="min-h-screen">
      <Seo description={SITE_DESCRIPTION} />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
