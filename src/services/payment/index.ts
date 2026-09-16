export * from './PaymentGateway';

/**
 * Legacy browser-side payment gateways are intentionally not exported or
 * instantiated here. Production checkout must use the authenticated server
 * order API in secureCheckout.ts; only the server may create Midtrans
 * transactions or change payment/order state.
 */
export function getPaymentGateway(): never {
  throw new Error('LEGACY_CLIENT_PAYMENT_GATEWAY_DISABLED');
}

export const activePaymentGateway = null;
