# Checklist Kesiapan Midtrans — AKSARA UNDANGAN

Dokumen ini adalah checklist engineering/operasional. Persetujuan merchant tetap merupakan keputusan Midtrans dan tidak dapat dijamin oleh aplikasi.

## Sebelum Production

- [ ] Identitas bisnis dan kontak AKSARA UNDANGAN konsisten.
- [ ] Produk digital, harga Hemat/Reguler/VIP, isi paket, dan masa aktif ditampilkan jelas.
- [ ] Cara pemesanan dan pemenuhan produk digital dijelaskan.
- [ ] Terms & Conditions tersedia.
- [ ] Privacy Policy tersedia.
- [ ] Refund/cancellation policy tersedia dan sesuai praktik bisnis sebenarnya.
- [ ] Customer support / WhatsApp admin tersedia.
- [ ] Domain production memakai HTTPS.
- [ ] Checkout menampilkan produk, harga, total, dan identitas order sebelum pembayaran.

## Integrasi

- [ ] Sandbox lulus skenario success, pending, deny/failure, cancel, dan expiry.
- [ ] Transaction token dibuat backend, bukan browser.
- [ ] Server Key hanya berada di server secret manager/environment.
- [ ] Notification URL memakai HTTPS dan dapat menerima callback server-to-server.
- [ ] Notifikasi diverifikasi sesuai dokumentasi Midtrans yang berlaku saat deployment.
- [ ] Order hanya berubah ke PAID/ACTIVE setelah verifikasi server berhasil.
- [ ] Callback idempotent dan perubahan status dicatat untuk audit.
- [ ] Nominal pembayaran dicocokkan dengan order database.
- [ ] Tidak mempercayai `transaction_status` yang dikirim browser/client.

## Go-live gate

Production credential tidak boleh diaktifkan sebelum seluruh critical security check, build/typecheck, dan payment integration test lulus.
