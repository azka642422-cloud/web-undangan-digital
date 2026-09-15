import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Heart, Music, Smartphone, Zap, Check, MessageCircle, Star, Eye } from 'lucide-react';
import { SEED_PACKAGES, SEED_TEMPLATES } from '../data/seedData';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const openWhatsApp = () => {
    window.open(
      'https://wa.me/6285941041089?text=Halo%20Admin%20Aksara%20Undangan,%20saya%20ingin%20konsultasi%20pembuatan%20undangan%20digital.',
      '_blank'
    );
  };

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#0B132B] text-white pt-16 pb-24 border-b border-amber-500/20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-[#0B132B] to-[#0B132B] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Platform Undangan Pernikahan Digital Indonesia</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-serif-luxury font-bold tracking-tight text-white leading-tight">
              Undangan Digital <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F4E8C1] to-[#C59B27]">
                Elegan, Praktis, &amp; Berkesan.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-stone-300 font-sans max-w-2xl mx-auto leading-relaxed">
              Rayakan momen sakral pernikahan Anda dengan estetika berkelas. Mulai dari paket <span className="text-amber-300 font-semibold">HEMAT Rp5.000</span>, <span className="text-amber-300 font-semibold">REGULER Rp50.000</span> dengan alunan musik syahdu, hingga keotentikan tema <span className="text-amber-300 font-semibold">Kitab Kuning Santri</span>.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                id="btn-hero-create"
                onClick={() => onNavigate('/checkout')}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#C59B27] hover:from-[#E5C158] hover:to-[#D4AF37] text-[#0B132B] font-bold text-sm rounded-xl shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <span>Buat Undangan Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="btn-hero-catalog"
                onClick={() => onNavigate('/templates')}
                className="w-full sm:w-auto px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl border border-white/20 transition-all flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4 text-amber-300" />
                <span>Lihat Katalog Template</span>
              </button>
            </div>

            {/* Micro Highlights */}
            <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center border-t border-stone-800/80 mt-12 text-xs text-stone-400">
              <div>
                <p className="font-bold text-lg text-amber-300">5 Menit</p>
                <p className="mt-0.5">Langsung Aktif Otomatis</p>
              </div>
              <div>
                <p className="font-bold text-lg text-amber-300">Mulai Rp5.000</p>
                <p className="mt-0.5">Sangat Terjangkau</p>
              </div>
              <div>
                <p className="font-bold text-lg text-amber-300">100% Mobile Ready</p>
                <p className="mt-0.5">Optimal di Smartphone Tamu</p>
              </div>
              <div>
                <p className="font-bold text-lg text-amber-300">WhatsApp 24/7</p>
                <p className="mt-0.5">Bisa Custom Template</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Templates Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold tracking-widest uppercase text-[#C59B27]">
            Koleksi Pilihan
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-stone-900">
            Pilihan Template Desain Eksklusif
          </h2>
          <p className="text-sm text-stone-600">
            Setiap template dirancang dengan proporsi tipografi yang teliti, ornamen berkelas, dan keterbacaan sempurna.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SEED_TEMPLATES.map((tpl) => (
            <div
              key={tpl.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              <div className="relative h-64 overflow-hidden bg-stone-100">
                <img
                  src={tpl.thumbnailUrl}
                  alt={tpl.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-md ${
                      tpl.category === 'gratis'
                        ? 'bg-emerald-600 text-white'
                        : tpl.category === 'reguler'
                        ? 'bg-amber-600 text-white'
                        : 'bg-[#0B132B] text-amber-300 border border-amber-400/40'
                    }`}
                  >
                    {tpl.category === 'gratis' ? 'Paket Hemat' : tpl.category === 'reguler' ? 'Reguler' : 'VIP Premium'}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xl font-serif-luxury font-bold text-stone-900">{tpl.name}</h3>
                  <p className="text-xs text-stone-600 mt-2 line-clamp-3 leading-relaxed">
                    {tpl.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {tpl.features.slice(0, 3).map((feat, i) => (
                      <span key={i} className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center gap-2">
                  <button
                    onClick={() => onNavigate(`/invite/${tpl.demoSlug}`)}
                    className="flex-1 py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" /> Preview Demo
                  </button>
                  <button
                    onClick={() => onNavigate(`/checkout?template=${tpl.slug}`)}
                    className="flex-1 py-2 px-3 bg-[#0B132B] hover:bg-[#1E232A] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Pilih Desain
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Packages Overview */}
      <section className="bg-[#FAF8F3] py-20 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold tracking-widest uppercase text-[#C59B27]">
              Transparan &amp; Fleksibel
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-stone-900">
              Pilihan Paket Undangan
            </h2>
            <p className="text-sm text-stone-600">
              Sesuaikan dengan kebutuhan acara Anda. Tanpa biaya tersembunyi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {SEED_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative ${
                  pkg.isPopular
                    ? 'bg-white border-2 border-[#D4AF37] shadow-xl md:-translate-y-2'
                    : 'bg-white border border-stone-200 shadow-sm hover:shadow-md'
                }`}
              >
                {pkg.isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#D4AF37] text-[#0B132B] text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    Paling Populer
                  </div>
                )}

                <div>
                  <div className="border-b border-stone-100 pb-5 mb-5">
                    <h3 className="text-2xl font-serif-luxury font-bold text-stone-900">{pkg.name}</h3>
                    <p className="text-xs text-stone-500 mt-1 min-h-[32px]">{pkg.description}</p>
                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-[#0B132B]">
                        Rp{pkg.price.toLocaleString('id-ID')}
                      </span>
                      {pkg.originalPrice && (
                        <span className="text-xs text-stone-400 line-through">
                          Rp{pkg.originalPrice.toLocaleString('id-ID')}
                        </span>
                      )}
                    </div>
                  </div>

                  <ul className="space-y-3 text-xs text-stone-600">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8">
                  <button
                    onClick={() => onNavigate(`/checkout?package=${pkg.slug}`)}
                    className={`w-full py-3 rounded-xl text-xs font-bold transition-all shadow-sm ${
                      pkg.isPopular
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#C59B27] hover:from-[#E5C158] hover:to-[#D4AF37] text-[#0B132B]'
                        : 'bg-[#0B132B] hover:bg-[#1E232A] text-white'
                    }`}
                  >
                    Pilih {pkg.name}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Flow Diagram */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold tracking-widest uppercase text-[#C59B27]">
            Alur Pemesanan Cepat
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-stone-900">
            Cara Mudah Membuat Undangan Digital
          </h2>
          <p className="text-sm text-stone-600">
            Hanya butuh 5 langkah sederhana dari pemilihan paket hingga link siap dibagikan ke WhatsApp tamu.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-center">
          <div className="p-6 bg-white rounded-2xl border border-stone-200 space-y-2">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center mx-auto text-sm">
              1
            </div>
            <h4 className="font-bold text-sm text-stone-900">Pilih Paket</h4>
            <p className="text-xs text-stone-500">Pilih paket Hemat (Rp5k), Reguler (Rp50k), atau VIP (Rp150k).</p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-stone-200 space-y-2">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center mx-auto text-sm">
              2
            </div>
            <h4 className="font-bold text-sm text-stone-900">Pilih Template</h4>
            <p className="text-xs text-stone-500">Pilih tema Minimalist, Walimah, atau Kitab Kuning Santri.</p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-stone-200 space-y-2">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center mx-auto text-sm">
              3
            </div>
            <h4 className="font-bold text-sm text-stone-900">Isi Data Acara</h4>
            <p className="text-xs text-stone-500">Nama pengantin, orang tua, tanggal, lokasi, dan rekening hadiah.</p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-stone-200 space-y-2">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center mx-auto text-sm">
              4
            </div>
            <h4 className="font-bold text-sm text-stone-900">Bayar Otomatis</h4>
            <p className="text-xs text-stone-500">Bayar instan via QRIS, Virtual Account BCA, atau GoPay.</p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-stone-200 space-y-2">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center mx-auto text-sm">
              5
            </div>
            <h4 className="font-bold text-sm text-stone-900">Sebar Undangan</h4>
            <p className="text-xs text-stone-500">Undangan otomatis aktif! Salin link dan bagikan ke tamu.</p>
          </div>
        </div>
      </section>

      {/* WhatsApp Custom Template Request Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#0B132B] via-[#111D4A] to-[#0B132B] text-white rounded-3xl p-8 sm:p-12 border border-amber-400/30 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-3 text-center md:text-left">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">
              Layanan Prioritas &amp; Custom Desain
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif-luxury font-bold">
              Punya Konsep Adat atau Tema Impian Sendiri?
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
              Hubungi langsung admin kami via WhatsApp di <span className="font-bold text-amber-300">085941041089</span>. Kami melayani request custom template adat Nusantara, font khusus, hingga aransemen musik instrumen favorit.
            </p>
          </div>

          <button
            onClick={openWhatsApp}
            className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all transform hover:scale-105 flex items-center gap-2 whitespace-nowrap"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat WhatsApp Admin: 085941041089</span>
          </button>
        </div>
      </section>
    </div>
  );
};
