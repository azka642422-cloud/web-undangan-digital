import assert from 'node:assert/strict';
import test from 'node:test';
import { invitationIpKey, ipKey, userOrIpKey } from './rateLimit.js';

function req(ip: string, slug = 'aisyah-fauzi', userId?: string) {
  return { ip, socket: { remoteAddress: ip }, params: { slug }, authUser: userId ? { id: userId } : undefined } as any;
}

test('IP key supplies the canonical address for centralized hashing', () => {
  const a = ipKey(req('203.0.113.10'));
  const b = ipKey(req('203.0.113.10'));
  assert.equal(a, b);
  assert.equal(a, '203.0.113.10');
});

test('public interaction keys isolate invitation and IP combinations', () => {
  assert.notEqual(invitationIpKey(req('203.0.113.10', 'invite-a')), invitationIpKey(req('203.0.113.10', 'invite-b')));
  assert.notEqual(invitationIpKey(req('203.0.113.10', 'invite-a')), invitationIpKey(req('203.0.113.11', 'invite-a')));
});

test('authenticated mutation keys prefer stable user identity before centralized hashing', () => {
  assert.equal(userOrIpKey(req('203.0.113.10', 'x', 'user-1')), 'u:user-1');
  assert.equal(userOrIpKey(req('203.0.113.11', 'x', 'user-1')), 'u:user-1');
  assert.equal(userOrIpKey(req('203.0.113.10')), 'ip:203.0.113.10');
});
