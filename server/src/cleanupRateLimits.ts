import 'dotenv/config';
import { pool } from './db.js';

export async function cleanupExpiredRateLimitBuckets(limit=5000){
  if(!pool)throw new Error('DATABASE_NOT_CONFIGURED');
  const safeLimit=Math.max(1,Math.min(20000,Math.trunc(limit)));
  const result=await pool.query(
    `DELETE FROM rate_limit_buckets
     WHERE ctid IN (
       SELECT ctid FROM rate_limit_buckets
       WHERE expires_at<=now()
       ORDER BY expires_at ASC
       LIMIT $1
     )`,
    [safeLimit]
  );
  return result.rowCount??0;
}

if(import.meta.url===new URL(process.argv[1]||'', 'file:').href){
  cleanupExpiredRateLimitBuckets(Number(process.env.RATE_LIMIT_CLEANUP_BATCH||5000))
    .then(count=>console.log(`Deleted ${count} expired rate-limit buckets`))
    .finally(async()=>{if(pool)await pool.end()});
}
