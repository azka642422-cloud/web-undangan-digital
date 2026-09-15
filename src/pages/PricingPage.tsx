import React from 'react';
import { Check, X, Sparkles, MessageCircle, ShieldCheck } from 'lucide-react';
import { SEED_PACKAGES } from '../data/seedData';

interface PricingPageProps {
  onNavigate: (path: string) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onNavigate }) => {
  const openWhatsApp = () => {
    window.open('https://wa.me/6285941041089?text=Halo%20Admin%20Aksara%20Undangan,%20saya%20ingin%20tanya%20detail%20paket%20undangan.', '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold tracking-widest uppercase text-[#C59B27]">
          Paket &amp; Investasi Pernikahan
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif-luxury font-bold text-stone-900">
          Transparan, Tanpa Biaya Tersembunyi
        </h1>
        <p className="text-sm text-stone-600">
          Semua paket sudah mencakup countdown, Google Maps navigasi, amplop digital/rekening hadiah, RSVP interaktif, dan ucapan tamu.
        </p>
      </div>

      {/* Main Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {SEED_PACKAGES.map((pkg) => (
          <div
            key={pkg.id}
            className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative ${
              pkg.slug === 'REGULER'
                ? 'bg-white border-2 border-[#D4AF37] shadow-xl md:-translate-y-2 ring-4 ring-amber-400/10'
                : 'bg-white border border-stone-200 shadow-sm hover:shadow-md'
            }`}
          >
            {pkg.slug === 'REGULER' && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#D4AF37] text-[#0B132B] text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-sm">
                Terlaris / Best Value
              </div>
            )}

            <div>
              <div className="border-b border-stone-100 pb-5 mb-5">
                <span className="text-xs font-bold uppercase tracking-widest text-[#C59B27]">
                  {pkg.slug}
                </span>
                <h3 className="text-2xl font-serif-luxury font-bold text-stone-900 mt-1">{pkg.name}</h3>
                <p className="text-xs text-stone-500 mt-1">{pkg.description}</p>

                <div className="mt-5 flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-[#0B132B]">
                    Rp{pkg.price.toLocaleString('id-ID')}
                  </span>
                  {pkg.originalPrice && (
                    <span className="text-xs text-stone-400 line-through">
                      Rp{pkg.originalPrice.toLocaleString('id-ID')}
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-stone-500 mt-1">
                  Masa aktif:{' '}
                  <span className="font-bold text-stone-700">
                    {pkg.activeDurationMonths ? `${pkg.activeDurationMonths} Bulan` : 'Selamanya (Tidak Kedaluwarsa)'}
                  </span>
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold text-stone-800 uppercase tracking-wider">Fitur Unggulan:</p>
                <ul className="space-y-2.5 text-xs text-stone-600">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-8">
              <button
                onClick={() => onNavigate(`/checkout?package=${pkg.slug}`)}
                className={`w-full py-3.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                  pkg.slug === 'REGULER'
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

      {/* Feature Comparison Table */}
      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
        <div className="p-6 bg-stone-50 border-b border-stone-200">
          <h3 className="text-xl font-serif-luxury font-bold text-stone-900 text-center sm:text-left">
            Tabel Perbandingan Fitur Detail
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-stone-100/70 border-b border-stone-200 text-stone-700 uppercase font-semibold">
              <tr>
                <th className="p-4">Fitur Undangan</th>
                <th className="p-4 text-center">HEMAT (Rp5.000)</th>
                <th className="p-4 text-center">REGULER (Rp50.000)</th>
                <th className="p-4 text-center">VIP (Rp150.000)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              <tr>
                <td className="p-4 font-semibold">Pilihan Template</td>
                <td className="p-4 text-center">Kategori Gratis</td>
                <td className="p-4 text-center">Semua Reguler &amp; Gratis</td>
                <td className="p-4 text-center font-bold text-amber-700">Seluruh VIP &amp; Kitab Kuning</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold">Animasi &amp; Transisi Halus</td>
                <td className="p-4 text-center text-stone-400">Static (Tanpa Animasi)</td>
                <td className="p-4 text-center text-emerald-600 font-bold">Animasi Halus</td>
                <td className="p-4 text-center text-emerald-600 font-bold">Animasi Halus &amp; Efek Kitab</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold">Background Musik</td>
                <td className="p-4 text-center text-rose-500 font-medium">Tanpa Musik</td>
                <td className="p-4 text-center text-emerald-600 font-bold">Tersedia (Pilih Musik)</td>
                <td className="p-4 text-center text-emerald-600 font-bold">Tersedia &amp; Request Lagu Bebas</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold">Masa Aktif URL</td>
                <td className="p-4 text-center">3 Bulan</td>
                <td className="p-4 text-center">3 Bulan</td>
                <td className="p-4 text-center font-bold text-emerald-700">Selamanya (Tidak Kedaluwarsa)</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold">Galeri Foto</td>
                <td className="p-4 text-center text-stone-400">1 Foto Utama</td>
                <td className="p-4 text-center">Hingga 10 Foto</td>
                <td className="p-4 text-center font-bold text-emerald-700">Foto Tanpa Batas</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold">Request Custom Template</td>
                <td className="p-4 text-center text-stone-300">—</td>
                <td className="p-4 text-center text-stone-300">—</td>
                <td className="p-4 text-center text-emerald-600 font-bold">Bisa Request Custom</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold">Dukungan Prioritas CS</td>
                <td className="p-4 text-center text-stone-400">Standar</td>
                <td className="p-4 text-center">Standar</td>
                <td className="p-4 text-center text-emerald-600 font-bold">Prioritas WhatsApp VIP</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Consultation Banner */}
      <div className="text-center p-8 bg-[#FAF7F0] border border-amber-300/40 rounded-3xl space-y-4 max-w-2xl mx-auto">
        <h4 className="text-xl font-serif-luxury font-bold text-stone-900">
          Masih Bingung Memilih Paket yang Tepat?
        </h4>
        <p className="text-xs text-stone-600">
          Konsultasikan jadwal acara dan kebutuhan tema Anda dengan tim kami via WhatsApp.
        </p>
        <button
          onClick={openWhatsApp}
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Chat WhatsApp CS: 085941041089</span>
        </button>
      </div>
    </div>
  );
};
