import React, { useState } from 'react';
import { InvitationTemplateProps } from '../types';
import { CountdownTimer } from '../components/CountdownTimer';
import { WeddingGiftSection } from '../components/WeddingGiftSection';
import { RsvpAndGuestbook } from '../components/RsvpAndGuestbook';
import { AudioPlayer } from '../components/AudioPlayer';
import { Calendar, Clock, MapPin, ExternalLink, Heart, MailOpen } from 'lucide-react';

export const ModernMinimalistTemplate: React.FC<InvitationTemplateProps> = ({
  invitation,
  packageTier,
  guestName,
  onRsvpSubmit,
  onMessageSubmit,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { couple, events, galleries, loveStories, gifts, rsvps, guestMessages } = invitation;

  const primaryDate = events[0]?.date || '2026-10-24';
  const isHemat = packageTier === 'HEMAT';

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C2A29] font-sans selection:bg-[#D4AF37]/30">
      {/* Background Audio Player */}
      {!isHemat && (
        <AudioPlayer
          audioUrl={invitation.musicUrl}
          autoStart={isOpen}
          enabled={!isHemat && !!invitation.musicUrl}
        />
      )}

      {/* Cover / Welcome Screen */}
      {!isOpen ? (
        <div className="fixed inset-0 z-40 bg-[#FDFBF7] flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full border border-stone-300 p-8 rounded-2xl bg-white/70 shadow-lg backdrop-blur-xs flex flex-col items-center">
            <span className="text-xs uppercase tracking-[0.3em] text-stone-500 font-serif-luxury mb-4">
              The Wedding Of
            </span>
            <h1 className="text-4xl sm:text-5xl font-serif-luxury font-bold text-stone-900 tracking-wide mb-2">
              {couple.groomName} & {couple.brideName}
            </h1>
            <div className="w-16 h-0.5 bg-[#C59B27] my-4"></div>

            <p className="text-xs text-stone-600 mb-1">Kepada Yth. Bapak/Ibu/Saudara/i:</p>
            <div className="bg-stone-100 px-4 py-2 rounded-lg my-2 border border-stone-200">
              <p className="text-base font-bold text-stone-800">
                {guestName ? decodeURIComponent(guestName) : 'Tamu Undangan Terhormat'}
              </p>
            </div>
            <p className="text-[11px] text-stone-500 mb-6 italic">
              Mohon maaf apabila ada kesalahan penulisan nama dan gelar
            </p>

            <button
              id="btn-open-invitation"
              onClick={() => setIsOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0B132B] text-white text-xs font-semibold tracking-wider uppercase hover:bg-[#1E232A] transition-all transform hover:scale-105 shadow-md"
            >
              <MailOpen className="w-4 h-4" /> Buka Undangan
            </button>
          </div>
        </div>
      ) : (
        <main className="max-w-xl mx-auto px-4 py-12 space-y-16">
          {/* Header Banner */}
          <section className="text-center pt-8">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C59B27] font-semibold">
              Walimatul Ursy
            </span>
            <h1 className="text-5xl font-serif-luxury font-bold text-stone-900 my-3">
              {couple.groomName} & {couple.brideName}
            </h1>
            <p className="text-sm font-serif-luxury tracking-widest text-stone-500 uppercase">
              {new Date(primaryDate).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </section>

          {/* Real-time Countdown */}
          <section className="text-center">
            <CountdownTimer targetDate={primaryDate} theme="modern" />
          </section>

          {/* Quranic Verse */}
          {invitation.quoteArabic && (
            <section className="p-8 rounded-2xl bg-white border border-stone-200 text-center shadow-xs">
              <p className="font-arabic text-2xl sm:text-3xl leading-loose text-stone-800 dir-rtl mb-4">
                {invitation.quoteArabic}
              </p>
              {invitation.quoteTranslation && (
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed italic mb-2">
                  "{invitation.quoteTranslation}"
                </p>
              )}
              {invitation.quoteSource && (
                <span className="text-xs font-semibold text-[#C59B27]">({invitation.quoteSource})</span>
              )}
            </section>
          )}

          {/* Couple Profiles */}
          <section className="space-y-8">
            <div className="text-center">
              <Heart className="w-5 h-5 mx-auto text-[#C59B27] mb-1" />
              <h2 className="text-2xl font-serif-luxury font-bold text-stone-900">Mempelai</h2>
              <p className="text-xs text-stone-500 mt-1">Dengan memohon ridho dan rahmat Allah SWT</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-center">
              {/* Groom */}
              <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs flex flex-col items-center">
                {couple.groomPhotoUrl && (
                  <img
                    src={couple.groomPhotoUrl}
                    alt={couple.groomFullName}
                    className="w-28 h-28 rounded-full object-cover shadow-md mb-4 border-2 border-stone-100"
                    loading="lazy"
                  />
                )}
                <h3 className="text-xl font-serif-luxury font-bold text-stone-900">{couple.groomFullName}</h3>
                <p className="text-xs text-[#C59B27] font-medium my-1">{couple.groomChildOrder}</p>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Putra dari <span className="font-semibold">{couple.groomFather}</span> &amp; <span className="font-semibold">{couple.groomMother}</span>
                </p>
              </div>

              {/* Bride */}
              <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs flex flex-col items-center">
                {couple.bridePhotoUrl && (
                  <img
                    src={couple.bridePhotoUrl}
                    alt={couple.brideFullName}
                    className="w-28 h-28 rounded-full object-cover shadow-md mb-4 border-2 border-stone-100"
                    loading="lazy"
                  />
                )}
                <h3 className="text-xl font-serif-luxury font-bold text-stone-900">{couple.brideFullName}</h3>
                <p className="text-xs text-[#C59B27] font-medium my-1">{couple.brideChildOrder}</p>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Putri dari <span className="font-semibold">{couple.brideFather}</span> &amp; <span className="font-semibold">{couple.brideMother}</span>
                </p>
              </div>
            </div>
          </section>

          {/* Events (Akad & Resepsi) */}
          <section className="space-y-6">
            <div className="text-center">
              <Calendar className="w-5 h-5 mx-auto text-[#C59B27] mb-1" />
              <h2 className="text-2xl font-serif-luxury font-bold text-stone-900">Rangkaian Acara</h2>
            </div>

            <div className="space-y-4">
              {events.map((evt) => (
                <div
                  key={evt.id}
                  className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs text-center space-y-3"
                >
                  <h3 className="text-xl font-serif-luxury font-bold text-stone-900">{evt.title}</h3>
                  <div className="inline-flex items-center justify-center gap-4 text-xs text-stone-600 py-1">
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-[#C59B27]" />
                      {new Date(evt.date).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#C59B27]" />
                      {evt.startTime} - {evt.endTime} {evt.timezone}
                    </span>
                  </div>

                  <div className="text-xs text-stone-700">
                    <p className="font-bold text-sm text-stone-900">{evt.venueName}</p>
                    <p className="text-stone-500 mt-0.5">{evt.venueAddress}</p>
                  </div>

                  {evt.mapsUrl && (
                    <a
                      href={evt.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-stone-300 text-stone-800 text-xs font-semibold hover:bg-stone-100 transition-colors"
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#C59B27]" /> Buka Google Maps
                      <ExternalLink className="w-3 h-3 text-stone-400" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Love Story (If Available) */}
          {loveStories && loveStories.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-2xl font-serif-luxury font-bold text-center text-stone-900">Kisah Cinta Kami</h2>
              <div className="space-y-3">
                {loveStories.map((story) => (
                  <div key={story.id} className="p-4 bg-white rounded-xl border border-stone-200">
                    <span className="text-xs font-bold text-[#C59B27]">{story.year}</span>
                    <h4 className="font-serif-luxury font-bold text-base text-stone-900">{story.title}</h4>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">{story.story}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Gallery (If Available & Not Hemat) */}
          {galleries && galleries.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-2xl font-serif-luxury font-bold text-center text-stone-900">Galeri Foto</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {galleries.map((gal) => (
                  <div key={gal.id} className="overflow-hidden rounded-xl border border-stone-200 aspect-square">
                    <img
                      src={gal.imageUrl}
                      alt={gal.caption || 'Foto Galeri'}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Wedding Gift / Tanda Kasih */}
          <WeddingGiftSection gifts={gifts} theme="modern" />

          {/* RSVP & Guest Messages */}
          <RsvpAndGuestbook
            invitationId={invitation.id}
            rsvps={rsvps}
            guestMessages={guestMessages}
            theme="modern"
            guestNameParam={guestName}
            coupleNames={`${couple.groomName} & ${couple.brideName}`}
            onSubmitRsvp={onRsvpSubmit}
            onSubmitMessage={onMessageSubmit}
          />

          {/* Footer of Invitation */}
          <footer className="text-center pt-8 border-t border-stone-200 text-xs text-stone-400 space-y-1">
            <p>Terima kasih atas doa dan restu Anda</p>
            <p className="font-semibold text-stone-600">
              {couple.groomFullName} &amp; {couple.brideFullName}
            </p>
            <p className="pt-4 text-[10px] text-stone-400">
              Dibuat dengan cinta via <span className="font-bold text-stone-700">AKSARA UNDANGAN</span>
            </p>
          </footer>
        </main>
      )}
    </div>
  );
};
