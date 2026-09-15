import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { z } from 'zod';
import { isSettledPayment, verifyMidtransSignature } from './midtrans.js';

const app = express();
const port = Number(process.env.PORT || 8787);
const origin = process.env.APP_ORIGIN;

if (process.env.NODE_ENV === 'production' && !origin) throw new Error('APP_ORIGIN is required in production');

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: origin || 'http://localhost:5173', methods: ['GET', 'POST'], credentials: false }));
app.use(express.json({ limit: '64kb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'aksara-undangan-api' }));

const notificationSchema = z.object({
  order_id: z.string().min(1).max(100),
  status_code: z.string().min(1).max(8),
  gross_amount: z.string().regex(/^\d+(\.\d{1,2})?$/),
  signature_key: z.string().min(64).max(256),
  transaction_status: z.string().min(1).max(32),
  fraud_status: z.string().max(32).optional(),
}).strict();

app.post('/api/payments/midtrans/webhook', async (req, res) => {
  const parsed = notificationSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ ok: false });

  const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
  if (!verifyMidtransSignature(parsed.data, serverKey)) return res.status(401).json({ ok: false });

  // IMPORTANT: production implementation must load the order from the database,
  // compare order_id and gross_amount against server-owned values, make the update
  // idempotent in a DB transaction, then activate the invitation only when settled.
  // Until a database adapter is configured, fail closed and do not activate anything.
  if (!process.env.DATABASE_URL) return res.status(503).json({ ok: false, code: 'DATABASE_NOT_CONFIGURED' });

  if (!isSettledPayment(parsed.data)) return res.status(200).json({ ok: true, activated: false });

  return res.status(503).json({ ok: false, code: 'PAYMENT_PERSISTENCE_NOT_IMPLEMENTED' });
});

app.use((_req, res) => res.status(404).json({ ok: false }));

app.listen(port, () => console.log(`AKSARA API listening on ${port}`));
