import React from 'react';
import { Sparkles, ArrowRight, CheckCircle2, Smartphone, CreditCard, Share2, HelpCircle } from 'lucide-react';

interface HowItWorksPageProps {
  onNavigate: (path: string) => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onNavigate }) => {
  const steps = [
    {
      num: '01',
      title: 'Pilih Paket & Template',
      desc: 'Tentukan paket yang sesuai dengan budget Anda (Hemat Rp5.000, Reguler Rp50.000, atau VIP Rp150.000) dan pilih desain tema yang Anda sukai.',
      icon: Sparkles,
    },
    {
      num: '02',
      title: 'Isi Data Pernikahan',
      desc: 'Masukkan data calon mempelai, nama orang tua, jadwal akad nikah & resepsi, link Google Maps, rekening tanda kasih, serta foto prewedding.',
      icon: Smartphone,
    },
    {
      num: '03',
      title: 'Checkout & Pembayaran Aman',
      desc: 'Sistem menyediakan pembayaran otomatis via QRIS (GoPay, OVO, Dana, ShopeePay), Virtual Account BCA, atau Bank Syariah.',
      icon: CreditCard,
    },
    {
      num: '04',
      title: 'Otomatis Aktif & Dashboard',
      desc: 'Begitu pembayaran terverifikasi, sistem otomatis men-generate undangan dan mengaktifkan URL. Anda dapat mengedit data kapan saja di Dashboard.',
      icon: CheckCircle2,
    },
    {
      num: '05',
      title: 'Sebarkan ke Tamu Undangan',
      desc: 'Gunakan fitur personalisasi nama tamu (?to=Nama+Tamu) dan bagikan langsung ke WhatsApp sahabat dan sanak famili.',
      icon: Share2,
    },
  ];

  const faqs = [
    {
      q: 'Berapa lama proses pembuatan undangan digital?',
      a: 'Kurang dari 5 menit! Sistem kami sepenuhnya otomatis. Setelah Anda mengisi data dan melakukan pembayaran, undangan langsung aktif seketika.',
    },
    {
      q: 'Apakah saya masih bisa mengubah data setelah pembayaran?',
      a: 'Tentu saja! Anda memiliki akses penuh ke Dashboard Pelanggan untuk mengubah tanggal, waktu acara, foto galeri, nomor rekening, hingga melihat rekap RSVP tamu.',
    },
    {
      q: 'Bagaimana cara menambahkan nama tamu pada undangan?',
      a: 'Sangat mudah. Anda cukup menambahkan format "?to=Nama+Tamu" di akhir URL undangan (contoh: aksaraundangan.com/invite/aisyah-fauzi?to=Bpk+Rahmat). Nama tamu akan otomatis muncul di cover undangan.',
    },
    {
      q: 'Apakah musik otomatis berputar saat tamu membuka link?',
      a: 'Sesuai dengan kebijakan privasi browser modern dan kenyamanan tamu, musik akan berputar begitu tamu menekan tombol "Buka Undangan" atau ikon musik floating di layar.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold tracking-widest uppercase text-[#C59B27]">
          Panduan Lengkap
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif-luxury font-bold text-stone-900">
          Cara Pemesanan &amp; Pembuatan
        </h1>
        <p className="text-sm text-stone-600">
          Langkah mudah dan praktis mewujudkan undangan digital impian Anda tanpa ribet coding ataupun menunggu berhari-hari.
        </p>
      </div>

      {/* Step Sequence */}
      <div className="space-y-6">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className="p-6 sm:p-8 bg-white rounded-3xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-6 hover:shadow-md transition-all"
            >
              <div className="w-16 h-16 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center shrink-0">
                <span className="font-serif-luxury text-2xl font-bold text-[#C59B27]">{step.num}</span>
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-[#C59B27]" />
                  <h3 className="text-lg font-serif-luxury font-bold text-stone-900">{step.title}</h3>
                </div>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">{step.desc}</p>
              </div>

              <div className="hidden sm:block">
                <span className="text-xs font-bold text-stone-300">Langkah {idx + 1} / 5</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* FAQ Section */}
      <div className="space-y-8 pt-6">
        <div className="text-center space-y-2">
          <HelpCircle className="w-6 h-6 mx-auto text-[#C59B27]" />
          <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-stone-900">
            Pertanyaan yang Sering Diajukan (FAQ)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {faqs.map((faq, i) => (
            <div key={i} className="p-6 bg-[#FAF7F0] border border-amber-300/30 rounded-2xl space-y-2">
              <h4 className="font-bold text-sm text-stone-900">{faq.q}</h4>
              <p className="text-xs text-stone-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center pt-8">
        <button
          onClick={() => onNavigate('/checkout')}
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#C59B27] text-[#0B132B] font-bold text-sm rounded-xl shadow-lg transition-all transform hover:scale-105"
        >
          <span>Mulai Buat Undangan Sekarang</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
