import pg from 'pg';
import type { MidtransNotification } from './midtrans.js';

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL;
export const pool = connectionString ? new Pool({ connectionString, ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : undefined }) : null;

function amountToInteger(value: string): number | null {
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) ? parsed : Number.isFinite(parsed) && parsed % 1 === 0 ? parsed : null;
}

export async function applyMidtransNotification(notification: MidtransNotification, settled: boolean) {
  if (!pool) return { ok: false as const, code: 'DATABASE_NOT_CONFIGURED' };
  const amount = amountToInteger(notification.gross_amount);
  if (amount === null || amount < 0) return { ok: false as const, code: 'INVALID_AMOUNT' };

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const paymentResult = await client.query(
      `SELECT p.id, p.order_id, p.gross_amount, o.status
       FROM payments p JOIN orders o ON o.id = p.order_id
       WHERE p.provider_order_id = $1 FOR UPDATE`,
      [notification.order_id],
    );
    if (paymentResult.rowCount !== 1) {
      await client.query('ROLLBACK');
      return { ok: false as const, code: 'ORDER_NOT_FOUND' };
    }
    const payment = paymentResult.rows[0];
    if (Number(payment.gross_amount) !== amount) {
      await client.query('ROLLBACK');
      return { ok: false as const, code: 'AMOUNT_MISMATCH' };
    }

    await client.query(
      `UPDATE payments SET transaction_status=$2, fraud_status=$3,
       raw_notification=$4::jsonb, paid_at=CASE WHEN $5 THEN COALESCE(paid_at, now()) ELSE paid_at END,
       updated_at=now() WHERE provider_order_id=$1`,
      [notification.order_id, notification.transaction_status, notification.fraud_status ?? null, JSON.stringify(notification), settled],
    );

    if (settled) {
      await client.query(`UPDATE orders SET status='PAID', updated_at=now() WHERE id=$1 AND status IN ('PENDING_PAYMENT','PAID')`, [payment.order_id]);
      await client.query(`UPDATE invitations SET is_published=true, updated_at=now() WHERE order_id=$1`, [payment.order_id]);
      await client.query(`UPDATE orders SET status='ACTIVE', updated_at=now() WHERE id=$1 AND status='PAID'`, [payment.order_id]);
    }
    await client.query('COMMIT');
    return { ok: true as const, activated: settled };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
