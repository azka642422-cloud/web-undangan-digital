// Mock Payment Gateway for local development and live testing without live Midtrans credentials

import {
  PaymentGateway,
  CreateTransactionRequest,
  PaymentTransactionResult,
  PaymentNotificationPayload,
  PaymentVerificationResult,
} from './PaymentGateway';

export class MockPaymentGateway implements PaymentGateway {
  public readonly name = 'MockPaymentGateway (Sandbox / Dev)';

  async createTransaction(request: CreateTransactionRequest): Promise<PaymentTransactionResult> {
    // Generate deterministic mock identifiers
    const transactionId = `MOCK-TRX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const paymentType = request.paymentMethod || 'qris';
    let vaNumber: string | undefined;
    let bankName: string | undefined;
    let qrCodeUrl: string | undefined;

    if (paymentType === 'va') {
      bankName = 'BCA';
      vaNumber = `88000${Math.floor(100000000 + Math.random() * 900000000)}`;
    } else {
      // Mock standard QRIS payload
      qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=AKSARA_QRIS_MOCK_${request.orderNumber}_RP_${request.amount}`;
    }

    return {
      success: true,
      transactionId,
      orderId: request.orderId,
      paymentType,
      grossAmount: request.amount,
      status: 'pending',
      redirectUrl: `/payment/mock?trx=${transactionId}`,
      qrCodeUrl,
      vaNumber,
      bankName,
      expiryTime: expiry,
      instructions: [
        'Buka aplikasi e-wallet (GoPay, OVO, Dana) atau Mobile Banking Anda.',
        'Pilih menu Scan QR / Bayar QRIS atau Transfer Virtual Account.',
        'Pastikan nominal sesuai dengan tagihan pesanan Anda.',
        'Klik tombol "Simulasi Pembayaran Berhasil" di bawah untuk pengujian instan.',
      ],
    };
  }

  async verifyNotification(payload: PaymentNotificationPayload): Promise<PaymentVerificationResult> {
    const isSuccess = payload.status === 'settlement' || payload.status === 'capture';
    return {
      isValid: true,
      orderId: payload.orderId,
      transactionStatus: isSuccess ? 'PAID' : payload.status === 'pending' ? 'PENDING' : 'FAILED',
      paidAt: isSuccess ? new Date().toISOString() : undefined,
      message: isSuccess ? 'Payment verified successfully via Mock Gateway.' : 'Payment pending or cancelled.',
    };
  }

  async checkStatus(transactionId: string): Promise<PaymentVerificationResult> {
    return {
      isValid: true,
      orderId: transactionId,
      transactionStatus: 'PAID',
      paidAt: new Date().toISOString(),
      message: 'Mock status verified.',
    };
  }
}
