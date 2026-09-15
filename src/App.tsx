import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { TemplatesPage } from './pages/TemplatesPage';
import { PricingPage } from './pages/PricingPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { InvitationPage } from './pages/InvitationPage';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname || '/');
  const [searchParams, setSearchParams] = useState<URLSearchParams>(
    new URLSearchParams(window.location.search)
  );

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname || '/');
      setSearchParams(new URLSearchParams(window.location.search));
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigate = (to: string) => {
    // Parse URL and query
    const [path, query] = to.split('?');
    window.history.pushState({}, '', to);
    setCurrentPath(path || '/');
    setSearchParams(new URLSearchParams(query ? `?${query}` : ''));
    window.scrollTo(0, 0);
  };

  // Route matching
  const isInviteRoute = currentPath.startsWith('/invite/');
  const inviteSlug = isInviteRoute ? currentPath.replace('/invite/', '').split('/')[0] : '';
  const isAdminRoute = currentPath.startsWith('/admin');

  // If viewing an actual public invitation (/invite/:slug), render standalone full screen view
  if (isInviteRoute && inviteSlug) {
    return (
      <div className="min-h-screen bg-stone-900">
        <InvitationPage slug={inviteSlug} onNavigate={navigate} />
      </div>
    );
  }

  // If in Admin Dashboard, render admin shell without main consumer Navbar/Footer
  if (isAdminRoute) {
    return <AdminDashboardPage onNavigate={navigate} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#1E232A] font-sans antialiased selection:bg-[#D4AF37]/30">
      {/* Top Demo Bar for quick reviewer testing */}
      <div className="bg-[#050A18] text-amber-200/90 text-[11px] py-1.5 px-4 border-b border-amber-500/20 flex items-center justify-between overflow-x-auto gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-bold text-white uppercase tracking-wider">Aksara Undangan</span>
          <span className="text-stone-400">|</span>
          <span className="text-stone-300">Akses Cepat Demo:</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => navigate('/invite/aisyah-fauzi')}
            className="hover:text-white underline"
          >
            Demo Modern
          </button>
          <span>•</span>
          <button
            onClick={() => navigate('/invite/ali-fatimah')}
            className="hover:text-white underline"
          >
            Demo Walimah
          </button>
          <span>•</span>
          <button
            onClick={() => navigate('/invite/hasan-maryam')}
            className="hover:text-white underline font-semibold text-amber-300"
          >
            Demo Kitab Kuning Pesantren
          </button>
          <span>•</span>
          <button
            onClick={() => navigate('/dashboard')}
            className="hover:text-white underline text-stone-300"
          >
            Customer Dashboard
          </button>
          <span>•</span>
          <button
            onClick={() => navigate('/admin')}
            className="hover:text-white underline text-stone-300 font-bold"
          >
            Admin Panel
          </button>
        </div>
      </div>

      {/* Main Website Navbar */}
      <Navbar currentPath={currentPath} onNavigate={navigate} />

      {/* Main Content Pages */}
      <main className="flex-1">
        {currentPath === '/' && <HomePage onNavigate={navigate} />}
        {currentPath === '/templates' && <TemplatesPage onNavigate={navigate} />}
        {currentPath === '/pricing' && <PricingPage onNavigate={navigate} />}
        {currentPath === '/how-it-works' && <HowItWorksPage onNavigate={navigate} />}
        {currentPath === '/checkout' && (
          <CheckoutPage
            initialPackage={searchParams.get('package') || 'REGULER'}
            initialTemplate={searchParams.get('template') || 'modern-minimalist'}
            onNavigate={navigate}
          />
        )}
        {currentPath === '/dashboard' && <DashboardPage onNavigate={navigate} />}
      </main>

      {/* Main Website Footer */}
      <Footer onNavigate={navigate} />
    </div>
  );
}
