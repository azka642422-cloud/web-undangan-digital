import assert from 'node:assert/strict';
import test from 'node:test';
import { invitationIpKey, ipKey, userOrIpKey } from './rateLimit.js';

function req(ip: string, slug = 'aisyah-fauzi', userId?: string) {
  return { ip, socket: { remoteAddress: ip }, params: { slug }, authUser: userId ? { id: userId } : undefined } as any;
}

test('IP keys are deterministic hashes and do not expose the raw address', () => {
  const a = ipKey(req('203.0.113.10'));
  const b = ipKey(req('203.0.113.10'));
  assert.equal(a, b);
  assert.equal(a.length, 64);
  assert.equal(a.includes('203.0.113.10'), false);
});

test('public interaction keys isolate invitation and IP combinations', () => {
  assert.notEqual(invitationIpKey(req('203.0.113.10', 'invite-a')), invitationIpKey(req('203.0.113.10', 'invite-b')));
  assert.notEqual(invitationIpKey(req('203.0.113.10', 'invite-a')), invitationIpKey(req('203.0.113.11', 'invite-a')));
});

test('authenticated mutation keys prefer stable user identity', () => {
  assert.equal(userOrIpKey(req('203.0.113.10', 'x', 'user-1')), 'u:user-1');
  assert.equal(userOrIpKey(req('203.0.113.11', 'x', 'user-1')), 'u:user-1');
  assert.match(userOrIpKey(req('203.0.113.10')), /^ip:[a-f0-9]{64}$/);
});
