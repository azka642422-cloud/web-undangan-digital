import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import test from 'node:test';
import { pool } from './db.js';
import { authorizeUpload, getPublishedUploadForRead, getQuarantinedUpload, getUploadForPublication, markUploadPublished, markValidatedUpload } from './uploads.js';

const enabled=Boolean(process.env.DATABASE_URL);

async function fixture(){
  if(!pool)throw new Error('DATABASE_NOT_CONFIGURED');
  const owner=randomUUID(),other=randomUUID(),orderId=randomUUID(),invitationId=randomUUID();
  await pool.query(`INSERT INTO users(id,email,password_hash,display_name) VALUES($1,$2,'hash','Owner'),($3,$4,'hash','Other')`,[owner,`owner-${randomUUID()}@example.com`,other,`other-${randomUUID()}@example.com`]);
  await pool.query(`INSERT INTO orders(id,order_number,customer_name,customer_email,customer_phone,package_slug,template_slug,gross_amount,status,user_id) VALUES($1,$2,'Owner','owner@example.com','0800','REGULER','modern-minimalist',50000,'ACTIVE',$3)`,[orderId,`ORD-${randomUUID()}`,owner]);
  await pool.query(`INSERT INTO invitations(id,order_id,slug,template_slug,package_slug,is_published) VALUES($1,$2,$3,'modern-minimalist','REGULER',true)`,[invitationId,orderId,`media-${randomUUID()}`]);
  return{owner,other,orderId,invitationId};
}
async function cleanup(x:Awaited<ReturnType<typeof fixture>>){if(!pool)return;await pool.query('DELETE FROM media_uploads WHERE invitation_id=$1',[x.invitationId]);await pool.query('DELETE FROM invitations WHERE id=$1',[x.invitationId]);await pool.query('DELETE FROM orders WHERE id=$1',[x.orderId]);await pool.query('DELETE FROM users WHERE id=ANY($1::uuid[])',[[x.owner,x.other]])}

test('media lifecycle remains owner-scoped from quarantine through publication',{skip:!enabled},async()=>{
  const x=await fixture();
  try{
    assert.equal(await authorizeUpload(x.other,{invitationId:x.invitationId,category:'IMAGE',byteSize:4,contentType:'image/jpeg'}),null);
    const capability=await authorizeUpload(x.owner,{invitationId:x.invitationId,category:'IMAGE',byteSize:4,contentType:'image/jpeg'});
    assert.ok(capability);
    const key=capability.objectKey;
    assert.equal(await getQuarantinedUpload(x.other,key),null);
    assert.ok(await getQuarantinedUpload(x.owner,key));
    const validated=await markValidatedUpload(x.owner,key,new Uint8Array([0xff,0xd8,0xff,0xd9]));
    assert.equal(validated?.status,'VALIDATED');
    assert.equal(await getUploadForPublication(x.other,key),null);
    assert.equal(await markUploadPublished(x.other,key),false);
    assert.equal(await getPublishedUploadForRead(x.other,key),null);
    assert.equal(await markUploadPublished(x.owner,key),true);
    assert.equal(await markUploadPublished(x.owner,key),true);
    assert.deepEqual(await getPublishedUploadForRead(x.owner,key),{validatedContentType:'image/jpeg'});
  }finally{await cleanup(x)}
});

test('invalid media bytes are rejected and cannot enter publication state',{skip:!enabled},async()=>{
  const x=await fixture();
  try{
    const capability=await authorizeUpload(x.owner,{invitationId:x.invitationId,category:'IMAGE',byteSize:4,contentType:'image/jpeg'});assert.ok(capability);
    assert.equal(await markValidatedUpload(x.owner,capability.objectKey,new Uint8Array([1,2,3,4])),null);
    assert.equal(await getUploadForPublication(x.owner,capability.objectKey),null);
    const state=await pool!.query('SELECT status FROM media_uploads WHERE object_key=$1',[capability.objectKey]);assert.equal(state.rows[0].status,'REJECTED');
  }finally{await cleanup(x)}
});
