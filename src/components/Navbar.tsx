import React, { useState } from 'react';
import { Menu, X, MessageCircle, Sparkles, LayoutDashboard, Shield, ChevronRight } from 'lucide-react';
import { appStorage } from '../services/storage';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentUser = appStorage.getCurrentUser();

  const navLinks = [
    { label: 'Beranda', path: '/' },
    { label: 'Katalog Template', path: '/templates' },
    { label: 'Paket & Harga', path: '/pricing' },
    { label: 'Cara Pemesanan', path: '/how-it-works' },
  ];

  const handleNav = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  const openWhatsAppAdmin = () => {
    const message = encodeURIComponent(
      'Halo Admin Aksara Undangan, saya ingin konsultasi / request custom template undangan pernikahan.'
    );
    window.open(`https://wa.me/6285941041089?text=${message}`, '_blank');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0B132B]/95 text-white backdrop-blur-md border-b border-amber-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <div
            onClick={() => handleNav('/')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#8C6D3B] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform border border-amber-300/40">
              <span className="font-serif-luxury font-bold text-lg text-[#0B132B]">AU</span>
            </div>
            <div>
              <span className="font-serif-luxury text-xl font-bold tracking-wider text-white block leading-tight">
                AKSARA <span className="text-[#D4AF37]">UNDANGAN</span>
              </span>
              <span className="text-[10px] tracking-widest uppercase text-amber-200/70 font-sans block">
                Digital Wedding Invitation
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNav(link.path)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'text-[#D4AF37] bg-white/10'
                      : 'text-stone-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {/* WhatsApp Admin Request Button */}
            <button
              onClick={openWhatsAppAdmin}
              title="Konsultasi WhatsApp Admin 085941041089"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/30 rounded-lg text-xs font-semibold transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Chat Admin</span>
            </button>

            {/* Customer Dashboard */}
            <button
              onClick={() => handleNav('/dashboard')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentPath.startsWith('/dashboard')
                  ? 'bg-[#D4AF37] text-[#0B132B]'
                  : 'bg-white/10 text-stone-200 hover:bg-white/20'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>

            {/* Admin Portal */}
            <button
              onClick={() => handleNav('/admin')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentPath.startsWith('/admin')
                  ? 'bg-amber-400 text-stone-900 font-bold'
                  : 'text-stone-400 hover:text-stone-200 border border-stone-700'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin</span>
            </button>

            {/* Buat Undangan CTA */}
            <button
              onClick={() => handleNav('/checkout')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#C59B27] hover:from-[#E5C158] hover:to-[#D4AF37] text-[#0B132B] rounded-lg text-xs font-bold shadow-md transition-all transform hover:scale-105"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Buat Undangan</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => handleNav('/checkout')}
              className="px-2.5 py-1.5 bg-[#D4AF37] text-[#0B132B] rounded-lg text-xs font-bold"
            >
              Buat
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-300 hover:text-white rounded-lg hover:bg-white/10"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0F172A] border-b border-amber-500/20 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => handleNav(link.path)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-between ${
                currentPath === link.path ? 'bg-amber-500/20 text-[#D4AF37]' : 'text-stone-300'
              }`}
            >
              <span>{link.label}</span>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </button>
          ))}

          <div className="pt-3 border-t border-stone-800 space-y-2">
            <button
              onClick={openWhatsAppAdmin}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-semibold"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Admin (085941041089)</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleNav('/dashboard')}
                className="w-full py-2.5 bg-white/10 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
              </button>
              <button
                onClick={() => handleNav('/admin')}
                className="w-full py-2.5 border border-stone-700 text-stone-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" /> Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
