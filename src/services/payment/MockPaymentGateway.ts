// Mock Payment Gateway for local development only.

import {
  PaymentGateway,
  CreateTransactionRequest,
  PaymentTransactionResult,
  PaymentNotificationPayload,
  PaymentVerificationResult,
} from './PaymentGateway';

export class MockPaymentGateway implements PaymentGateway {
  public readonly name = 'MockPaymentGateway (Development Only)';

  async createTransaction(request: CreateTransactionRequest): Promise<PaymentTransactionResult> {
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
      // Deliberately labelled mock data; never present this as a real merchant QRIS.
      qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=AKSARA_DEVELOPMENT_ONLY_${encodeURIComponent(request.orderNumber)}`;
    }

    return {
      success: true,
      transactionId,
      orderId: request.orderId,
      paymentType,
      grossAmount: request.amount,
      status: 'pending',
      redirectUrl: `/payment/mock?trx=${encodeURIComponent(transactionId)}`,
      qrCodeUrl,
      vaNumber,
      bankName,
      expiryTime: expiry,
      instructions: [
        'MODE DEVELOPMENT — jangan transfer uang sungguhan.',
        'Gunakan simulasi pembayaran hanya untuk menguji alur aplikasi.',
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
      message: isSuccess ? 'Development payment simulated.' : 'Development payment pending or cancelled.',
    };
  }

  async checkStatus(transactionId: string): Promise<PaymentVerificationResult> {
    return {
      isValid: true,
      orderId: transactionId,
      transactionStatus: 'PAID',
      paidAt: new Date().toISOString(),
      message: 'Development-only mock status.',
    };
  }
}
