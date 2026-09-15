import React from 'react';
import { MessageCircle, Heart, ShieldCheck, Zap, Award } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const openWhatsApp = () => {
    window.open('https://wa.me/6285941041089?text=Halo%20Aksara%20Undangan,%20saya%20tertarik%20dengan%20layanan%20undangan%20digital.', '_blank');
  };

  return (
    <footer className="bg-[#0B132B] text-stone-300 border-t border-amber-500/20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#8C6D3B] flex items-center justify-center font-serif-luxury font-bold text-base text-[#0B132B]">
                AU
              </div>
              <span className="font-serif-luxury text-xl font-bold tracking-wider text-white">
                AKSARA <span className="text-[#D4AF37]">UNDANGAN</span>
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Undangan Digital Elegan, Praktis, dan Berkesan. Platform generator undangan pernikahan terlengkap dengan pilihan tema modern, islami walimah, dan kitab kuning santri pesantren.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-300/80">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Sistem Pembayaran Otomatis &amp; Terverifikasi</span>
            </div>
          </div>

          {/* Col 2: Pilihan Paket */}
          <div className="space-y-3">
            <h4 className="font-serif-luxury text-sm font-bold text-white uppercase tracking-wider">
              Pilihan Paket
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => onNavigate('/pricing')}
                  className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  Paket HEMAT (Rp5.000)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/pricing')}
                  className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  Paket REGULER (Rp50.000) — Best Seller
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/pricing')}
                  className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  Paket VIP (Rp150.000) — Selamanya &amp; Custom
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Koleksi Template */}
          <div className="space-y-3">
            <h4 className="font-serif-luxury text-sm font-bold text-white uppercase tracking-wider">
              Koleksi Template
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={() => onNavigate('/invite/aisyah-fauzi')} className="hover:text-[#D4AF37] transition-colors">
                  Demo Modern Minimalist
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/invite/ali-fatimah')} className="hover:text-[#D4AF37] transition-colors">
                  Demo Kitab Walimah Islami
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/invite/hasan-maryam')} className="hover:text-[#D4AF37] transition-colors">
                  Demo Kitab Kuning / Santri
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/templates')} className="text-[#D4AF37] font-semibold hover:underline">
                  Jelajahi Semua Template &rarr;
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Request & Hubungi Kami */}
          <div className="space-y-3">
            <h4 className="font-serif-luxury text-sm font-bold text-white uppercase tracking-wider">
              Request Custom &amp; CS
            </h4>
            <p className="text-xs text-stone-400">
              Punya konsep atau desain khusus? Konsultasikan langsung dengan tim desainer kami melalui WhatsApp.
            </p>
            <button
              onClick={openWhatsApp}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp: 085941041089</span>
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>&copy; {new Date().getFullYear()} AKSARA UNDANGAN. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <button onClick={() => onNavigate('/admin')} className="hover:text-stone-300">
              Admin Portal
            </button>
            <span>•</span>
            <button onClick={() => onNavigate('/dashboard')} className="hover:text-stone-300">
              Customer Dashboard
            </button>
            <span>•</span>
            <span className="flex items-center gap-1 text-stone-400">
              Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> in Indonesia
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
