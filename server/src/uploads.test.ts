import assert from 'node:assert/strict';
import test from 'node:test';
import { uploadRequestSchema, validateUploadRequest } from './uploads.js';

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

test('upload capability request rejects client-controlled storage fields', () => {
  const parsed = uploadRequestSchema.safeParse({ invitationId: '00000000-0000-4000-8000-000000000000', category: 'IMAGE', byteSize: 10, contentType: 'image/jpeg', objectKey: 'attacker/path', bucket: 'public' });
  assert.equal(parsed.success, false);
});
