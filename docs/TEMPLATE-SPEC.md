# AKSARA UNDANGAN — Canva to Web Template Specification

Canva artwork is the visual reference. Production invitations MUST render as native responsive web components so customer data, countdown, maps, gift, RSVP, guestbook and music can work dynamically.

## Shared dynamic fields

- `[NAMA MEMPELAI PRIA]`
- `[NAMA MEMPELAI WANITA]`
- `[NAMA ORANG TUA PRIA]`
- `[NAMA ORANG TUA WANITA]`
- `[TANGGAL]`
- `[WAKTU AKAD]`
- `[WAKTU RESEPSI]`
- `[LOKASI]`
- `[ALAMAT]`
- `[LINK GOOGLE MAPS]`
- `[FOTO MEMPELAI]`
- `[FOTO GALERI]`
- `[NOMOR REKENING]`
- `[NOMOR WHATSAPP]`
- `[LINK RSVP]`

## Modern Minimalist

Visual source: Canva Basic `DAHU_GvAVIs`, Premium `DAHU_nhJw2I`.

Sections: Cover, Opening, Ayat/Quote, Mempelai, Akad, Resepsi, Countdown, Love Story, Gallery, Wedding Gift, RSVP, Ucapan & Doa, Closing.

Basic is static/lightweight. Premium retains the same identity but may use subtle motion and background music. Palette: ivory, cream, white, beige, soft black and restrained gold. Typography: elegant serif paired with clean sans serif. Mobile-first and photo-centric.

## Kitab Walimah / Kitab Kuning

Visual source: Canva Basic `DAHU_Bgi-TA`, Premium `DAHU_DJY-Tc`.

The target is a traditional pesantren kitab page, NOT a generic modern Islamic/mosque poster. Use aged yellow/cream paper, thin manuscript rules, classic borders, Arabic/Naskh-oriented typography, dense marginal text and a wider central invitation column.

The central content carries salam, muqaddimah, couple/parents, akad, walimah, countdown, maps, story, gallery, gift, RSVP/guest message and khatimah. Interactive controls must be visually integrated into the manuscript aesthetic.

When quoting Fathul Qarib, only use reviewed/provided source text. Never fabricate Arabic quotations. Keep source attribution with the excerpt.

## Package behavior

- HEMAT: static, no music, no animation. 3-month active URL.
- REGULER: animation + selectable/requestable music. 3-month active URL.
- VIP: Reguler features + priority/customization + non-expiring AKSARA-hosted invitation URL.

Music must not bypass browser autoplay policy. Start only after a valid user interaction. Reduced-motion preferences must be respected.

## Runtime rule

Never store customer-specific names/events directly in template source. Templates consume validated invitation data. This separation is required for automated fulfillment after verified payment.
