import React, { useState } from 'react';
import { InvitationTemplateProps } from '../types';
import { CountdownTimer } from '../components/CountdownTimer';
import { WeddingGiftSection } from '../components/WeddingGiftSection';
import { RsvpAndGuestbook } from '../components/RsvpAndGuestbook';
import { AudioPlayer } from '../components/AudioPlayer';
import { Calendar, Clock, MapPin, ExternalLink, Sparkles, MailOpen } from 'lucide-react';

export const KitabWalimahTemplate: React.FC<InvitationTemplateProps> = ({
  invitation,
  packageTier,
  guestName,
  onRsvpSubmit,
  onMessageSubmit,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { couple, events, galleries, gifts, rsvps, guestMessages } = invitation;
  const primaryDate = events[0]?.date || '2026-11-08';
  const isHemat = packageTier === 'HEMAT';

  return (
    <div className="min-h-screen bg-[#071E22] text-[#F3F7F0] font-sans selection:bg-amber-400 selection:text-emerald-950">
      {/* Background Audio */}
      {!isHemat && (
        <AudioPlayer
          audioUrl={invitation.musicUrl}
          autoStart={isOpen}
          enabled={!isHemat && !!invitation.musicUrl}
        />
      )}

      {!isOpen ? (
        <div className="fixed inset-0 z-40 bg-[#071E22] flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full border border-amber-500/40 p-8 rounded-3xl bg-[#0D2F35]/90 shadow-2xl backdrop-blur-md flex flex-col items-center relative overflow-hidden">
            {/* Islamic Arch Decoration */}
            <div className="w-20 h-20 rounded-full border border-amber-400/30 flex items-center justify-center mb-4 bg-amber-400/10">
              <Sparkles className="w-8 h-8 text-amber-300" />
            </div>

            <p className="font-arabic text-xl text-amber-200 mb-2">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
            <span className="text-xs uppercase tracking-[0.25em] text-amber-300/80 font-semibold mb-2">
              Undangan Walimatul 'Ursy
            </span>
            <h1 className="text-4xl sm:text-5xl font-serif text-amber-100 font-bold tracking-wide my-2">
              {couple.groomName} &amp; {couple.brideName}
            </h1>
            <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent my-4"></div>

            <p className="text-xs text-emerald-200/70 mb-1">Kepada Yth. Bapak/Ibu/Saudara/i:</p>
            <div className="bg-emerald-950/80 px-5 py-2.5 rounded-xl my-2 border border-amber-400/30">
              <p className="text-base font-bold text-amber-200">
                {guestName ? decodeURIComponent(guestName) : 'Tamu Undangan Terhormat'}
              </p>
            </div>
            <p className="text-[11px] text-emerald-300/60 mb-6 italic">
              Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu berkenan hadir
            </p>

            <button
              id="btn-open-walimah"
              onClick={() => setIsOpen(true)}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-emerald-950 text-xs font-bold tracking-wider uppercase hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg"
            >
              <MailOpen className="w-4 h-4" /> Buka Undangan
            </button>
          </div>
        </div>
      ) : (
        <main className="max-w-xl mx-auto px-4 py-12 space-y-16">
          {/* Header Banner */}
          <section className="text-center pt-8 space-y-3">
            <p className="font-arabic text-2xl sm:text-3xl text-amber-200 leading-relaxed">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
            <span className="inline-block text-xs uppercase tracking-[0.25em] text-amber-300 font-semibold bg-emerald-900/50 px-4 py-1 rounded-full border border-amber-400/20">
              Walimatul 'Ursy
            </span>
            <h1 className="text-5xl font-serif font-bold text-amber-100 mt-2">
              {couple.groomName} &amp; {couple.brideName}
            </h1>
            <p className="text-xs font-serif tracking-widest text-emerald-200/80 uppercase">
              {new Date(primaryDate).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </section>

          {/* Countdown Timer */}
          <section className="text-center">
            <CountdownTimer targetDate={primaryDate} theme="walimah" />
          </section>

          {/* Ayat Walimah & Hadits */}
          <section className="p-8 rounded-3xl bg-[#0D2F35]/80 border border-amber-500/30 text-center shadow-md">
            <p className="font-arabic text-2xl sm:text-3xl leading-loose text-amber-100 dir-rtl mb-4">
              {invitation.quoteArabic ||
                'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً'}
            </p>
            {invitation.quoteTranslation && (
              <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed italic mb-2">
                "{invitation.quoteTranslation}"
              </p>
            )}
            {invitation.quoteSource && (
              <span className="text-xs font-semibold text-amber-300">({invitation.quoteSource})</span>
            )}
          </section>

          {/* Mempelai */}
          <section className="space-y-8">
            <div className="text-center">
              <span className="text-xs text-amber-300 font-semibold tracking-wider uppercase">Calon Mempelai</span>
              <h2 className="text-3xl font-serif font-bold text-amber-100 mt-1">Pengantin Pria &amp; Wanita</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
              {/* Groom */}
              <div className="p-6 bg-[#0D2F35]/70 rounded-2xl border border-emerald-700/40 shadow-xs flex flex-col items-center">
                {couple.groomPhotoUrl && (
                  <img
                    src={couple.groomPhotoUrl}
                    alt={couple.groomFullName}
                    className="w-28 h-28 rounded-full object-cover shadow-lg mb-4 border-2 border-amber-400/40"
                    loading="lazy"
                  />
                )}
                <h3 className="text-xl font-serif font-bold text-amber-100">{couple.groomFullName}</h3>
                <p className="text-xs text-amber-300/80 font-medium my-1">{couple.groomChildOrder}</p>
                <p className="text-xs text-emerald-200/80 leading-relaxed">
                  Putra dari <span className="font-bold text-emerald-100">{couple.groomFather}</span> &amp;{' '}
                  <span className="font-bold text-emerald-100">{couple.groomMother}</span>
                </p>
              </div>

              {/* Bride */}
              <div className="p-6 bg-[#0D2F35]/70 rounded-2xl border border-emerald-700/40 shadow-xs flex flex-col items-center">
                {couple.bridePhotoUrl && (
                  <img
                    src={couple.bridePhotoUrl}
                    alt={couple.brideFullName}
                    className="w-28 h-28 rounded-full object-cover shadow-lg mb-4 border-2 border-amber-400/40"
                    loading="lazy"
                  />
                )}
                <h3 className="text-xl font-serif font-bold text-amber-100">{couple.brideFullName}</h3>
                <p className="text-xs text-amber-300/80 font-medium my-1">{couple.brideChildOrder}</p>
                <p className="text-xs text-emerald-200/80 leading-relaxed">
                  Putri dari <span className="font-bold text-emerald-100">{couple.brideFather}</span> &amp;{' '}
                  <span className="font-bold text-emerald-100">{couple.brideMother}</span>
                </p>
              </div>
            </div>
          </section>

          {/* Rangkaian Acara */}
          <section className="space-y-6">
            <div className="text-center">
              <span className="text-xs text-amber-300 font-semibold tracking-wider uppercase">Agenda</span>
              <h2 className="text-3xl font-serif font-bold text-amber-100 mt-1">Waktu &amp; Tempat</h2>
            </div>

            <div className="space-y-4">
              {events.map((evt) => (
                <div
                  key={evt.id}
                  className="p-6 bg-[#0D2F35]/80 rounded-2xl border border-amber-500/30 text-center space-y-3"
                >
                  <h3 className="text-2xl font-serif font-bold text-amber-200">{evt.title}</h3>
                  <div className="inline-flex items-center justify-center gap-4 text-xs text-emerald-200 py-1">
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-amber-300" />
                      {new Date(evt.date).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-amber-300" />
                      {evt.startTime} - {evt.endTime} {evt.timezone}
                    </span>
                  </div>

                  <div className="text-xs text-emerald-100">
                    <p className="font-bold text-base text-amber-100">{evt.venueName}</p>
                    <p className="text-emerald-300/70 mt-0.5">{evt.venueAddress}</p>
                  </div>

                  {evt.mapsUrl && (
                    <a
                      href={evt.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-amber-400/40 text-amber-200 text-xs font-semibold hover:bg-amber-400/10 transition-colors"
                    >
                      <MapPin className="w-3.5 h-3.5 text-amber-400" /> Buka Peta Lokasi
                      <ExternalLink className="w-3 h-3 text-amber-400/60" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Galeri Foto */}
          {galleries && galleries.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-2xl font-serif font-bold text-center text-amber-100">Galeri Kenangan</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {galleries.map((gal) => (
                  <div key={gal.id} className="overflow-hidden rounded-xl border border-amber-400/30 aspect-square">
                    <img
                      src={gal.imageUrl}
                      alt={gal.caption || 'Galeri Walimah'}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Wedding Gift */}
          <WeddingGiftSection gifts={gifts} theme="walimah" />

          {/* RSVP & Guest Messages */}
          <RsvpAndGuestbook
            invitationId={invitation.id}
            rsvps={rsvps}
            guestMessages={guestMessages}
            theme="walimah"
            guestNameParam={guestName}
            coupleNames={`${couple.groomName} & ${couple.brideName}`}
            onSubmitRsvp={onRsvpSubmit}
            onSubmitMessage={onMessageSubmit}
          />

          {/* Footer */}
          <footer className="text-center pt-8 border-t border-emerald-800 text-xs text-emerald-300/60 space-y-1">
            <p>Jazakumullah Khairan Katsiran atas doa &amp; kehadiran Anda</p>
            <p className="font-semibold text-amber-200">
              {couple.groomFullName} &amp; {couple.brideFullName}
            </p>
            <p className="pt-4 text-[10px] text-emerald-400/40">
              Dibuat via <span className="font-bold text-amber-300">AKSARA UNDANGAN</span>
            </p>
          </footer>
        </main>
      )}
    </div>
  );
};
