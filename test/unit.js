const test = require('tape')
const BN = require('ethjs').BN
const util = require('../lib/util')

test('token balance stringify 1', function (t) {
  const hex = '000000000000000000000000000000000000000000000000119f00ef7cc00ee4'
  const balance = new BN(hex, 16)
  const decimals = new BN(18)

  const result = util.stringifyBalance(balance, decimals)

  t.equal(result, '1.269', 'Creates correct balance.')
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


