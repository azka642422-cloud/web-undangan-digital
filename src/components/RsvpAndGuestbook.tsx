import React, { useState } from 'react';
import { Rsvp, GuestMessage } from '../types';
import { Send, CheckCircle2, MessageSquare, Share2, Users, HeartHandshake } from 'lucide-react';

interface RsvpAndGuestbookProps {
  invitationId: string;
  rsvps?: Rsvp[];
  guestMessages?: GuestMessage[];
  theme?: 'modern' | 'walimah' | 'kitab-kuning';
  guestNameParam?: string;
  invitationUrl?: string;
  coupleNames?: string;
  onSubmitRsvp?: (rsvp: Omit<Rsvp, 'id' | 'invitationId' | 'createdAt'>) => Promise<boolean>;
  onSubmitMessage?: (msg: Omit<GuestMessage, 'id' | 'invitationId' | 'isApproved' | 'createdAt'>) => Promise<boolean>;
}

export const RsvpAndGuestbook: React.FC<RsvpAndGuestbookProps> = ({
  rsvps = [],
  guestMessages = [],
  theme = 'modern',
  guestNameParam = '',
  invitationUrl = '',
  coupleNames = 'Mempelai',
  onSubmitRsvp,
  onSubmitMessage,
}) => {
  // RSVP Form State
  const [rsvpName, setRsvpName] = useState(guestNameParam);
  const [attendance, setAttendance] = useState<'hadir' | 'tidak_hadir' | 'ragu'>('hadir');
  const [guestCount, setGuestCount] = useState<number>(1);
  const [rsvpNotes, setRsvpNotes] = useState('');
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [rsvpLoading, setRsvpLoading] = useState(false);

  // Guestbook State
  const [msgName, setMsgName] = useState(guestNameParam);
  const [relationship, setRelationship] = useState('');
  const [message, setMessage] = useState('');
  const [msgLoading, setMsgLoading] = useState(false);
  const [msgSuccess, setMsgSuccess] = useState(false);
  const [copyShareSuccess, setCopyShareSuccess] = useState(false);

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim()) return;
    setRsvpLoading(true);

    if (onSubmitRsvp) {
      const ok = await onSubmitRsvp({
        guestName: rsvpName,
        attendance,
        guestCount,
        notes: rsvpNotes,
      });
      if (ok) setRsvpSubmitted(true);
    } else {
      setRsvpSubmitted(true);
    }
    setRsvpLoading(false);
  };

  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgName.trim() || !message.trim()) return;
    setMsgLoading(true);

    if (onSubmitMessage) {
      const ok = await onSubmitMessage({
        senderName: msgName,
        relationship,
        attendance,
        message,
      });
      if (ok) {
        setMsgSuccess(true);
        setMessage('');
        setTimeout(() => setMsgSuccess(false), 3000);
      }
    } else {
      setMsgSuccess(true);
      setMessage('');
    }
    setMsgLoading(false);
  };

  const shareToWhatsapp = () => {
    const text = encodeURIComponent(
      `Assalamu'alaikum Warahmatullahi Wabarakatuh.\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Anda untuk menghadiri pernikahan kami:\n${coupleNames}\n\nLihat undangan lengkap di sini:\n${invitationUrl || window.location.href}\n\nMerupakan suatu kehormatan bagi kami atas kehadiran dan doa restu Anda.`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(invitationUrl || window.location.href);
    setCopyShareSuccess(true);
    setTimeout(() => setCopyShareSuccess(false), 2000);
  };

  const isKitab = theme === 'kitab-kuning';
  const isWalimah = theme === 'walimah';

  return (
    <div className="my-10 px-4 max-w-lg mx-auto space-y-8">
      {/* RSVP Form */}
      <div
        className={`p-6 rounded-2xl border shadow-sm ${
          isKitab
            ? 'bg-[#F4E8C1] border-[#755B39] text-[#3D2C15]'
            : isWalimah
            ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-50'
            : 'bg-white border-stone-200 text-stone-900'
        }`}
      >
        <div className="text-center mb-5">
          <HeartHandshake className={`w-7 h-7 mx-auto mb-1 ${isWalimah ? 'text-amber-300' : 'text-[#C59B27]'}`} />
          <h3 className={`text-xl font-bold ${isKitab ? 'font-amiri' : 'font-serif'}`}>
            Konfirmasi Kehadiran (RSVP)
          </h3>
          <p className="text-xs opacity-75 mt-0.5">Mohon berkenan mengisi konfirmasi kehadiran untuk estimasi tamu</p>
        </div>

        {rsvpSubmitted ? (
          <div className="text-center py-6 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 p-4">
            <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-emerald-600" />
            <p className="font-bold text-sm">Terima Kasih!</p>
            <p className="text-xs mt-1">Konfirmasi kehadiran Anda telah berhasil tercatat oleh mempelai.</p>
          </div>
        ) : (
          <form onSubmit={handleRsvpSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold mb-1">Nama Lengkap / Tamu Undangan *</label>
              <input
                type="text"
                required
                value={rsvpName}
                onChange={(e) => setRsvpName(e.target.value)}
                placeholder="Contoh: Bpk. Rahmat & Keluarga"
                className="w-full px-3 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Konfirmasi Kehadiran *</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setAttendance('hadir')}
                  className={`py-2 px-2 rounded-lg font-medium border text-center transition-all ${
                    attendance === 'hadir'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white/80 text-stone-700 border-stone-300'
                  }`}
                >
                  Hadir
                </button>
                <button
                  type="button"
                  onClick={() => setAttendance('tidak_hadir')}
                  className={`py-2 px-2 rounded-lg font-medium border text-center transition-all ${
                    attendance === 'tidak_hadir'
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'bg-white/80 text-stone-700 border-stone-300'
                  }`}
                >
                  Tidak Hadir
                </button>
                <button
                  type="button"
                  onClick={() => setAttendance('ragu')}
                  className={`py-2 px-2 rounded-lg font-medium border text-center transition-all ${
                    attendance === 'ragu'
                      ? 'bg-amber-600 text-white border-amber-600'
                      : 'bg-white/80 text-stone-700 border-stone-300'
                  }`}
                >
                  Masih Ragu
                </button>
              </div>
            </div>

            {attendance === 'hadir' && (
              <div>
                <label className="block font-semibold mb-1">Jumlah Tamu yang Hadir</label>
                <select
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]"
                >
                  <option value={1}>1 Orang</option>
                  <option value={2}>2 Orang</option>
                  <option value={3}>3 Orang</option>
                  <option value={4}>4 Orang</option>
                  <option value={5}>5 Orang atau Lebih</option>
                </select>
              </div>
            )}

            <div>
              <label className="block font-semibold mb-1">Catatan / Doa Singkat</label>
              <input
                type="text"
                value={rsvpNotes}
                onChange={(e) => setRsvpNotes(e.target.value)}
                placeholder="InsyaAllah hadir bersama keluarga..."
                className="w-full px-3 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>

            <button
              type="submit"
              disabled={rsvpLoading}
              className={`w-full py-3 rounded-xl font-bold text-sm tracking-wide shadow-md transition-all ${
                isKitab
                  ? 'bg-[#5A4326] text-[#F4E8C1] hover:bg-[#43311B]'
                  : isWalimah
                  ? 'bg-amber-500 text-emerald-950 hover:bg-amber-400'
                  : 'bg-[#0B132B] text-white hover:bg-[#1E232A]'
              }`}
            >
              {rsvpLoading ? 'Menyimpan...' : 'Kirim Konfirmasi'}
            </button>
          </form>
        )}
      </div>

      {/* Guest Messages & Wishes Book */}
      <div
        className={`p-6 rounded-2xl border shadow-sm ${
          isKitab
            ? 'bg-[#F4E8C1] border-[#755B39] text-[#3D2C15]'
            : isWalimah
            ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-50'
            : 'bg-white border-stone-200 text-stone-900'
        }`}
      >
        <div className="text-center mb-5">
          <MessageSquare className={`w-7 h-7 mx-auto mb-1 ${isWalimah ? 'text-amber-300' : 'text-[#C59B27]'}`} />
          <h3 className={`text-xl font-bold ${isKitab ? 'font-amiri' : 'font-serif'}`}>
            Ucapan & Doa Restu
          </h3>
          <p className="text-xs opacity-75 mt-0.5">Tuliskan pesan tulus untuk kedua mempelai</p>
        </div>

        <form onSubmit={handleMessageSubmit} className="space-y-3 text-xs mb-6">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold mb-1">Nama Anda *</label>
              <input
                type="text"
                required
                value={msgName}
                onChange={(e) => setMsgName(e.target.value)}
                placeholder="Nama Anda"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Hubungan</label>
              <input
                type="text"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                placeholder="Sahabat / Kerabat"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Pesan & Doa *</label>
            <textarea
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Semoga menjadi keluarga sakinah mawaddah warahmah..."
              className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>

          <button
            type="submit"
            disabled={msgLoading}
            className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all ${
              isKitab
                ? 'bg-[#5A4326] text-[#F4E8C1] hover:bg-[#43311B]'
                : isWalimah
                ? 'bg-amber-500 text-emerald-950 hover:bg-amber-400'
                : 'bg-[#C59B27] text-white hover:bg-amber-700'
            }`}
          >
            <Send className="w-3.5 h-3.5" /> {msgLoading ? 'Mengirim...' : 'Kirim Doa Restu'}
          </button>

          {msgSuccess && (
            <p className="text-center text-xs font-semibold text-emerald-600 bg-emerald-50 py-1.5 rounded">
              Pesan dan doa Anda berhasil terkirim!
            </p>
          )}
        </form>

        {/* Message List */}
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {guestMessages && guestMessages.length > 0 ? (
            guestMessages
              .filter((m) => m.isApproved)
              .map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-xl border text-xs ${
                    isKitab
                      ? 'bg-[#EBD8A8] border-[#755B39]/40 text-[#2B1D0E]'
                      : isWalimah
                      ? 'bg-emerald-900/60 border-emerald-700/50 text-emerald-100'
                      : 'bg-stone-50 border-stone-200 text-stone-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold">{msg.senderName}</span>
                      {msg.relationship && (
                        <span className="opacity-60 text-[10px]">({msg.relationship})</span>
                      )}
                    </div>
                    {msg.attendance && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                          msg.attendance === 'hadir'
                            ? 'bg-emerald-100 text-emerald-800'
                            : msg.attendance === 'tidak_hadir'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {msg.attendance === 'hadir'
                          ? 'Hadir'
                          : msg.attendance === 'tidak_hadir'
                          ? 'Berhalangan'
                          : 'Ragu'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs leading-relaxed italic">{msg.message}</p>
                </div>
              ))
          ) : (
            <p className="text-center text-xs opacity-60 py-4">Belum ada ucapan. Jadilah yang pertama mendoakan!</p>
          )}
        </div>
      </div>

      {/* Share Invitation Bar */}
      <div className="text-center pt-2">
        <p className="text-xs opacity-70 mb-2">Bagikan undangan ini kepada kerabat</p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={shareToWhatsapp}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-semibold shadow-md transition-all"
          >
            <Share2 className="w-3.5 h-3.5" /> Bagikan ke WhatsApp
          </button>
          <button
            onClick={copyUrl}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-700 hover:bg-stone-800 text-white rounded-full text-xs font-semibold shadow-md transition-all"
          >
            {copyShareSuccess ? 'Link Tersalin!' : 'Salin Link'}
          </button>
        </div>
      </div>
    </div>
  );
};
