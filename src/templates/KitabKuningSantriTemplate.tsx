import React, { useState } from 'react';
import { InvitationTemplateProps } from '../types';
import { CountdownTimer } from '../components/CountdownTimer';
import { WeddingGiftSection } from '../components/WeddingGiftSection';
import { RsvpAndGuestbook } from '../components/RsvpAndGuestbook';
import { AudioPlayer } from '../components/AudioPlayer';
import { Calendar, Clock, MapPin, ExternalLink, BookOpen, Scroll, Bookmark } from 'lucide-react';

export const KitabKuningSantriTemplate: React.FC<InvitationTemplateProps> = ({
  invitation,
  packageTier,
  guestName,
  onRsvpSubmit,
  onMessageSubmit,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSideTab, setActiveSideTab] = useState<'hasyiyah' | 'matan'>('matan');
  const { couple, events, galleries, gifts, rsvps, guestMessages } = invitation;
  const primaryDate = events[0]?.date || '2026-12-12';
  const isHemat = packageTier === 'HEMAT';

  return (
    <div className="min-h-screen bg-[#EFE3BC] text-[#342410] font-serif selection:bg-[#755B39] selection:text-[#FBF5DC]">
      {/* Background Audio */}
      {!isHemat && (
        <AudioPlayer
          audioUrl={invitation.musicUrl}
          autoStart={isOpen}
          enabled={!isHemat && !!invitation.musicUrl}
        />
      )}

      {!isOpen ? (
        /* Front Cover: Styled like the leather/embossed cover of a classical Pesantren Kitab */
        <div className="fixed inset-0 z-40 bg-[#352516] flex flex-col items-center justify-center p-4 text-center">
          <div className="max-w-md w-full border-4 border-double border-[#C5A059] p-8 rounded-sm bg-[#422F1C] text-[#F3E8C4] shadow-2xl relative">
            {/* Corner Ornaments */}
            <div className="absolute top-2 left-2 text-[#C5A059] text-xs">۞</div>
            <div className="absolute top-2 right-2 text-[#C5A059] text-xs">۞</div>
            <div className="absolute bottom-2 left-2 text-[#C5A059] text-xs">۞</div>
            <div className="absolute bottom-2 right-2 text-[#C5A059] text-xs">۞</div>

            <div className="border border-[#C5A059]/60 p-6 rounded-xs">
              <span className="text-[11px] font-sans tracking-[0.2em] text-[#C5A059] uppercase block mb-2">
                كِتَابُ النِّكَاحِ وَالْوَلِيْمَةِ
              </span>
              <p className="font-arabic text-2xl text-[#EBD7A7] mb-2 leading-loose">
                بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
              </p>
              <div className="h-px bg-[#C5A059]/40 w-32 mx-auto my-3"></div>

              <h1 className="font-amiri text-3xl sm:text-4xl text-[#F9F3DC] font-bold my-2 leading-normal">
                {couple.groomName} &amp; {couple.brideName}
              </h1>

              <p className="text-xs text-[#D8C7A5] font-sans my-4 italic">
                Risalah Undangan Walimatul 'Ursy &amp; Akad Nikah
              </p>

              <div className="bg-[#2D1F12] border border-[#C5A059]/40 p-3 rounded-xs my-4 text-xs font-sans">
                <p className="text-[#AFA189] text-[11px]">Musyarof / Tamu Kehormatan:</p>
                <p className="text-sm font-bold text-[#F3E8C4] mt-0.5">
                  {guestName ? decodeURIComponent(guestName) : 'Para Al-Mukarromin Wal-Hadirin'}
                </p>
              </div>

              <button
                id="btn-open-kitab"
                onClick={() => setIsOpen(true)}
                className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 bg-[#8C6D3B] hover:bg-[#A38047] text-[#24170B] font-sans font-bold text-xs uppercase tracking-wider rounded-xs border border-[#EBD7A7] shadow-lg transition-all transform hover:scale-105"
              >
                <BookOpen className="w-4 h-4" /> Buka Shahifah Kitab
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Inside the Kitab: Authentic yellow parchment physical page layout with center Matan & side Hasyiyah */
        <div className="max-w-4xl mx-auto p-3 sm:p-6 md:p-8">
          {/* Physical Book Wrapper with Authentic Margins and Classical Thin Double Borders */}
          <div className="kitab-paper kitab-border p-4 sm:p-8 md:p-10 shadow-2xl relative">
            {/* Classical Header Running Title */}
            <div className="border-b border-[#755B39] pb-3 mb-6 flex items-center justify-between text-xs text-[#5A4326] font-serif">
              <span className="flex items-center gap-1 font-semibold">
                <Scroll className="w-4 h-4 text-[#755B39]" /> كِتَابُ النِّكَاحِ • فَتْحُ الْقَرِيْبِ
              </span>
              <span className="font-arabic text-sm text-[#4A3215]">
                ۞ صَحِيْفَةُ عَقْدِ الزَّوَاجِ ۞
              </span>
              <span className="hidden sm:inline-block font-mono text-[11px]">
                Jilid: I / Hal: 21
              </span>
            </div>

            {/* Mobile Tab Switcher for narrow screens */}
            <div className="sm:hidden flex border border-[#755B39] rounded-xs mb-6 overflow-hidden text-xs">
              <button
                onClick={() => setActiveSideTab('matan')}
                className={`flex-1 py-2 font-bold ${
                  activeSideTab === 'matan' ? 'bg-[#5A4326] text-[#F3E8C4]' : 'bg-[#E5D7A9] text-[#4A3215]'
                }`}
              >
                Matan (Isi Utama)
              </button>
              <button
                onClick={() => setActiveSideTab('hasyiyah')}
                className={`flex-1 py-2 font-bold ${
                  activeSideTab === 'hasyiyah' ? 'bg-[#5A4326] text-[#F3E8C4]' : 'bg-[#E5D7A9] text-[#4A3215]'
                }`}
              >
                Hasyiyah (Nukilan Kitab)
              </button>
            </div>

            {/* Main Authentic Two-Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* NARROW SIDE COLUMN: HASYIYAH / NUKILAN KITAB ULAMA PESANTREN (4 Columns on Desktop) */}
              <aside
                className={`md:col-span-4 border border-[#755B39] bg-[#E8DBAC]/70 p-4 rounded-xs text-[#3E2D18] space-y-5 ${
                  activeSideTab === 'matan' ? 'hidden md:block' : 'block'
                }`}
              >
                <div className="border-b border-[#755B39]/60 pb-2 text-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#5A4326] block">
                    هَامِشُ الصَّحِيْفَةِ
                  </span>
                  <p className="text-[11px] font-amiri font-bold text-[#4A3215]">
                    حَاشِيَةُ الْبَاجُوْرِيِّ وَالْفِقْهِ الْمَنْهَجِيِّ
                  </p>
                </div>

                {/* Nukilan 1: Hukum Nikah */}
                <div className="space-y-1.5 text-right font-arabic">
                  <span className="text-[11px] font-sans font-bold text-[#6D522D] block text-left">
                    [قَوْلُهُ: النِّكَاحُ لُغَةً وَشَرْعًا]
                  </span>
                  <p className="text-sm leading-loose text-[#32210D] dir-rtl">
                    النِّكَاحُ سُنَّةٌ مِنْ سُنَنِ الْمُرْسَلِينَ، وَفِيهِ إِعْفَافُ النَّفْسِ وَتَحْصِينُ الْفَرْجِ، وَتَكْثِيرُ سَوَادِ الْأُمَّةِ الْمُحَمَّدِيَّةِ.
                  </p>
                  <p className="text-[11px] font-sans text-left text-[#553E22] italic leading-relaxed">
                    "Menikah adalah sunnah para Rasul; di dalamnya terkandung penjagaan kehormatan diri dan memperbanyak umat Nabi Muhammad SAW."
                  </p>
                  <span className="text-[10px] font-sans text-left block text-[#755B39]">
                    — Fathul Qarib Al-Mujib
                  </span>
                </div>

                <div className="h-px bg-[#755B39]/30"></div>

                {/* Nukilan 2: Adab Walimah */}
                <div className="space-y-1.5 text-right font-arabic">
                  <span className="text-[11px] font-sans font-bold text-[#6D522D] block text-left">
                    [فَصْلٌ فِي إِجَابَةِ الدَّعْوَةِ]
                  </span>
                  <p className="text-sm leading-loose text-[#32210D] dir-rtl">
                    وَإِجَابَةُ الدَّاعِي إِلَى وَلِيمَةِ الْعُرْسِ وَاجِبَةٌ أَوْ مُتَأَكَّدَةٌ فِي حَقِّ كُلِّ مُسْلِمٍ مَا لَمْ يَكُنْ فِيهَا مُنْكَرٌ.
                  </p>
                  <p className="text-[11px] font-sans text-left text-[#553E22] italic leading-relaxed">
                    "Memenuhi undangan walimah pernikahan adalah sunnah muakkadah dan wujud memuliakan ukhuwah serta menyambung silaturahmi."
                  </p>
                  <span className="text-[10px] font-sans text-left block text-[#755B39]">
                    — Matan Al-Ghayah wa At-Taqrib
                  </span>
                </div>

                <div className="h-px bg-[#755B39]/30"></div>

                {/* Nukilan 3: Doa Pengantin */}
                <div className="space-y-1.5 text-right font-arabic">
                  <span className="text-[11px] font-sans font-bold text-[#6D522D] block text-left">
                    [دُعَاءُ الْمُتَزَوِّجِ]
                  </span>
                  <p className="text-base leading-loose text-[#32210D] dir-rtl font-bold">
                    بَارَكَ اللَّهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ
                  </p>
                  <p className="text-[11px] font-sans text-left text-[#553E22] italic leading-relaxed">
                    "Semoga Allah memberkahimu, menetapkan berkah atasmu, dan mengumpulkan kalian berdua dalam kebaikan."
                  </p>
                </div>
              </aside>

              {/* WIDE PRIMARY COLUMN: MATAN ISI UTAMA (8 Columns on Desktop) */}
              <main
                className={`md:col-span-8 space-y-8 ${
                  activeSideTab === 'hasyiyah' ? 'hidden md:block' : 'block'
                }`}
              >
                {/* Basmalah & Muqaddimah */}
                <div className="border border-[#755B39] p-6 text-center bg-[#F7ECD0] rounded-xs shadow-xs space-y-3">
                  <p className="font-arabic text-3xl text-[#3A2612] leading-loose">
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </p>
                  <div className="h-px bg-[#755B39]/40 w-24 mx-auto"></div>
                  <p className="text-xs text-[#523A1D] uppercase font-sans tracking-widest font-semibold">
                    إِعْلَانُ النِّكَاحِ وَالْوَلِيْمَةِ
                  </p>
                  <h2 className="font-amiri text-3xl sm:text-4xl font-bold text-[#3B2510] leading-snug">
                    {couple.groomFullName}
                    <span className="text-[#8C6D3B] mx-2 text-2xl font-sans">&amp;</span>
                    {couple.brideFullName}
                  </h2>
                  <p className="text-xs text-[#5A4122] italic leading-relaxed max-w-lg mx-auto">
                    Mengharap ridho, barokah, dan rahmat Allah Subhanahu Wa Ta'ala, kami bermaksud menyelenggarakan
                    ikrar suci akad nikah serta tasyakuran walimatul 'ursy putra-putri kami.
                  </p>
                </div>

                {/* Real-time Kitab Countdown */}
                <div className="border border-[#755B39] p-4 bg-[#F2E5BF] rounded-xs text-center">
                  <span className="text-[11px] font-sans font-bold text-[#6D522D] uppercase tracking-wider block mb-1">
                    ۞ مِيقَاتُ الْعَقْدِ (HITUNG MUNDUR HARI H) ۞
                  </span>
                  <CountdownTimer targetDate={primaryDate} theme="kitab-kuning" />
                </div>

                {/* Data Pasangan & Orang Tua (Nasab Santri) */}
                <div className="border border-[#755B39] p-6 bg-[#F7ECD0] rounded-xs space-y-6">
                  <div className="text-center border-b border-[#755B39]/30 pb-3">
                    <span className="text-xs font-sans font-bold text-[#755B39] tracking-wider uppercase">
                      مَعْلُومَاتُ الْعَرُوسَيْنِ
                    </span>
                    <h3 className="font-amiri text-2xl font-bold text-[#3B2510]">
                      Kedua Mempelai Yang Berbahagia
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
                    {/* Groom */}
                    <div className="border border-[#755B39]/40 p-4 bg-[#EFE1B8] rounded-xs">
                      {couple.groomPhotoUrl && (
                        <img
                          src={couple.groomPhotoUrl}
                          alt={couple.groomFullName}
                          className="w-24 h-24 rounded-full mx-auto mb-3 object-cover border-2 border-[#755B39]"
                          loading="lazy"
                        />
                      )}
                      <h4 className="font-amiri text-xl font-bold text-[#3B2510]">{couple.groomFullName}</h4>
                      <p className="text-xs text-[#755B39] font-sans font-semibold my-1">
                        {couple.groomChildOrder || 'Putra'}
                      </p>
                      <p className="text-xs text-[#523A1D] font-serif leading-relaxed">
                        Putra dari: <br />
                        <span className="font-bold text-[#2E1C0A]">{couple.groomFather}</span> <br />
                        &amp; <span className="font-bold text-[#2E1C0A]">{couple.groomMother}</span>
                      </p>
                    </div>

                    {/* Bride */}
                    <div className="border border-[#755B39]/40 p-4 bg-[#EFE1B8] rounded-xs">
                      {couple.bridePhotoUrl && (
                        <img
                          src={couple.bridePhotoUrl}
                          alt={couple.brideFullName}
                          className="w-24 h-24 rounded-full mx-auto mb-3 object-cover border-2 border-[#755B39]"
                          loading="lazy"
                        />
                      )}
                      <h4 className="font-amiri text-xl font-bold text-[#3B2510]">{couple.brideFullName}</h4>
                      <p className="text-xs text-[#755B39] font-sans font-semibold my-1">
                        {couple.brideChildOrder || 'Putri'}
                      </p>
                      <p className="text-xs text-[#523A1D] font-serif leading-relaxed">
                        Putri dari: <br />
                        <span className="font-bold text-[#2E1C0A]">{couple.brideFather}</span> <br />
                        &amp; <span className="font-bold text-[#2E1C0A]">{couple.brideMother}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Jadwal Acara (Akad & Walimah) */}
                <div className="border border-[#755B39] p-6 bg-[#F7ECD0] rounded-xs space-y-4">
                  <div className="text-center border-b border-[#755B39]/30 pb-3">
                    <span className="text-xs font-sans font-bold text-[#755B39] tracking-wider uppercase">
                      الْمَوْعِدُ وَالْمَكَانُ
                    </span>
                    <h3 className="font-amiri text-2xl font-bold text-[#3B2510]">
                      Waktu &amp; Tempat Akad / Walimah
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {events.map((evt, idx) => (
                      <div
                        key={evt.id}
                        className="border border-[#755B39]/50 p-4 bg-[#EFE1B8] rounded-xs text-center space-y-2"
                      >
                        <h4 className="font-amiri text-xl font-bold text-[#3B2510]">
                          {idx === 0 ? '۞ عَقْدُ النِّكَاحِ (Akad Nikah)' : '۞ وَلِيمَةُ الْعُرْسِ (Walimatul Ursy)'}
                        </h4>
                        <div className="flex items-center justify-center gap-4 text-xs text-[#523A1D] font-sans font-medium">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-[#755B39]" />
                            {new Date(evt.date).toLocaleDateString('id-ID', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[#755B39]" />
                            {evt.startTime} - {evt.endTime} {evt.timezone}
                          </span>
                        </div>

                        <div className="text-xs text-[#4A3215] font-serif">
                          <p className="font-bold text-sm text-[#2A1909]">{evt.venueName}</p>
                          <p className="text-[#654C2A]">{evt.venueAddress}</p>
                        </div>

                        {evt.mapsUrl && (
                          <a
                            href={evt.mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-4 py-1.5 bg-[#755B39] hover:bg-[#5A4326] text-[#F3E8C4] rounded-xs text-xs font-sans font-semibold transition-colors mt-2"
                          >
                            <MapPin className="w-3 h-3" /> Peta Lokasi / GPS Pesantren
                            <ExternalLink className="w-3 h-3 text-[#D8C7A5]" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Galeri Kenangan (if any) */}
                {galleries && galleries.length > 0 && (
                  <div className="border border-[#755B39] p-6 bg-[#F7ECD0] rounded-xs space-y-3">
                    <h3 className="font-amiri text-2xl font-bold text-center text-[#3B2510]">
                      ۞ صُوَرٌ وَذِكْرَيَاتٌ (Galeri Foto) ۞
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {galleries.map((g) => (
                        <div key={g.id} className="border border-[#755B39] aspect-square overflow-hidden">
                          <img
                            src={g.imageUrl}
                            alt="Galeri Santri"
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hadiah / Wedding Gift */}
                <WeddingGiftSection gifts={gifts} theme="kitab-kuning" />

                {/* RSVP & Doa Restu */}
                <RsvpAndGuestbook
                  invitationId={invitation.id}
                  rsvps={rsvps}
                  guestMessages={guestMessages}
                  theme="kitab-kuning"
                  guestNameParam={guestName}
                  coupleNames={`${couple.groomName} & ${couple.brideName}`}
                  onSubmitRsvp={onRsvpSubmit}
                  onSubmitMessage={onMessageSubmit}
                />
              </main>
            </div>

            {/* Bottom Colophon of Kitab */}
            <footer className="mt-12 pt-4 border-t border-[#755B39] text-center text-xs text-[#6A502E] font-serif space-y-1">
              <p className="font-amiri text-base text-[#4A3215]">
                تَمَّتْ بِحَمْدِ اللَّهِ وَحُسْنِ تَوْفِيقِهِ
              </p>
              <p>Mabruk Alfa Mabruk kagem mempelai berdua. Barokah fiddini wad dunya wal akhirah.</p>
              <p className="text-[10px] text-[#8C6D3B] pt-2 font-sans">
                Diterbitkan secara digital oleh <span className="font-bold text-[#4A3215]">AKSARA UNDANGAN</span>
              </p>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};
