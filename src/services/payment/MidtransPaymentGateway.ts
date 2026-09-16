// Midtrans Payment Gateway Adapter
// IMPORTANT: this module is safe-by-default. Real Midtrans network calls must run
// on a trusted backend/runtime where MIDTRANS_SERVER_KEY is never exposed to the browser.

import {
  PaymentGateway,
  CreateTransactionRequest,
  PaymentTransactionResult,
  PaymentNotificationPayload,
  PaymentVerificationResult,
} from './PaymentGateway';

export class MidtransPaymentGateway implements PaymentGateway {
  public readonly name = 'Midtrans Snap';
  private isProduction: boolean;

  constructor(isProduction: boolean = false) {
    this.isProduction = isProduction;
  }

  async createTransaction(_request: CreateTransactionRequest): Promise<PaymentTransactionResult> {
    // Never fabricate a Snap token or redirect URL. A transaction is only valid
    // after the trusted backend successfully POSTs to Midtrans Snap using Basic
    // authentication with ServerKey as username and an empty password.
    throw new Error(
      `Midtrans ${this.isProduction ? 'production' : 'sandbox'} backend is not configured. ` +
        'Use MockPaymentGateway for local/demo checkout until the server-side Snap endpoint is deployed.'
    );
  }

  async verifyNotification(payload: PaymentNotificationPayload): Promise<PaymentVerificationResult> {
    // Browser-side JavaScript cannot safely access MIDTRANS_SERVER_KEY, therefore
    // it cannot authenticate a Midtrans webhook. Fail closed here. Production
    // webhook verification belongs on the backend and MUST verify:
    // SHA512(order_id + status_code + gross_amount + ServerKey), expected order
    // amount/order identity, transaction status, status code and fraud status.
    return {
      isValid: false,
      orderId: payload.orderId,
      transactionStatus: 'PENDING',
      message: 'Notification requires trusted server-side Midtrans signature verification.',
    };
  }

  async checkStatus(transactionId: string): Promise<PaymentVerificationResult> {
    // Status must be fetched from Midtrans by a trusted backend. Never mark an
    // order paid merely because a customer returned from the payment page.
    return {
      isValid: false,
      orderId: transactionId,
      transactionStatus: 'PENDING',
      message: 'Transaction status requires trusted server-side verification.',
    };
  }
}
