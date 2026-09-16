import assert from 'node:assert/strict';
import test from 'node:test';
import { validateAudio } from './audioValidator.js';

test('deep audio validation rejects signature-only payloads',async()=>{
  assert.equal(await validateAudio(Buffer.from('ID3payload'),'audio/mpeg'),false);
  assert.equal(await validateAudio(Buffer.from('0000ftypisom'),'audio/mp4'),false);
  assert.equal(await validateAudio(Buffer.from('OggSpayload'),'audio/ogg'),false);
});

test('deep audio validation rejects empty and unsupported declarations',async()=>{
  assert.equal(await validateAudio(new Uint8Array(),'audio/mpeg'),false);
  assert.equal(await validateAudio(Buffer.from('not audio'),'application/octet-stream'),false);
});
