import React from 'react';

type Props={kind:'privacy'|'terms'|'refund'};
const content={
 privacy:{title:'Kebijakan Privasi',body:[
  'AKSARA UNDANGAN menggunakan data yang diberikan pelanggan untuk membuat dan mengelola undangan digital, memproses pesanan, memberikan dukungan pelanggan, serta menjaga keamanan layanan.',
  'Data yang dapat diproses meliputi identitas dan kontak pemesan, data acara pernikahan, RSVP dan pesan tamu, serta informasi transaksi yang diperlukan untuk pencatatan pesanan. Informasi kartu, PIN, OTP, atau kredensial pembayaran tidak disimpan oleh AKSARA UNDANGAN.',
  'Data tidak diperjualbelikan. Data dapat diproses oleh penyedia infrastruktur dan pembayaran sejauh diperlukan untuk menjalankan layanan. Pelanggan dapat menghubungi kami melalui WhatsApp 085941041089 untuk pertanyaan mengenai data dan layanan.'
 ]},
 terms:{title:'Syarat & Ketentuan',body:[
  'AKSARA UNDANGAN menyediakan pembuatan dan publikasi undangan pernikahan digital berdasarkan paket dan template yang dipilih pelanggan. Harga yang ditampilkan menggunakan Rupiah dan rincian paket dapat dilihat pada halaman Paket & Harga.',
  'Pelanggan bertanggung jawab memastikan data acara, nama, alamat, rekening hadiah, foto, musik, dan materi lain yang diberikan benar serta memiliki hak untuk digunakan. Konten yang melanggar hukum atau hak pihak lain dapat ditolak atau dinonaktifkan.',
  'Paket HEMAT dan REGULER memiliki masa aktif tautan sesuai informasi paket. Paket VIP menggunakan alamat undangan AKSARA UNDANGAN tanpa batas masa aktif yang ditentukan paket, selama layanan AKSARA UNDANGAN tetap beroperasi. Domain eksternal berbayar tidak termasuk kecuali dinyatakan terpisah.',
  'Aktivasi pesanan berbayar dilakukan setelah pembayaran terverifikasi oleh sistem pembayaran. Bantuan pesanan tersedia melalui WhatsApp 085941041089.'
 ]},
 refund:{title:'Kebijakan Pembatalan & Pengembalian Dana',body:[
  'Karena undangan digital dibuat berdasarkan data pelanggan, permintaan pembatalan atau pengembalian dana ditinjau berdasarkan status pengerjaan dan kondisi pesanan.',
  'Jika pembayaran berhasil tetapi layanan tidak dapat disediakan karena kesalahan AKSARA UNDANGAN, pelanggan dapat menghubungi WhatsApp 085941041089 dengan nomor pesanan untuk pemeriksaan dan penyelesaian. Pengembalian dana yang disetujui dilakukan melalui metode yang sesuai setelah verifikasi transaksi.',
  'Kesalahan data yang telah dikirim pelanggan ditangani melalui proses revisi sesuai cakupan paket. Kebijakan ini tidak mengurangi hak konsumen yang berlaku berdasarkan peraturan perundang-undangan Indonesia.'
 ]}
} as const;
export const LegalPage:React.FC<Props>=({kind})=>{const x=content[kind];return <section className="max-w-4xl mx-auto px-4 sm:px-6 py-14 sm:py-20"><div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-10 shadow-sm"><p className="text-xs font-bold tracking-[.2em] text-amber-700 uppercase mb-3">AKSARA UNDANGAN</p><h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#0B132B] mb-7">{x.title}</h1><div className="space-y-5 text-sm sm:text-base text-stone-600 leading-7">{x.body.map((p,i)=><p key={i}>{p}</p>)}</div><div className="mt-9 pt-6 border-t border-stone-200 text-sm text-stone-600"><strong>Kontak layanan:</strong> WhatsApp 085941041089</div></div></section>};
