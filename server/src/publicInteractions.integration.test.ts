import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import test from 'node:test';
import { pool } from './db.js';
import { approvedMessages, submitMessage, submitRsvp } from './publicInteractions.js';

const enabled=Boolean(process.env.DATABASE_URL);
type Status='ACTIVE'|'PENDING_PAYMENT';
async function seed(status:Status,published:boolean,activeUntil:string|null){if(!pool)throw new Error('DATABASE_NOT_CONFIGURED');const orderId=randomUUID(),invitationId=randomUUID(),slug=`interaction-${randomUUID()}`;await pool.query(`INSERT INTO orders(id,order_number,customer_name,customer_email,customer_phone,package_slug,template_slug,gross_amount,status) VALUES($1,$2,'Interaction Test','interaction@example.com','0800','REGULER','modern-minimalist',50000,$3)`,[orderId,`ORD-${randomUUID()}`,status]);await pool.query(`INSERT INTO invitations(id,order_id,slug,template_slug,package_slug,is_published,active_until) VALUES($1,$2,$3,'modern-minimalist','REGULER',$4,$5)`,[invitationId,orderId,slug,published,activeUntil]);return{orderId,invitationId,slug}}
async function cleanup(x:Awaited<ReturnType<typeof seed>>){if(!pool)return;await pool.query('DELETE FROM rsvps WHERE invitation_id=$1',[x.invitationId]);await pool.query('DELETE FROM guest_messages WHERE invitation_id=$1',[x.invitationId]);await pool.query('DELETE FROM invitations WHERE id=$1',[x.invitationId]);await pool.query('DELETE FROM orders WHERE id=$1',[x.orderId])}
const rsvp={guestName:'Tamu',attendance:'hadir' as const,guestCount:2};
const message={senderName:'Tamu',attendance:'hadir' as const,message:'Semoga berbahagia'};

test('active published invitation accepts RSVP and queues guest message',{skip:!enabled},async()=>{const x=await seed('ACTIVE',true,new Date(Date.now()+86400000).toISOString());try{assert.equal(await submitRsvp(x.slug,rsvp),true);assert.equal(await submitMessage(x.slug,message),true);const rows=await pool!.query('SELECT count(*)::int rsvps,(SELECT count(*)::int FROM guest_messages WHERE invitation_id=$1) messages FROM rsvps WHERE invitation_id=$1',[x.invitationId]);assert.equal(rows.rows[0].rsvps,1);assert.equal(rows.rows[0].messages,1);assert.deepEqual(await approvedMessages(x.slug),[])}finally{await cleanup(x)}});

test('unpublished, unpaid, and expired invitations reject public writes',{skip:!enabled},async()=>{const fixtures=[await seed('ACTIVE',false,new Date(Date.now()+86400000).toISOString()),await seed('PENDING_PAYMENT',true,new Date(Date.now()+86400000).toISOString()),await seed('ACTIVE',true,new Date(Date.now()-60000).toISOString())];try{for(const x of fixtures){assert.equal(await submitRsvp(x.slug,rsvp),false);assert.equal(await submitMessage(x.slug,message),false);assert.equal(await approvedMessages(x.slug),null)}const ids=fixtures.map(x=>x.invitationId);const rows=await pool!.query('SELECT (SELECT count(*) FROM rsvps WHERE invitation_id=ANY($1::uuid[]))::int rsvps,(SELECT count(*) FROM guest_messages WHERE invitation_id=ANY($1::uuid[]))::int messages',[ids]);assert.equal(rows.rows[0].rsvps,0);assert.equal(rows.rows[0].messages,0)}finally{for(const x of fixtures)await cleanup(x)}});
