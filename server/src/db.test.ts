import assert from 'node:assert/strict';
import test from 'node:test';
import { parseMidtransIdrAmount } from './db.js';

test('parses canonical integer IDR amounts and zero-only decimals', () => {
  assert.equal(parseMidtransIdrAmount('0'), 0);
  assert.equal(parseMidtransIdrAmount('50000'), 50000);
  assert.equal(parseMidtransIdrAmount('50000.00'), 50000);
});

test('rejects fractional, signed, exponent, whitespace and non-finite forms', () => {
  for (const value of ['50000.01', '-1', '+50000', '5e4', ' 50000', '50000 ', 'NaN', 'Infinity', '', '.00']) {
    assert.equal(parseMidtransIdrAmount(value), null, value);
  }
});

test('rejects ambiguous leading zeros and unsafe integers', () => {
  assert.equal(parseMidtransIdrAmount('050000'), null);
  assert.equal(parseMidtransIdrAmount('9007199254740992'), null);
});
