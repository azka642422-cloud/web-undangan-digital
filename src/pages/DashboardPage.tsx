import React, { useState } from 'react';
import { Invitation, Order } from '../types';
import { appStorage } from '../services/storage';
import {
  LayoutDashboard,
  Heart,
  Calendar,
  Image as ImageIcon,
  Music,
  Users,
  Copy,
  ExternalLink,
  Save,
  CheckCircle2,
  Eye,
  Shield,
  Trash2,
  Share2,
  Sparkles,
} from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (path: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const currentUser = appStorage.getCurrentUser();
  const invitations = appStorage.getInvitations();
  const orders = appStorage.getOrders();

  // Find an invitation for this user (or fallback to demo if none)
  const [selectedInvitationId, setSelectedInvitationId] = useState<string>(
    invitations[0]?.id || ''
  );

  const [activeTab, setActiveTab] = useState<
    'overview' | 'couple' | 'events' | 'music_gift' | 'rsvp' | 'orders'
  >('overview');

  const currentInvitation = invitations.find((inv) => inv.id === selectedInvitationId) || invitations[0];

  // Editable states for the active invitation
  const [coupleData, setCoupleData] = useState(currentInvitation ? { ...currentInvitation.couple } : null);
  const [eventsData, setEventsData] = useState(currentInvitation ? [...currentInvitation.events] : []);
  const [musicUrl, setMusicUrl] = useState(currentInvitation?.musicUrl || '');
  const [isPublished, setIsPublished] = useState(currentInvitation?.isPublished ?? true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [guestNameTest, setGuestNameTest] = useState('Bapak H. Rahmat & Keluarga');

  if (!currentInvitation || !coupleData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold font-serif-luxury text-stone-800">Belum Ada Undangan</h2>
        <p className="text-xs text-stone-500">Anda belum memiliki undangan aktif. Silakan lakukan pemesanan.</p>
        <button
          onClick={() => onNavigate('/checkout')}
          className="px-6 py-3 bg-[#0B132B] text-white text-xs font-bold rounded-xl"
        >
          Buat Undangan Sekarang
        </button>
      </div>
    );
  }

  const handleSaveData = () => {
    appStorage.updateInvitation(currentInvitation.id, {
      couple: coupleData,
      events: eventsData,
      musicUrl,
      isPublished,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const fullShareUrl = `${window.location.origin}/invite/${currentInvitation.slug}`;
  const personalizedUrl = `${fullShareUrl}?to=${encodeURIComponent(guestNameTest)}`;

  const rsvps = currentInvitation.rsvps || [];
  const guestMessages = currentInvitation.guestMessages || [];

  const totalAttending = rsvps.filter((r) => r.attendance === 'hadir').length;
  const totalGuests = rsvps.reduce(
    (sum, r) => sum + (r.attendance === 'hadir' ? r.guestCount : 0),
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <span className="text-xs font-bold tracking-widest uppercase text-[#C59B27]">
            Dashboard Pelanggan
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-stone-900 mt-1">
            Undangan {coupleData.groomName} &amp; {coupleData.brideName}
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Paket:{' '}
            <span className="font-bold text-stone-800 uppercase bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
              {currentInvitation.packageSlug}
            </span>{' '}
            • Status:{' '}
            <span
              className={`font-bold ${
                isPublished ? 'text-emerald-700 bg-emerald-50' : 'text-stone-600 bg-stone-100'
              } px-2 py-0.5 rounded`}
            >
              {isPublished ? 'Online & Terbit' : 'Draft'}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate(`/invite/${currentInvitation.slug}`)}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors border border-stone-300"
          >
            <Eye className="w-3.5 h-3.5" /> Preview
          </button>
          <button
            onClick={handleSaveData}
            className="px-5 py-2 bg-gradient-to-r from-[#D4AF37] to-[#C59B27] text-[#0B132B] text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm hover:from-[#E5C158] hover:to-[#D4AF37] transition-all"
          >
            <Save className="w-3.5 h-3.5" /> Simpan Perubahan
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Perubahan data undangan berhasil disimpan ke sistem!</span>
        </div>
      )}

      {/* Tabs Menu */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-200 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all ${
            activeTab === 'overview'
              ? 'bg-[#0B132B] text-white'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5" /> Ringkasan &amp; URL
        </button>
        <button
          onClick={() => setActiveTab('couple')}
          className={`px-4 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all ${
            activeTab === 'couple'
              ? 'bg-[#0B132B] text-white'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Heart className="w-3.5 h-3.5" /> Data Mempelai
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`px-4 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all ${
            activeTab === 'events'
              ? 'bg-[#0B132B] text-white'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" /> Jadwal Acara &amp; Maps
        </button>
        <button
          onClick={() => setActiveTab('music_gift')}
          className={`px-4 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all ${
            activeTab === 'music_gift'
              ? 'bg-[#0B132B] text-white'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Music className="w-3.5 h-3.5" /> Musik &amp; Amplop
        </button>
        <button
          onClick={() => setActiveTab('rsvp')}
          className={`px-4 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all ${
            activeTab === 'rsvp'
              ? 'bg-[#0B132B] text-white'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Users className="w-3.5 h-3.5" /> RSVP &amp; Ucapan ({currentInvitation.guestMessages.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all ${
            activeTab === 'orders'
              ? 'bg-[#0B132B] text-white'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Shield className="w-3.5 h-3.5" /> Riwayat Order &amp; Invoice
        </button>
      </div>

      {/* TAB 1: OVERVIEW & URL GENERATOR */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* URL Sharing Card */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-serif-luxury font-bold text-lg text-stone-900 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-[#C59B27]" /> Bagikan Undangan ke WhatsApp Tamu
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Standalone URL */}
              <div className="space-y-2 text-xs">
                <label className="font-bold text-stone-700 block">Link Publik Standar:</label>
                <div className="flex items-center gap-2 p-3 bg-stone-50 border border-stone-200 rounded-xl font-mono">
                  <span className="truncate flex-1 text-stone-800">{fullShareUrl}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(fullShareUrl);
                      alert('Link disalin ke clipboard!');
                    }}
                    className="p-1.5 bg-stone-200 hover:bg-stone-300 rounded text-stone-700"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Generator Nama Tamu (?to=Nama+Tamu) */}
              <div className="space-y-2 text-xs">
                <label className="font-bold text-stone-700 block">
                  Generate Link Khusus Nama Tamu (Personalized):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={guestNameTest}
                    onChange={(e) => setGuestNameTest(e.target.value)}
                    placeholder="Ketik Nama Tamu (misal: Bpk. Bambang & Istri)"
                    className="px-3 py-2 border border-stone-300 rounded-xl text-xs flex-1"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(personalizedUrl);
                      alert(`Link khusus untuk "${guestNameTest}" berhasil disalin!`);
                    }}
                    className="px-3 py-2 bg-[#0B132B] hover:bg-[#1E232A] text-white rounded-xl text-xs font-bold flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" /> Salin Link
                  </button>
                </div>
                <p className="text-[11px] text-stone-500 font-mono truncate">
                  Hasil: {personalizedUrl}
                </p>
              </div>
            </div>

            {/* Quick Share to WhatsApp */}
            <div className="pt-2">
              <button
                onClick={() => {
                  const text = encodeURIComponent(
                    `Kepada Yth. ${guestNameTest},\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami:\n\n${coupleData.groomFullName} & ${coupleData.brideFullName}\n\nInfo lengkap & konfirmasi kehadiran:\n${personalizedUrl}\n\nMerupakan suatu kehormatan dan kebahagiaan bagi kami apabila berkenan hadir.\n\nTerima kasih.`
                  );
                  window.open(`https://wa.me/?text=${text}`, '_blank');
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
              >
                <span>Bagikan Langsung ke WhatsApp Tamu</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 text-center">
              <span className="text-xs text-stone-500">Total Tamu Konfirmasi Hadir</span>
              <p className="text-3xl font-bold text-emerald-700 mt-1">{totalGuests} Orang</p>
              <span className="text-[11px] text-stone-400">({totalAttending} Responden)</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 text-center">
              <span className="text-xs text-stone-500">Ucapan &amp; Doa Masuk</span>
              <p className="text-3xl font-bold text-amber-600 mt-1">
                {currentInvitation.guestMessages.length} Pesan
              </p>
              <span className="text-[11px] text-stone-400">Dari sanak famili &amp; sahabat</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 text-center">
              <span className="text-xs text-stone-500">Status Publikasi</span>
              <div className="mt-2 flex items-center justify-center gap-2">
                <button
                  onClick={() => setIsPublished(!isPublished)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    isPublished
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {isPublished ? '● Publik (Bisa Diakses)' : '○ Non-Aktif (Draft)'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EDIT COUPLE DATA */}
      {activeTab === 'couple' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 space-y-6">
          <h3 className="font-serif-luxury font-bold text-xl text-stone-900 pb-2 border-b border-stone-100">
            Edit Profil Mempelai &amp; Orang Tua
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
            {/* Groom Edit */}
            <div className="space-y-3 bg-stone-50 p-5 rounded-2xl border border-stone-200">
              <span className="font-bold text-stone-800 text-sm block">Mempelai Pria</span>
              <div>
                <label className="block font-semibold mb-1">Nama Panggilan</label>
                <input
                  type="text"
                  value={coupleData.groomName}
                  onChange={(e) => setCoupleData({ ...coupleData, groomName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Nama Lengkap &amp; Gelar</label>
                <input
                  type="text"
                  value={coupleData.groomFullName}
                  onChange={(e) => setCoupleData({ ...coupleData, groomFullName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Nama Ayah</label>
                <input
                  type="text"
                  value={coupleData.groomFather}
                  onChange={(e) => setCoupleData({ ...coupleData, groomFather: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Nama Ibu</label>
                <input
                  type="text"
                  value={coupleData.groomMother}
                  onChange={(e) => setCoupleData({ ...coupleData, groomMother: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">URL Foto Mempelai Pria</label>
                <input
                  type="text"
                  value={coupleData.groomPhotoUrl || ''}
                  onChange={(e) => setCoupleData({ ...coupleData, groomPhotoUrl: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-white font-mono text-[11px]"
                />
              </div>
            </div>

            {/* Bride Edit */}
            <div className="space-y-3 bg-stone-50 p-5 rounded-2xl border border-stone-200">
              <span className="font-bold text-stone-800 text-sm block">Mempelai Wanita</span>
              <div>
                <label className="block font-semibold mb-1">Nama Panggilan</label>
                <input
                  type="text"
                  value={coupleData.brideName}
                  onChange={(e) => setCoupleData({ ...coupleData, brideName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Nama Lengkap &amp; Gelar</label>
                <input
                  type="text"
                  value={coupleData.brideFullName}
                  onChange={(e) => setCoupleData({ ...coupleData, brideFullName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Nama Ayah</label>
                <input
                  type="text"
                  value={coupleData.brideFather}
                  onChange={(e) => setCoupleData({ ...coupleData, brideFather: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Nama Ibu</label>
                <input
                  type="text"
                  value={coupleData.brideMother}
                  onChange={(e) => setCoupleData({ ...coupleData, brideMother: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">URL Foto Mempelai Wanita</label>
                <input
                  type="text"
                  value={coupleData.bridePhotoUrl || ''}
                  onChange={(e) => setCoupleData({ ...coupleData, bridePhotoUrl: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-white font-mono text-[11px]"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSaveData}
            className="px-6 py-2.5 bg-[#0B132B] text-white rounded-xl text-xs font-bold"
          >
            Simpan Perubahan
          </button>
        </div>
      )}

      {/* TAB 3: EDIT EVENTS & MAPS */}
      {activeTab === 'events' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 space-y-6">
          <h3 className="font-serif-luxury font-bold text-xl text-stone-900 pb-2 border-b border-stone-100">
            Edit Rangkaian Acara, Waktu &amp; Google Maps
          </h3>

          <div className="space-y-4">
            {eventsData.map((evt, idx) => (
              <div key={evt.id} className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3 text-xs">
                <span className="font-bold text-sm text-stone-800">Acara #{idx + 1}: {evt.title}</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Nama Acara</label>
                    <input
                      type="text"
                      value={evt.title}
                      onChange={(e) => {
                        const copy = [...eventsData];
                        copy[idx].title = e.target.value;
                        setEventsData(copy);
                      }}
                      className="w-full px-3 py-2 border rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Tanggal</label>
                    <input
                      type="date"
                      value={evt.date}
                      onChange={(e) => {
                        const copy = [...eventsData];
                        copy[idx].date = e.target.value;
                        setEventsData(copy);
                      }}
                      className="w-full px-3 py-2 border rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Jam Acara</label>
                    <input
                      type="text"
                      value={`${evt.startTime} - ${evt.endTime}`}
                      onChange={(e) => {
                        const copy = [...eventsData];
                        const parts = e.target.value.split('-');
                        copy[idx].startTime = parts[0]?.trim() || '';
                        copy[idx].endTime = parts[1]?.trim() || '';
                        setEventsData(copy);
                      }}
                      className="w-full px-3 py-2 border rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Nama Tempat / Gedung</label>
                    <input
                      type="text"
                      value={evt.venueName}
                      onChange={(e) => {
                        const copy = [...eventsData];
                        copy[idx].venueName = e.target.value;
                        setEventsData(copy);
                      }}
                      className="w-full px-3 py-2 border rounded-lg bg-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-semibold mb-1">Alamat Lengkap</label>
                    <input
                      type="text"
                      value={evt.venueAddress}
                      onChange={(e) => {
                        const copy = [...eventsData];
                        copy[idx].venueAddress = e.target.value;
                        setEventsData(copy);
                      }}
                      className="w-full px-3 py-2 border rounded-lg bg-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-semibold mb-1">Link Google Maps</label>
                    <input
                      type="text"
                      value={evt.mapsUrl || ''}
                      onChange={(e) => {
                        const copy = [...eventsData];
                        copy[idx].mapsUrl = e.target.value;
                        setEventsData(copy);
                      }}
                      className="w-full px-3 py-2 border rounded-lg bg-white font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleSaveData}
            className="px-6 py-2.5 bg-[#0B132B] text-white rounded-xl text-xs font-bold"
          >
            Simpan Perubahan Acara
          </button>
        </div>
      )}

      {/* TAB 4: MUSIC & WEDDING GIFT */}
      {activeTab === 'music_gift' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 space-y-6">
          <h3 className="font-serif-luxury font-bold text-xl text-stone-900 pb-2 border-b border-stone-100">
            Pengaturan Musik &amp; Amplop Digital
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold mb-1 text-stone-700">
                Background Music Audio URL (.mp3):
              </label>
              <input
                type="text"
                value={musicUrl}
                onChange={(e) => setMusicUrl(e.target.value)}
                placeholder="https://.../music.mp3"
                className="w-full px-3 py-2 border rounded-lg font-mono"
              />
              <p className="text-[11px] text-stone-500 mt-1">
                Catatan: Untuk paket HEMAT, musik akan dinonaktifkan secara otomatis.
              </p>
            </div>
          </div>

          <button
            onClick={handleSaveData}
            className="px-6 py-2.5 bg-[#0B132B] text-white rounded-xl text-xs font-bold"
          >
            Simpan Pengaturan
          </button>
        </div>
      )}

      {/* TAB 5: RSVP & GUEST MESSAGES */}
      {activeTab === 'rsvp' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <h3 className="font-serif-luxury font-bold text-xl text-stone-900">
              Daftar Ucapan &amp; Doa Tamu ({currentInvitation.guestMessages.length})
            </h3>
            <span className="text-xs text-stone-500">Auto-sanitized &amp; spam-protected</span>
          </div>

          <div className="space-y-3">
            {currentInvitation.guestMessages.map((msg) => (
              <div
                key={msg.id}
                className="p-4 bg-stone-50 border border-stone-200 rounded-2xl flex items-start justify-between gap-4 text-xs"
              >
                <div>
                  <span className="font-bold text-stone-900 text-sm">{msg.senderName}</span>
                  <span className="text-[10px] text-stone-400 ml-2">
                    {new Date(msg.createdAt).toLocaleString('id-ID')}
                  </span>
                  <p className="text-stone-700 mt-1 text-xs leading-relaxed">{msg.message}</p>
                </div>

                <button
                  onClick={() => {
                    if (confirm('Hapus ucapan ini?')) {
                      appStorage.deleteMessage(currentInvitation.id, msg.id);
                      alert('Pesan dihapus.');
                    }
                  }}
                  className="p-1.5 text-stone-400 hover:text-rose-600 rounded"
                  title="Hapus Ucapan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: ORDERS & INVOICE */}
      {activeTab === 'orders' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 space-y-6">
          <h3 className="font-serif-luxury font-bold text-xl text-stone-900 pb-2 border-b border-stone-100">
            Riwayat Pesanan &amp; Invoice
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase font-semibold">
                <tr>
                  <th className="p-3">No. Order</th>
                  <th className="p-3">Tanggal</th>
                  <th className="p-3">Paket</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Metode</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {orders.map((ord) => (
                  <tr key={ord.id}>
                    <td className="p-3 font-mono font-bold text-stone-900">{ord.orderNumber}</td>
                    <td className="p-3 text-stone-500">
                      {new Date(ord.createdAt).toLocaleDateString('id-ID')}
                    </td>
                    <td className="p-3 font-semibold">{ord.packageSlug}</td>
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
                    <td className="p-3 uppercase font-mono text-[10px] text-stone-500">
                      {ord.paymentMethod}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
