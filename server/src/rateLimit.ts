import type { NextFunction, Request, Response } from 'express';
import { createHash } from 'node:crypto';
import { pool } from './db.js';

type KeyFn = (req: Request) => string;
type Options = { scope: string; windowMs: number; limit: number; key?: KeyFn };

function digest(value: string) {
  return createHash('sha256').update(value).digest('hex');
}

export function ipKey(req: Request) {
  return req.ip || req.socket.remoteAddress || 'unknown';
}

export function userOrIpKey(req: Request & { authUser?: { id: string } }) {
  return req.authUser?.id ? `u:${req.authUser.id}` : `ip:${ipKey(req)}`;
}

export function invitationIpKey(req: Request) {
  return `${String(req.params.slug || 'unknown')}:${ipKey(req)}`;
}

export function sharedRateLimit({ scope, windowMs, limit, key = ipKey }: Options) {
  if (!Number.isInteger(windowMs) || windowMs < 1000 || !Number.isInteger(limit) || limit < 1) throw new Error('INVALID_RATE_LIMIT_CONFIG');
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!pool) return res.status(503).json({ ok: false, code: 'RATE_LIMIT_UNAVAILABLE' });
    const bucket = Math.floor(Date.now() / windowMs);
    const retryAfter = Math.max(1, Math.ceil(((bucket + 1) * windowMs - Date.now()) / 1000));
    try {
      const keyHash=digest(`${scope}:${key(req)}`);
      const result = await pool.query(
        `INSERT INTO rate_limit_buckets(scope,key_hash,window_bucket,hits,expires_at)
         VALUES($1,$2,$3,1,to_timestamp($4 / 1000.0))
         ON CONFLICT(scope,key_hash,window_bucket)
         DO UPDATE SET hits=rate_limit_buckets.hits+1
         RETURNING hits`,
        [scope, keyHash, bucket, (bucket + 2) * windowMs]
      );
      const hits = Number(result.rows[0]?.hits || 0);
      if (hits > limit) {
        res.setHeader('Retry-After', String(retryAfter));
        return res.status(429).json({ ok: false, code: 'RATE_LIMITED' });
      }
      return next();
    } catch {
      return res.status(503).json({ ok: false, code: 'RATE_LIMIT_UNAVAILABLE' });
    }
  };
}
