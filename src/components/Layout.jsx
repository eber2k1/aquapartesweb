import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Breadcrumb from './Breadcrumb';
import WhatsAppFloat from './WhatsAppFloat';
import InstallPWA from './InstallPWA';

export const Layout = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {!isHomePage ? (
        <div className="pt-24 lg:pt-28">
          <Breadcrumb />
        </div>
      ) : (
        <div className="pt-24" />
      )}
      <main className="flex-grow bg-gray-50">
        {children}
      </main>
      <Footer />
      <WhatsAppFloat />
      <InstallPWA />
    </div>
  );
};
