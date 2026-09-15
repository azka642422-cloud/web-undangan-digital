import { PaymentGateway } from './PaymentGateway';
import { MockPaymentGateway } from './MockPaymentGateway';
import { MidtransPaymentGateway } from './MidtransPaymentGateway';

export * from './PaymentGateway';
export * from './MockPaymentGateway';
export * from './MidtransPaymentGateway';

// Factory function to obtain appropriate gateway
export function getPaymentGateway(): PaymentGateway {
  // Use mock gateway by default for seamless instant testing without blocking
  return new MockPaymentGateway();
}

export const activePaymentGateway = getPaymentGateway();
