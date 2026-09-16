# Security Policy — AKSARA UNDANGAN

## Prinsip

AKSARA UNDANGAN dibangun dengan prinsip least privilege, server-side verification, fail closed, dan tidak menyimpan secret di source code.

## Payment / Midtrans

- Server Key dan credential rahasia tidak boleh menggunakan prefix `VITE_` dan tidak boleh tersedia di browser.
- Aktivasi pesanan tidak boleh bergantung pada redirect frontend.
- Status pembayaran harus ditetapkan oleh backend setelah memverifikasi notifikasi/payment status dari Midtrans.
- Handler notifikasi harus idempotent agar callback berulang tidak membuat aktivasi/order ganda.
- Nominal, order ID, merchant/account environment, dan status transaksi harus dicocokkan dengan order di database.
- Production dan Sandbox wajib memakai credential terpisah.

## Aplikasi

- Semua input pelanggan, RSVP, dan guestbook divalidasi dan disanitasi.
- Endpoint publik diberi rate limiting dan batas ukuran payload.
- Upload hanya menerima tipe dan ukuran yang diizinkan; nama file dari pengguna tidak dipercaya.
- Authorization dilakukan server-side. Menyembunyikan tombol admin di frontend bukan authorization.
- Session cookie production harus Secure, HttpOnly, dan SameSite sesuai kebutuhan aplikasi.
- Error production tidak boleh membocorkan stack trace, credential, query database, atau data pribadi.
- Terapkan security headers (CSP, HSTS setelah HTTPS stabil, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, frame-ancestors).

## Repository

Jangan commit `.env`, private key, service-role key, Midtrans Server Key, database password, token GitHub, atau credential provider lain.

## Pelaporan

Jika ditemukan kerentanan, jangan publikasikan credential atau data pelanggan di issue publik. Rotasi credential yang diduga bocor dan tangani melalui kanal privat pemilik aplikasi.
