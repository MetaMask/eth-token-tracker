const test = require('tape')
const BN = require('bn.js')
const util = require('../../lib/util')

test('token balance stringify 1', function (t) {
  const hex = '000000000000000000000000000000000000000000000000119f00ef7cc00ee4'
  const balance = new BN(hex, 16)
  const decimals = new BN(18)

  const result = util.stringifyBalance(balance, decimals)

  t.equal(result, '1.269', 'Creates correct balance.')
  t.end()
})

test('token balance stringified with 5 decimals when balance decimals are specified', function (t) {
  const hex = '000000000000000000000000000000000000000000000000119f00ef7cc00ee4'
  const balance = new BN(hex, 16)
  const decimals = new BN(18)
  const balanceDecimals = 5;

  const result = util.stringifyBalance(balance, decimals, balanceDecimals)

  t.equal(result, '1.26973', 'Creates correct balance.')
  t.end()
})

test('token balance stringified with 0 decimals when balance decimals are specified', function (t) {
  const hex = '000000000000000000000000000000000000000000000000119f00ef7cc00ee4'
  const balance = new BN(hex, 16)
  const decimals = new BN(18)
  const balanceDecimals = 0;

  const result = util.stringifyBalance(balance, decimals, balanceDecimals)

  t.equal(result, '1', 'Creates correct balance.')
  t.end()
})

test('token balance stringify 2', function (t) {
  const balance = new BN(15)
  const decimals = new BN(0)

  const result = util.stringifyBalance(balance, decimals)

  t.equal(result, '15', 'Creates correct balance.')
  t.end()
})

test('token balance stringify 3', function (t) {
  const balance = new BN(15)
  const decimals = new BN(1)

  const result = util.stringifyBalance(balance, decimals)

  t.equal(result, '1.5', 'Creates correct balance.')
  t.end()
})

test('token balance stringify 4', function (t) {
  const balance = new BN('120', 10)
  const decimals = new BN(4)

  const result = util.stringifyBalance(balance, decimals)

  t.equal(result, '0.012', 'Creates correct balance.')
  t.end()
})

test('token balance stringify 5', function (t) {
  const balance = new BN('1200', 10)
  const decimals = new BN(4)

  const result = util.stringifyBalance(balance, decimals)

  t.equal(result, '0.12', 'Creates correct balance.')
  t.end()
})

test('token balance stringify with high precision after zero-series', function (t) {
  const balance = new BN('120000000000000007', 10)
  const decimals = new BN(18)

  const result = util.stringifyBalance(balance, decimals)

  t.equal(result, '0.120000000000000007', 'Creates correct balance.')
  t.end()
})

test('token balance stringify with trailing zeroes', function (t) {
  const balance = new BN('1200000000000', 10)
  const decimals = new BN(13)

  const result = util.stringifyBalance(balance, decimals)

  t.equal(result, '0.12', 'Creates correct balance.')
  t.end()
})
