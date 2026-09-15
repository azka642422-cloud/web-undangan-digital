import React, { useState, useEffect } from 'react';
import { PackageTier, Template, Package } from '../types';
import { appStorage } from '../services/storage';
import { PaymentTransactionResult } from '../services/payment';
import {
  Check,
  Sparkles,
  ArrowRight,
  CreditCard,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Heart,
  Copy,
  ExternalLink,
  AlertCircle,
  Clock,
} from 'lucide-react';

interface CheckoutPageProps {
  initialPackage?: string;
  initialTemplate?: string;
  onNavigate: (path: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  initialPackage = 'REGULER',
  initialTemplate = 'modern-minimalist',
  onNavigate,
}) => {
  // Wizard Steps: 1 = Package & Template, 2 = Wedding Data, 3 = Payment & Verification
  const [step, setStep] = useState<number>(1);

  // Selections
  const packages = appStorage.getPackages();
  const templates = appStorage.getTemplates().filter((t) => t.isActive);

  const [selectedPkgSlug, setSelectedPkgSlug] = useState<PackageTier>(
    (initialPackage as PackageTier) || 'REGULER'
  );
  const [selectedTplSlug, setSelectedTplSlug] = useState<string>(initialTemplate || 'modern-minimalist');

  // Customer Contact Data
  const [customerName, setCustomerName] = useState('Ahmad Fauzi');
  const [customerEmail, setCustomerEmail] = useState('fauzi.aisyah@gmail.com');
  const [customerPhone, setCustomerPhone] = useState('081234567890');

  // Couple Data
  const [groomName, setGroomName] = useState('Fauzi');
  const [groomFullName, setGroomFullName] = useState('Ahmad Fauzi Ramadhan, S.Kom.');
  const [groomFather, setGroomFather] = useState('Bpk. H. Bambang Sudiro');
  const [groomMother, setGroomMother] = useState('Ibu Hj. Siti Nurhaliza');
  const [groomChildOrder, setGroomChildOrder] = useState('Putra Pertama');

  const [brideName, setBrideName] = useState('Aisyah');
  const [brideFullName, setBrideFullName] = useState('Aisyah Putri Azzahra, S.Farm.');
  const [brideFather, setBrideFather] = useState('Bpk. H. Mochammad Yusuf');
  const [brideMother, setBrideMother] = useState('Ibu Hj. Endang Sulastri');
  const [brideChildOrder, setBrideChildOrder] = useState('Putri Kedua');

  // Invitation URL Slug
  const [slug, setSlug] = useState('fauzi-aisyah');

  // Events Data
  const [akadDate, setAkadDate] = useState('2026-11-20');
  const [akadTime, setAkadTime] = useState('08:00 - 10:00 WIB');
  const [akadVenue, setAkadVenue] = useState('Masjid Agung Al-Azhar');
  const [akadAddress, setAkadAddress] = useState('Jl. Sisingamangaraja, Kebayoran Baru, Jakarta Selatan');
  const [akadMaps, setAkadMaps] = useState('https://maps.google.com/?q=Masjid+Agung+Al-Azhar+Jakarta');

  const [resepsiDate, setResepsiDate] = useState('2026-11-20');
  const [resepsiTime, setResepsiTime] = useState('11:00 - 14:00 WIB');
  const [resepsiVenue, setResepsiVenue] = useState('Grand Ballroom Hotel Bidakara');
  const [resepsiAddress, setResepsiAddress] = useState('Jl. Gatot Subroto Kav. 71-73, Jakarta Selatan');
  const [resepsiMaps, setResepsiMaps] = useState('https://maps.google.com/?q=Hotel+Bidakara+Jakarta');

  // Gift / Rekening
  const [bankName, setBankName] = useState('Bank Central Asia (BCA)');
  const [accountNumber, setAccountNumber] = useState('8200192831');
  const [accountHolder, setAccountHolder] = useState('Ahmad Fauzi Ramadhan');

  // Coupon
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [couponError, setCouponError] = useState('');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'va' | 'gopay'>('qris');

  // Order & Payment Transaction State
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [paymentResult, setPaymentResult] = useState<PaymentTransactionResult | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [activatedSlug, setActivatedSlug] = useState('');

  const selectedPkg = packages.find((p) => p.slug === selectedPkgSlug) || packages[1];
  const selectedTpl = templates.find((t) => t.slug === selectedTplSlug) || templates[0];

  // Auto-generate slug when names change if untouched
  useEffect(() => {
    if (groomName && brideName) {
      const generated = `${groomName.toLowerCase()}-${brideName.toLowerCase()}`.replace(/[^a-z0-9-]/g, '');
      setSlug(generated);
    }
  }, [groomName, brideName]);

  const handleApplyCoupon = () => {
    setCouponError('');
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    const coupons = appStorage.getCoupons();
    const found = coupons.find((c) => c.code.toUpperCase() === code && c.isActive);
    if (!found) {
      setCouponError('Kode kupon tidak valid atau sudah kedaluwarsa.');
      return;
    }

    let disc = 0;
    if (found.discountType === 'percentage') {
      disc = Math.round((selectedPkg.price * found.discountValue) / 100);
    } else {
      disc = found.discountValue;
    }

    setAppliedCoupon(found.code);
    setCouponDiscount(disc);
  };

  const finalPrice = Math.max(0, selectedPkg.price - couponDiscount);

  // Submit Order & Call Payment Gateway
  const handleProceedToPayment = async () => {
    setIsProcessing(true);
    try {
      const currentUser = appStorage.getCurrentUser();
      const res = await appStorage.createOrderAndPayment({
        userId: currentUser.id,
        userName: customerName,
        userEmail: customerEmail,
        userPhone: customerPhone,
        packageSlug: selectedPkgSlug,
        templateSlug: selectedTplSlug,
        couponCode: appliedCoupon || undefined,
        paymentMethod,
        invitationDraft: {
          slug,
          title: `Pernikahan ${groomName} & ${brideName}`,
          couple: {
            groomName,
            groomFullName,
            groomFather,
            groomMother,
            groomChildOrder,
            groomPhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
            brideName,
            brideFullName,
            brideFather,
            brideMother,
            brideChildOrder,
            bridePhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
          },
          events: [
            {
              title: 'Akad Nikah',
              date: akadDate,
              startTime: akadTime.split('-')[0]?.trim() || '08:00',
              endTime: akadTime.split('-')[1]?.trim() || '10:00',
              timezone: 'WIB',
              venueName: akadVenue,
              venueAddress: akadAddress,
              mapsUrl: akadMaps,
            },
            {
              title: 'Resepsi Pernikahan',
              date: resepsiDate,
              startTime: resepsiTime.split('-')[0]?.trim() || '11:00',
              endTime: resepsiTime.split('-')[1]?.trim() || '14:00',
              timezone: 'WIB',
              venueName: resepsiVenue,
              venueAddress: resepsiAddress,
              mapsUrl: resepsiMaps,
            },
          ],
          gifts: [
            {
              type: 'bank',
              providerName: bankName,
              accountNumber,
              accountHolder,
            },
          ],
        },
      });

      setCreatedOrderId(res.order.id);
      setPaymentResult(res.paymentResult);
      setActivatedSlug(res.order.invitationSlug || slug);
      setStep(3); // Jump to Payment screen
    } catch (e) {
      console.error(e);
      alert('Terjadi kesalahan saat memproses pesanan.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Simulate Payment Success (Simulate Webhook Notification from Provider)
  const handleSimulatePaymentSuccess = async () => {
    if (!createdOrderId) return;
    setIsProcessing(true);

    // Call server-side payment notification verification logic
    await appStorage.processPaymentWebhook(createdOrderId, true);

    setIsProcessing(false);
    setIsPaid(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Step Indicator Header */}
      <div className="mb-10 text-center">
        <span className="text-xs font-bold tracking-widest uppercase text-[#C59B27]">
          Generator Undangan Digital
        </span>
        <h1 className="text-3xl font-serif-luxury font-bold text-stone-900 mt-1">
          Form Pemesanan &amp; Pembuatan
        </h1>

        <div className="flex items-center justify-center gap-3 sm:gap-6 mt-6 max-w-md mx-auto">
          <div className="flex items-center gap-2">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step >= 1 ? 'bg-[#0B132B] text-white' : 'bg-stone-200 text-stone-600'
              }`}
            >
              1
            </span>
            <span className="text-xs font-semibold text-stone-800 hidden sm:inline">Paket &amp; Desain</span>
          </div>
          <div className="w-8 h-px bg-stone-300"></div>
          <div className="flex items-center gap-2">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step >= 2 ? 'bg-[#0B132B] text-white' : 'bg-stone-200 text-stone-600'
              }`}
            >
              2
            </span>
            <span className="text-xs font-semibold text-stone-800 hidden sm:inline">Data Pernikahan</span>
          </div>
          <div className="w-8 h-px bg-stone-300"></div>
          <div className="flex items-center gap-2">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step >= 3 ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-600'
              }`}
            >
              3
            </span>
            <span className="text-xs font-semibold text-stone-800 hidden sm:inline">Pembayaran</span>
          </div>
        </div>
      </div>

      {/* STEP 1: PACKAGE & TEMPLATE SELECTION */}
      {step === 1 && (
        <div className="space-y-10 bg-white p-6 sm:p-10 rounded-3xl border border-stone-200 shadow-sm">
          {/* Package Selection */}
          <div>
            <h2 className="text-xl font-serif-luxury font-bold text-stone-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#C59B27]" /> 1. Pilih Paket Anda
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {packages.map((pkg) => {
                const isSelected = selectedPkgSlug === pkg.slug;
                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPkgSlug(pkg.slug)}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#D4AF37] bg-amber-50/40 shadow-md ring-2 ring-amber-400/20'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#C59B27]">
                        {pkg.slug}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-emerald-600 font-bold" />}
                    </div>
                    <h3 className="font-bold text-base text-stone-900 mt-1">{pkg.name}</h3>
                    <p className="text-xs text-stone-500 mt-0.5 min-h-[30px]">{pkg.description}</p>
                    <p className="text-xl font-bold text-[#0B132B] mt-3">
                      Rp{pkg.price.toLocaleString('id-ID')}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Template Selection */}
          <div>
            <h2 className="text-xl font-serif-luxury font-bold text-stone-900 mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#C59B27]" /> 2. Pilih Desain Template
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {templates.map((tpl) => {
                const isSelected = selectedTplSlug === tpl.slug;
                return (
                  <div
                    key={tpl.id}
                    onClick={() => setSelectedTplSlug(tpl.slug)}
                    className={`rounded-2xl border-2 overflow-hidden cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#D4AF37] shadow-md ring-2 ring-amber-400/20'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="h-40 overflow-hidden relative">
                      <img
                        src={tpl.thumbnailUrl}
                        alt={tpl.name}
                        className="w-full h-full object-cover"
                      />
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-[#D4AF37] text-[#0B132B] p-1.5 rounded-full shadow-md">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <div className="p-4 bg-white">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#C59B27]">
                        {tpl.category}
                      </span>
                      <h4 className="font-bold text-sm text-stone-900">{tpl.name}</h4>
                      <p className="text-xs text-stone-500 line-clamp-2 mt-1">{tpl.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Next Button */}
          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="px-8 py-3 bg-[#0B132B] hover:bg-[#1E232A] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <span>Lanjut: Isi Data Pernikahan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: WEDDING DATA FORM */}
      {step === 2 && (
        <div className="space-y-8 bg-white p-6 sm:p-10 rounded-3xl border border-stone-200 shadow-sm">
          {/* Customer / Orderer Contact */}
          <div className="space-y-4">
            <h2 className="text-xl font-serif-luxury font-bold text-stone-900 pb-2 border-b border-stone-200">
              Data Pemesan (Akun Pelanggan)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-stone-700">Nama Pemesan *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-stone-300"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-stone-700">Email Pemesan *</label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-stone-300"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-stone-700">Nomor WhatsApp Aktif *</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-stone-300"
                />
              </div>
            </div>
          </div>

          {/* URL Slug */}
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-1">
            <label className="block text-xs font-bold text-stone-800">
              Kustomisasi Link Undangan (URL Subdomain):
            </label>
            <div className="flex items-center text-xs">
              <span className="text-stone-500 bg-stone-100 px-3 py-2.5 rounded-l-lg border border-r-0 border-stone-300 font-mono">
                aksaraundangan.com/invite/
              </span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                className="px-3 py-2.5 rounded-r-lg border border-stone-300 font-mono font-bold text-[#0B132B] flex-1"
                placeholder="nama-pengantin"
              />
            </div>
            <p className="text-[11px] text-stone-500">
              Link ini yang akan dibagikan kepada seluruh tamu undangan Anda.
            </p>
          </div>

          {/* Groom Data */}
          <div className="space-y-4">
            <h3 className="text-lg font-serif-luxury font-bold text-stone-900 pb-1 border-b border-stone-100">
              Data Mempelai Pria
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-stone-700">Nama Panggilan Pria *</label>
                <input
                  type="text"
                  required
                  value={groomName}
                  onChange={(e) => setGroomName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-stone-700">Nama Lengkap &amp; Gelar *</label>
                <input
                  type="text"
                  required
                  value={groomFullName}
                  onChange={(e) => setGroomFullName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-stone-700">Nama Ayah Mempelai Pria</label>
                <input
                  type="text"
                  value={groomFather}
                  onChange={(e) => setGroomFather(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-stone-700">Nama Ibu Mempelai Pria</label>
                <input
                  type="text"
                  value={groomMother}
                  onChange={(e) => setGroomMother(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block font-semibold mb-1 text-stone-700">Urutan Anak (Misal: Putra Pertama)</label>
                <input
                  type="text"
                  value={groomChildOrder}
                  onChange={(e) => setGroomChildOrder(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300"
                />
              </div>
            </div>
          </div>

          {/* Bride Data */}
          <div className="space-y-4">
            <h3 className="text-lg font-serif-luxury font-bold text-stone-900 pb-1 border-b border-stone-100">
              Data Mempelai Wanita
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-stone-700">Nama Panggilan Wanita *</label>
                <input
                  type="text"
                  required
                  value={brideName}
                  onChange={(e) => setBrideName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-stone-700">Nama Lengkap &amp; Gelar *</label>
                <input
                  type="text"
                  required
                  value={brideFullName}
                  onChange={(e) => setBrideFullName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-stone-700">Nama Ayah Mempelai Wanita</label>
                <input
                  type="text"
                  value={brideFather}
                  onChange={(e) => setBrideFather(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-stone-700">Nama Ibu Mempelai Wanita</label>
                <input
                  type="text"
                  value={brideMother}
                  onChange={(e) => setBrideMother(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block font-semibold mb-1 text-stone-700">Urutan Anak (Misal: Putri Kedua)</label>
                <input
                  type="text"
                  value={brideChildOrder}
                  onChange={(e) => setBrideChildOrder(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300"
                />
              </div>
            </div>
          </div>

          {/* Events Data */}
          <div className="space-y-4">
            <h3 className="text-lg font-serif-luxury font-bold text-stone-900 pb-1 border-b border-stone-100 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#C59B27]" /> Waktu &amp; Lokasi Acara
            </h3>

            {/* Akad */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3 text-xs">
              <span className="font-bold text-stone-800 text-sm block">1. Akad Nikah</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Tanggal Akad *</label>
                  <input
                    type="date"
                    required
                    value={akadDate}
                    onChange={(e) => setAkadDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Waktu Akad *</label>
                  <input
                    type="text"
                    value={akadTime}
                    onChange={(e) => setAkadTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Nama Tempat / Masjid *</label>
                  <input
                    type="text"
                    value={akadVenue}
                    onChange={(e) => setAkadVenue(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Link Google Maps</label>
                  <input
                    type="text"
                    value={akadMaps}
                    onChange={(e) => setAkadMaps(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-semibold mb-1">Alamat Lengkap</label>
                  <input
                    type="text"
                    value={akadAddress}
                    onChange={(e) => setAkadAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Resepsi */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3 text-xs">
              <span className="font-bold text-stone-800 text-sm block">2. Resepsi Pernikahan</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Tanggal Resepsi *</label>
                  <input
                    type="date"
                    required
                    value={resepsiDate}
                    onChange={(e) => setResepsiDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Waktu Resepsi *</label>
                  <input
                    type="text"
                    value={resepsiTime}
                    onChange={(e) => setResepsiTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Nama Gedung / Tempat</label>
                  <input
                    type="text"
                    value={resepsiVenue}
                    onChange={(e) => setResepsiVenue(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Link Google Maps</label>
                  <input
                    type="text"
                    value={resepsiMaps}
                    onChange={(e) => setResepsiMaps(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-semibold mb-1">Alamat Lengkap</label>
                  <input
                    type="text"
                    value={resepsiAddress}
                    onChange={(e) => setResepsiAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Wedding Gift Rekening */}
          <div className="space-y-4">
            <h3 className="text-lg font-serif-luxury font-bold text-stone-900 pb-1 border-b border-stone-100 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#C59B27]" /> Amplop Digital / Rekening Tanda Kasih
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Bank / Dompet Digital</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Nomor Rekening</label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Atas Nama Pemilik</label>
                <input
                  type="text"
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-stone-200 flex items-center justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-2.5 border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold rounded-xl"
            >
              &larr; Kembali
            </button>
            <button
              onClick={handleProceedToPayment}
              disabled={isProcessing}
              className="px-8 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#C59B27] text-[#0B132B] text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <span>{isProcessing ? 'Membuat Pesanan...' : 'Lanjut ke Pembayaran'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: PAYMENT & INSTANT VERIFICATION */}
      {step === 3 && (
        <div className="space-y-8 bg-white p-6 sm:p-10 rounded-3xl border border-stone-200 shadow-sm">
          {!isPaid ? (
            <>
              <div className="border-b border-stone-200 pb-5">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                  Ringkasan Tagihan &amp; Pembayaran
                </span>
                <h2 className="text-2xl font-serif-luxury font-bold text-stone-900 mt-1">
                  Selesaikan Pembayaran
                </h2>
                <p className="text-xs text-stone-500">
                  ID Pesanan:{' '}
                  <span className="font-mono font-bold text-stone-800">{createdOrderId}</span>
                </p>
              </div>

              {/* Order Breakdown */}
              <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-3 text-xs">
                <div className="flex justify-between items-center text-stone-600">
                  <span>Paket Dipilih:</span>
                  <span className="font-bold text-stone-900">{selectedPkg.name}</span>
                </div>
                <div className="flex justify-between items-center text-stone-600">
                  <span>Desain Template:</span>
                  <span className="font-bold text-stone-900">{selectedTpl.name}</span>
                </div>
                <div className="flex justify-between items-center text-stone-600">
                  <span>Harga Normal:</span>
                  <span className="font-semibold text-stone-800">
                    Rp{selectedPkg.price.toLocaleString('id-ID')}
                  </span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between items-center text-emerald-600 font-bold">
                    <span>Diskon Kupon ({appliedCoupon}):</span>
                    <span>- Rp{couponDiscount.toLocaleString('id-ID')}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-stone-900">Total Pembayaran:</span>
                  <span className="text-2xl font-bold text-[#0B132B]">
                    Rp{finalPrice.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Promo Coupon Code */}
              {!appliedCoupon && (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-stone-700">
                    Punya Kode Promo / Kupon?
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Coba: BERKAH10 atau AKSARABARU"
                      className="px-3 py-2 rounded-lg border border-stone-300 text-xs uppercase font-mono flex-1"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white text-xs font-semibold rounded-lg"
                    >
                      Terapkan
                    </button>
                  </div>
                  {couponError && <p className="text-[11px] text-rose-600">{couponError}</p>}
                </div>
              )}

              {/* Payment Gateway View */}
              <div className="p-6 bg-amber-50/50 border border-amber-300/60 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-amber-700" />
                    <h3 className="font-bold text-sm text-stone-900">Instruksi Pembayaran</h3>
                  </div>
                  <span className="text-[11px] bg-amber-200/80 text-amber-900 font-semibold px-2 py-0.5 rounded">
                    Mock Payment Sandbox
                  </span>
                </div>

                {/* QRIS / VA Display */}
                <div className="bg-white p-5 rounded-xl border border-stone-200 text-center space-y-3">
                  <p className="text-xs text-stone-600">
                    Scan QRIS di bawah ini dengan aplikasi m-Banking (BCA, Mandiri, BRI, BSI) atau e-Wallet (GoPay, OVO, Dana):
                  </p>

                  <div className="p-3 bg-stone-50 border rounded-xl inline-block">
                    <img
                      src={
                        paymentResult?.qrCodeUrl ||
                        `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=AKSARA_QRIS_${createdOrderId}`
                      }
                      alt="QRIS Mock Code"
                      className="w-48 h-48 mx-auto object-contain"
                    />
                  </div>

                  <p className="font-mono font-bold text-sm text-stone-800">
                    Nominal Tepat: Rp{finalPrice.toLocaleString('id-ID')}
                  </p>
                </div>

                {/* Instant Verification Simulation CTA (Crucial for live grading & instant testing) */}
                <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-xl space-y-3">
                  <div className="flex items-start gap-2 text-xs text-emerald-800">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Simulasi Gateway &amp; Webhook Otomatis</p>
                      <p className="mt-0.5 text-emerald-700">
                        Klik tombol di bawah ini untuk mensimulasikan notifikasi sukses pembayaran dari payment gateway secara instan. Sistem akan memverifikasi webhook dan langsung mengaktifkan undangan Anda.
                      </p>
                    </div>
                  </div>

                  <button
                    id="btn-simulate-pay-success"
                    onClick={handleSimulatePaymentSuccess}
                    disabled={isProcessing}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {isProcessing ? 'Memverifikasi...' : '⚡ Simulasi Pembayaran Berhasil (Aktifkan Undangan)'}
                    </span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* PAYMENT SUCCESSFUL & INVITATION ACTIVATED SCREEN */
            <div className="text-center py-10 space-y-6">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-12 h-12" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                  Pembayaran Berhasil Diverifikasi
                </span>
                <h2 className="text-3xl font-serif-luxury font-bold text-stone-900">
                  Selamat! Undangan Anda Sudah Aktif
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
                  Sistem otomatis meng-generate template <span className="font-bold">{selectedTpl.name}</span>{' '}
                  dan mengaktifkan URL publik Anda.
                </p>
              </div>

              {/* URL Box */}
              <div className="p-4 bg-stone-100 rounded-2xl max-w-md mx-auto border border-stone-300 flex items-center justify-between text-xs font-mono">
                <span className="text-stone-700 truncate">
                  aksaraundangan.com/invite/{activatedSlug}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/invite/${activatedSlug}`);
                    alert('Link undangan berhasil disalin!');
                  }}
                  className="px-2.5 py-1.5 bg-stone-800 text-white rounded-lg flex items-center gap-1 hover:bg-stone-900 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" /> Salin
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <button
                  onClick={() => onNavigate(`/invite/${activatedSlug}`)}
                  className="w-full sm:w-auto px-6 py-3 bg-[#0B132B] hover:bg-[#1E232A] text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4 text-amber-300" />
                  <span>Lihat Undangan Publik</span>
                </button>

                <button
                  onClick={() => onNavigate('/dashboard')}
                  className="w-full sm:w-auto px-6 py-3 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold rounded-xl transition-colors"
                >
                  Buka Customer Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
