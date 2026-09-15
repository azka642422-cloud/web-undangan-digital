import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { z } from 'zod';
import { isSettledPayment, verifyMidtransSignature } from './midtrans.js';
import { applyMidtransNotification } from './db.js';

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
  order_id: z.string().min(1).max(50).regex(/^[A-Za-z0-9_.~-]+$/),
  status_code: z.string().min(1).max(8),
  gross_amount: z.string().regex(/^\d+(\.0{1,2})?$/),
  signature_key: z.string().regex(/^[a-fA-F0-9]{128}$/),
  transaction_status: z.string().min(1).max(32),
  fraud_status: z.string().max(32).optional(),
}).passthrough();

app.post('/api/payments/midtrans/webhook', async (req, res) => {
  const parsed = notificationSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ ok: false });
  const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
  if (!verifyMidtransSignature(parsed.data, serverKey)) return res.status(401).json({ ok: false });

  try {
    const result = await applyMidtransNotification(parsed.data, isSettledPayment(parsed.data));
    if (!result.ok) {
      const status = result.code === 'ORDER_NOT_FOUND' ? 404 : result.code === 'AMOUNT_MISMATCH' ? 409 : 503;
      return res.status(status).json({ ok: false, code: result.code });
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error('Midtrans webhook persistence failed');
    return res.status(500).json({ ok: false });
  }
});

app.use((_req, res) => res.status(404).json({ ok: false }));
app.listen(port, () => console.log(`AKSARA API listening on ${port}`));
