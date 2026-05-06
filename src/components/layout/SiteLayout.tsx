import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function SiteLayout() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
