import React, { useState } from 'react';
import { appStorage } from '../services/storage';
import { OrderStatus, Template, Package, Coupon, MusicTrack, TemplateRequest } from '../types';
import {
  LayoutDashboard,
  ShoppingCart,
  CreditCard,
  Users,
  Scroll,
  Layers,
  Tag,
  Music,
  MessageSquare,
  FileCheck,
  Settings,
  ShieldAlert,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Trash2,
  Plus,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';

interface AdminDashboardPageProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const [activeMenu, setActiveMenu] = useState<
    | 'dashboard'
    | 'orders'
    | 'invitations'
    | 'templates'
    | 'packages'
    | 'music'
    | 'template_requests'
    | 'rsvp_messages'
    | 'coupons'
    | 'settings'
  >('dashboard');

  const orders = appStorage.getOrders();
  const invitations = appStorage.getInvitations();
  const templates = appStorage.getTemplates();
  const packages = appStorage.getPackages();
  const coupons = appStorage.getCoupons();
  const musicLibrary = appStorage.getMusicLibrary();
  const templateRequests = appStorage.getTemplateRequests();

  // Metrics
  const totalRevenue = orders
    .filter((o) => o.status === 'PAID')
    .reduce((sum, o) => sum + o.finalAmount, 0);
  const paidOrdersCount = orders.filter((o) => o.status === 'PAID').length;
  const activeInvitationsCount = invitations.filter((i) => i.isPublished).length;

  // Change Order Status handler
  const handleOrderStatusChange = (orderId: string, newStatus: OrderStatus) => {
    appStorage.updateOrderStatus(orderId, newStatus);
    alert(`Status order diperbarui menjadi ${newStatus}`);
  };

  // Toggle Invitation Status
  const handleToggleInvitation = (invitationId: string, current: boolean) => {
    appStorage.updateInvitation(invitationId, { isPublished: !current });
    alert(`Status publikasi undangan berhasil diubah.`);
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#0B132B] text-white p-4 space-y-6 shrink-0 border-r border-amber-500/20">
        <div className="flex items-center gap-3 px-2 py-3 border-b border-stone-800">
          <div className="w-8 h-8 rounded-lg bg-[#D4AF37] text-[#0B132B] font-bold flex items-center justify-center text-sm font-serif-luxury">
            AU
          </div>
          <div>
            <span className="font-serif-luxury font-bold text-sm block text-white">AKSARA ADMIN</span>
            <span className="text-[10px] text-amber-300 font-mono">SUPERADMIN PANEL</span>
          </div>
        </div>

        {/* Menu Navigation */}
        <nav className="space-y-1 text-xs font-semibold">
          <button
            onClick={() => setActiveMenu('dashboard')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all ${
              activeMenu === 'dashboard'
                ? 'bg-[#D4AF37] text-[#0B132B] font-bold shadow-md'
                : 'text-stone-300 hover:bg-white/10'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard &amp; Revenue</span>
          </button>

          <button
            onClick={() => setActiveMenu('orders')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all ${
              activeMenu === 'orders'
                ? 'bg-[#D4AF37] text-[#0B132B] font-bold shadow-md'
                : 'text-stone-300 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShoppingCart className="w-4 h-4" />
              <span>Orders &amp; Payments</span>
            </div>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">{orders.length}</span>
          </button>

          <button
            onClick={() => setActiveMenu('invitations')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all ${
              activeMenu === 'invitations'
                ? 'bg-[#D4AF37] text-[#0B132B] font-bold shadow-md'
                : 'text-stone-300 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Scroll className="w-4 h-4" />
              <span>Invitations (Aktif/Off)</span>
            </div>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">{invitations.length}</span>
          </button>

          <button
            onClick={() => setActiveMenu('templates')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all ${
              activeMenu === 'templates'
                ? 'bg-[#D4AF37] text-[#0B132B] font-bold shadow-md'
                : 'text-stone-300 hover:bg-white/10'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Templates</span>
          </button>

          <button
            onClick={() => setActiveMenu('packages')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all ${
              activeMenu === 'packages'
                ? 'bg-[#D4AF37] text-[#0B132B] font-bold shadow-md'
                : 'text-stone-300 hover:bg-white/10'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Packages &amp; Pricing</span>
          </button>

          <button
            onClick={() => setActiveMenu('music')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all ${
              activeMenu === 'music'
                ? 'bg-[#D4AF37] text-[#0B132B] font-bold shadow-md'
                : 'text-stone-300 hover:bg-white/10'
            }`}
          >
            <Music className="w-4 h-4" />
            <span>Music Library</span>
          </button>

          <button
            onClick={() => setActiveMenu('template_requests')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all ${
              activeMenu === 'template_requests'
                ? 'bg-[#D4AF37] text-[#0B132B] font-bold shadow-md'
                : 'text-stone-300 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-4 h-4" />
              <span>Template Requests</span>
            </div>
            <span className="text-[10px] bg-amber-400 text-stone-900 font-bold px-1.5 py-0.5 rounded">
              {templateRequests.length}
            </span>
          </button>

          <button
            onClick={() => setActiveMenu('rsvp_messages')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all ${
              activeMenu === 'rsvp_messages'
                ? 'bg-[#D4AF37] text-[#0B132B] font-bold shadow-md'
                : 'text-stone-300 hover:bg-stone-800'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>RSVP &amp; Moderasi Ucapan</span>
          </button>

          <button
            onClick={() => setActiveMenu('coupons')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all ${
              activeMenu === 'coupons'
                ? 'bg-[#D4AF37] text-[#0B132B] font-bold shadow-md'
                : 'text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Kupon &amp; Promo</span>
          </button>

          <button
            onClick={() => setActiveMenu('settings')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all ${
              activeMenu === 'settings'
                ? 'bg-[#D4AF37] text-[#0B132B] font-bold shadow-md'
                : 'text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Settings &amp; Payment Gateway</span>
          </button>
        </nav>

        <div className="pt-6 border-t border-stone-800">
          <button
            onClick={() => onNavigate('/')}
            className="w-full text-xs text-stone-400 hover:text-white text-left px-3 py-2"
          >
            &larr; Keluar ke Website Publik
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto max-w-7xl">
        {/* VIEW 1: DASHBOARD METRICS */}
        {activeMenu === 'dashboard' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-serif-luxury font-bold text-stone-900">
                Dashboard Overview &amp; Finansial
              </h1>
              <p className="text-xs text-stone-500">
                Laporan transaksi, status aktivasi undangan pernikahan, dan analitik pendapatan.
              </p>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-1">
                <span className="text-xs text-stone-500 font-semibold uppercase">Total Pendapatan</span>
                <p className="text-2xl font-bold text-stone-900">
                  Rp{totalRevenue.toLocaleString('id-ID')}
                </p>
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> Terverifikasi Masuk
                </span>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-1">
                <span className="text-xs text-stone-500 font-semibold uppercase">Order Berhasil</span>
                <p className="text-2xl font-bold text-emerald-700">{paidOrdersCount} Transaksi</p>
                <span className="text-[11px] text-stone-400">Status PAID</span>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-1">
                <span className="text-xs text-stone-500 font-semibold uppercase">Undangan Aktif</span>
                <p className="text-2xl font-bold text-amber-700">{activeInvitationsCount} Online</p>
                <span className="text-[11px] text-stone-400">Dapat diakses publik</span>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-1">
                <span className="text-xs text-stone-500 font-semibold uppercase">Request Template</span>
                <p className="text-2xl font-bold text-blue-700">{templateRequests.length} Permintaan</p>
                <span className="text-[11px] text-stone-400">Via WhatsApp / Form</span>
              </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs space-y-4 p-6">
              <h2 className="font-serif-luxury font-bold text-lg text-stone-900">
                Pesanan Terbaru (Real-Time)
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-stone-50 text-stone-600 uppercase font-semibold border-b">
                    <tr>
                      <th className="p-3">Order #</th>
                      <th className="p-3">Pelanggan</th>
                      <th className="p-3">Paket</th>
                      <th className="p-3">Nominal</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {orders.slice(0, 5).map((ord) => (
                      <tr key={ord.id}>
                        <td className="p-3 font-mono font-bold">{ord.orderNumber}</td>
                        <td className="p-3">
                          <p className="font-bold text-stone-900">{ord.userName}</p>
                          <p className="text-stone-400 text-[10px]">{ord.userEmail}</p>
                        </td>
                        <td className="p-3 font-semibold uppercase">{ord.packageSlug}</td>
                        <td className="p-3 font-bold">Rp{ord.finalAmount.toLocaleString('id-ID')}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              ord.status === 'PAID'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {ord.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => setActiveMenu('orders')}
                            className="text-stone-700 hover:text-stone-900 underline font-semibold"
                          >
                            Kelola
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: ORDERS MANAGEMENT */}
        {activeMenu === 'orders' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-serif-luxury font-bold text-stone-900">
                Kelola Pesanan &amp; Pembayaran
              </h1>
              <p className="text-xs text-stone-500">
                Verifikasi manual, ubah status pembayaran (PAID, PENDING, CANCELLED), atau kirim webhook simulasi.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-50 text-stone-600 uppercase font-semibold border-b">
                  <tr>
                    <th className="p-4">No. Order</th>
                    <th className="p-4">Pelanggan &amp; Kontak</th>
                    <th className="p-4">Paket &amp; Template</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Status Saat Ini</th>
                    <th className="p-4">Ubah Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {orders.map((ord) => (
                    <tr key={ord.id}>
                      <td className="p-4 font-mono font-bold text-stone-900">
                        {ord.orderNumber}
                        <span className="block text-[10px] text-stone-400 font-normal">
                          {new Date(ord.createdAt).toLocaleDateString('id-ID')}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="font-bold">{ord.userName}</p>
                        <p className="text-stone-500 text-[11px]">{ord.userPhone}</p>
                        <p className="text-stone-400 text-[10px]">{ord.userEmail}</p>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-amber-800">{ord.packageSlug}</span>
                        <span className="block text-[11px] text-stone-500">{ord.templateSlug}</span>
                      </td>
                      <td className="p-4 font-bold text-sm">
                        Rp{ord.finalAmount.toLocaleString('id-ID')}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded text-xs font-bold ${
                            ord.status === 'PAID'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ord.status === 'PENDING'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <select
                          value={ord.status}
                          onChange={(e) =>
                            handleOrderStatusChange(ord.id, e.target.value as OrderStatus)
                          }
                          className="px-2.5 py-1.5 border border-stone-300 rounded-lg text-xs font-semibold bg-white"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="PAID">PAID (Otomatis Aktif)</option>
                          <option value="CANCELLED">CANCELLED</option>
                          <option value="EXPIRED">EXPIRED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 3: INVITATIONS MANAGEMENT */}
        {activeMenu === 'invitations' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-serif-luxury font-bold text-stone-900">
                Kelola Undangan Pernikahan (Aktivasi / Non-Aktifkan)
              </h1>
              <p className="text-xs text-stone-500">
                Kontrol publikasi link undangan pelanggan secara real-time.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {invitations.map((inv) => (
                <div
                  key={inv.id}
                  className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-stone-900">
                        {inv.couple.groomName} &amp; {inv.couple.brideName}
                      </span>
                      <span className="text-[10px] uppercase font-bold bg-stone-100 px-2 py-0.5 rounded text-stone-700">
                        {inv.packageSlug}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5 font-mono">
                      aksaraundangan.com/invite/{inv.slug}
                    </p>
                    <p className="text-[11px] text-stone-400 mt-1">
                      Template: <span className="font-semibold text-stone-700">{inv.templateSlug}</span> •{' '}
                      {inv.rsvps?.length || 0} Konfirmasi RSVP • {inv.guestMessages?.length || 0} Ucapan Tamu
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onNavigate(`/invite/${inv.slug}`)}
                      className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> Buka
                    </button>
                    <button
                      onClick={() => handleToggleInvitation(inv.id, inv.isPublished)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        inv.isPublished
                          ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {inv.isPublished ? 'Matikan (Unpublish)' : 'Aktifkan (Publish)'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 4: TEMPLATES MANAGEMENT */}
        {activeMenu === 'templates' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-serif-luxury font-bold text-stone-900">
                  Kelola Katalog Template
                </h1>
                <p className="text-xs text-stone-500">
                  Daftar template terdaftar pada template engine registry.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {templates.map((tpl) => (
                <div key={tpl.id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
                  <img src={tpl.thumbnailUrl} alt={tpl.name} className="h-40 w-full object-cover" />
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#C59B27]">
                        {tpl.category}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          tpl.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        {tpl.isActive ? 'Aktif' : 'Non-Aktif'}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-stone-900">{tpl.name}</h4>
                    <p className="text-xs text-stone-500 line-clamp-2">{tpl.description}</p>
                    <div className="pt-2 border-t flex gap-2">
                      <button
                        onClick={() => onNavigate(`/invite/${tpl.demoSlug}`)}
                        className="flex-1 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg"
                      >
                        Preview Demo
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 5: PACKAGES & PRICING */}
        {activeMenu === 'packages' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-serif-luxury font-bold text-stone-900">
                Paket &amp; Pengaturan Harga
              </h1>
              <p className="text-xs text-stone-500">
                Daftar paket aktif: HEMAT (Rp5.000), REGULER (Rp50.000), VIP (Rp150.000).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <div key={pkg.id} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                  <span className="text-xs font-bold text-[#C59B27] uppercase">{pkg.slug}</span>
                  <h3 className="text-xl font-bold text-stone-900">{pkg.name}</h3>
                  <p className="text-3xl font-bold text-stone-900">
                    Rp{pkg.price.toLocaleString('id-ID')}
                  </p>
                  <ul className="space-y-1 text-xs text-stone-600">
                    {pkg.features.map((f, i) => (
                      <li key={i}>• {f}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 6: MUSIC LIBRARY */}
        {activeMenu === 'music' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-serif-luxury font-bold text-stone-900">
                Pustaka Musik Latar (Music Library)
              </h1>
              <p className="text-xs text-stone-500">
                Lagu instrumen pernikahan bebas royalti yang dapat dipilih oleh pelanggan Reguler &amp; VIP.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-50 text-stone-600 uppercase font-semibold border-b">
                  <tr>
                    <th className="p-3">Judul Lagu</th>
                    <th className="p-3">Artis</th>
                    <th className="p-3">Kategori</th>
                    <th className="p-3">Audio Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {musicLibrary.map((m) => (
                    <tr key={m.id}>
                      <td className="p-3 font-bold text-stone-900">{m.title}</td>
                      <td className="p-3 text-stone-600">{m.artist}</td>
                      <td className="p-3 uppercase font-mono text-[10px] text-amber-800">{m.genre}</td>
                      <td className="p-3 font-mono text-[11px] text-stone-500 truncate max-w-xs">
                        {m.audioUrl}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 7: TEMPLATE REQUESTS */}
        {activeMenu === 'template_requests' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-serif-luxury font-bold text-stone-900">
                Permintaan Template Custom (CS / WhatsApp)
              </h1>
              <p className="text-xs text-stone-500">
                Permintaan tema khusus dari calon pengantin (Adat Jawa, Sunda, Minang, dll).
              </p>
            </div>

            <div className="space-y-3">
              {templateRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-stone-900">{req.customerName}</span>
                      <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded">
                        {req.preferredStyle}
                      </span>
                    </div>
                    <p className="text-stone-600">{req.requestDetails}</p>
                    <p className="text-stone-400 text-[11px]">
                      WhatsApp: <span className="font-bold text-stone-700">{req.customerPhone}</span>
                    </p>
                  </div>

                  <a
                    href={`https://wa.me/${req.customerPhone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold whitespace-nowrap"
                  >
                    Hubungi via WA
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 8: RSVP & GUESTBOOK MODERATION */}
        {activeMenu === 'rsvp_messages' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-serif-luxury font-bold text-stone-900">
                Moderasi Ucapan &amp; RSVP Tamu
              </h1>
              <p className="text-xs text-stone-500">
                Hapus ucapan spam atau tidak pantas dari seluruh undangan yang beredar.
              </p>
            </div>

            <div className="space-y-3">
              {invitations.flatMap((inv) =>
                (inv.guestMessages || []).map((msg) => (
                  <div
                    key={msg.id}
                    className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-start justify-between gap-4 text-xs"
                  >
                    <div>
                      <span className="font-bold text-stone-900">{msg.senderName}</span>
                      <span className="text-[10px] text-stone-400 ml-2">
                        Pada undangan: {inv.couple.groomName} &amp; {inv.couple.brideName}
                      </span>
                      <p className="text-stone-700 mt-1">{msg.message}</p>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm('Hapus pesan ucapan ini?')) {
                          appStorage.deleteMessage(inv.id, msg.id);
                          alert('Ucapan dihapus.');
                        }
                      }}
                      className="p-1.5 text-stone-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* VIEW 9: COUPONS */}
        {activeMenu === 'coupons' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-serif-luxury font-bold text-stone-900">
                Manajemen Kode Kupon &amp; Promo
              </h1>
              <p className="text-xs text-stone-500">
                Daftar voucher diskon aktif: BERKAH10, AKSARABARU.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-50 text-stone-600 uppercase font-semibold border-b">
                  <tr>
                    <th className="p-3">Kode Kupon</th>
                    <th className="p-3">Tipe Diskon</th>
                    <th className="p-3">Besaran</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {coupons.map((c) => (
                    <tr key={c.code}>
                      <td className="p-3 font-mono font-bold text-sm text-stone-900">{c.code}</td>
                      <td className="p-3 uppercase font-semibold">{c.discountType}</td>
                      <td className="p-3 font-bold">
                        {c.discountType === 'percentage' ? `${c.discountValue}%` : `Rp${c.discountValue}`}
                      </td>
                      <td className="p-3">
                        <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">
                          Aktif
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 10: SETTINGS */}
        {activeMenu === 'settings' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-serif-luxury font-bold text-stone-900">
                Konfigurasi Sistem &amp; Payment Gateway
              </h1>
              <p className="text-xs text-stone-500">
                Payment abstraction layer dan kontak operasional WhatsApp.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4 text-xs">
              <h3 className="font-bold text-stone-800 text-sm">Payment Gateway Abstraction</h3>
              <p className="text-stone-600">
                Platform menggunakan modul terisolasi <code className="bg-stone-100 px-1 py-0.5 rounded font-mono">PaymentGateway</code> interface.
              </p>
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-300 text-stone-800 space-y-1">
                <p className="font-bold">Mode Aktif: MockPaymentGateway (Sandbox Instant Webhook)</p>
                <p className="text-[11px] text-stone-600">
                  Adapter MidtransPaymentGateway telah siap digunakan untuk production tanpa membocorkan server key di client-side.
                </p>
              </div>

              <div className="pt-2">
                <p className="font-bold text-stone-800">Nomor WhatsApp CS / Desain:</p>
                <p className="font-mono text-stone-700 text-sm mt-0.5">085941041089</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
