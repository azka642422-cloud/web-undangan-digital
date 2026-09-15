import assert from 'node:assert/strict';
import test from 'node:test';
import { detectMediaType, uploadRequestSchema, validateMediaBytes, validateUploadRequest } from './uploads.js';

test('image upload policy accepts only bounded JPEG PNG and WebP declarations', () => {
  assert.equal(validateUploadRequest('IMAGE', 8 * 1024 * 1024, 'image/jpeg'), true);
  assert.equal(validateUploadRequest('IMAGE', 8 * 1024 * 1024, 'image/png'), true);
  assert.equal(validateUploadRequest('IMAGE', 8 * 1024 * 1024, 'image/webp'), true);
  assert.equal(validateUploadRequest('IMAGE', 8 * 1024 * 1024 + 1, 'image/jpeg'), false);
  assert.equal(validateUploadRequest('IMAGE', 1024, 'image/svg+xml'), false);
  assert.equal(validateUploadRequest('IMAGE', 1024, 'text/html'), false);
});

test('audio declarations are allowlisted and capped at 15 MiB', () => {
  assert.equal(validateUploadRequest('AUDIO', 15 * 1024 * 1024, 'audio/mpeg'), true);
  assert.equal(validateUploadRequest('AUDIO', 15 * 1024 * 1024 + 1, 'audio/mpeg'), false);
  assert.equal(validateUploadRequest('AUDIO', 1024, 'application/octet-stream'), false);
});

test('detectMediaType recognizes supported container signatures',()=>{
  assert.equal(detectMediaType(Uint8Array.from([0xff,0xd8,0xff,0,0,0,0,0,0,0,0,0])),'image/jpeg');
  assert.equal(detectMediaType(Uint8Array.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a])),'image/png');
  assert.equal(detectMediaType(Buffer.from('RIFF0000WEBP')),'image/webp');
  assert.equal(detectMediaType(Buffer.from('ID3payload')),'audio/mpeg');
  assert.equal(detectMediaType(Buffer.from('0000ftypisom')),'audio/mp4');
  assert.equal(detectMediaType(Buffer.from('OggSpayload')),'audio/ogg');
  assert.equal(detectMediaType(Buffer.from('<svg></svg>')),null);
});

test('validateMediaBytes rejects declared MIME mismatch and unsupported bytes',()=>{
  const jpeg=Uint8Array.from([0xff,0xd8,0xff,0]);
  assert.equal(validateMediaBytes('IMAGE','image/jpeg',jpeg),'image/jpeg');
  assert.equal(validateMediaBytes('IMAGE','image/png',jpeg),null);
  assert.equal(validateMediaBytes('IMAGE','text/html',Buffer.from('<html>')),null);
  assert.equal(validateMediaBytes('AUDIO','audio/mpeg',jpeg),null);
});

test('upload capability request rejects client-controlled storage fields', () => {
  const parsed = uploadRequestSchema.safeParse({ invitationId: '00000000-0000-4000-8000-000000000000', category: 'IMAGE', byteSize: 10, contentType: 'image/jpeg', objectKey: 'attacker/path', bucket: 'public' });
  assert.equal(parsed.success, false);
});
