const test = require('tape')
const BN = require('ethjs').BN

const Token = require('../../lib/token')
const { setupSimpleTokenEnvironment } = require('../helper')


test('token with no parameters', function (t) {
  t.throws(() => (new Token()), 'should throw if missing contract parameter')
  t.end()
})

test('token with empty options', function (t) {
  t.throws(() => (new Token({})), 'should throw if missing contract parameter')
  t.end()
})

test('token with just contract option', async function (t) {
  t.plan(1)
  const { token: contract } = await setupSimpleTokenEnvironment()
  t.throws(() => (new Token({ contract })), 'should throw if missing owner parameter')
  t.end()
})

test('token with just owner option', async function (t) {
  t.plan(1)
  const { addresses } = await setupSimpleTokenEnvironment()
  t.throws(() => (new Token({ owner: addresses[0] })), 'should throw if missing contract parameter')
  t.end()
})

test('token with minimal options', async function (t) {
  t.plan(1)
  const { addresses, token: contract } = await setupSimpleTokenEnvironment()
  const token = new Token({
    contract,
    owner: addresses[0],
  })

  t.deepEqual(
    token.serialize(),
    {
      address: '0x0',
      symbol: undefined,
      balance: '0',
      decimals: 0,
      string: '0',
      balanceError: null,
    },
    'should serialize minimal token correctly',
  )
  t.end()
})

test('token with address', async function (t) {
  t.plan(1)
  const { addresses, token: contract, tokenAddress } = await setupSimpleTokenEnvironment()
  const token = new Token({
    address: tokenAddress,
    contract,
    owner: addresses[0],
  })

  const serializedToken = token.serialize()
  t.deepEqual(serializedToken.address, tokenAddress, 'should serialize token address correctly')
  t.end()
})

test('token with symbol', async function (t) {
  t.plan(1)
  const { addresses, token: contract } = await setupSimpleTokenEnvironment()
  const token = new Token({
    contract,
    owner: addresses[0],
    symbol: 'TEST',
  })

  const serializedToken = token.serialize()
  t.deepEqual(serializedToken.symbol, 'TEST', 'should serialize token symbol correctly')
  t.end()
})

test('token with number balance', async function (t) {
  t.plan(1)
  const { addresses, token: contract } = await setupSimpleTokenEnvironment()
  const token = new Token({
    balance: 10,
    contract,
    owner: addresses[0],
  })

  const serializedToken = token.serialize()
  t.deepEqual(serializedToken.balance, '10', 'should serialize token balance correctly')
  t.end()
})

test('token with unprefixed hex string balance', async function (t) {
  t.plan(1)
  const { addresses, token: contract } = await setupSimpleTokenEnvironment()
  const token = new Token({
    balance: 'f',
    contract,
    owner: addresses[0],
  })

  const serializedToken = token.serialize()
  t.deepEqual(serializedToken.balance, '15', 'should serialize token balance correctly')
  t.end()
})

test('token with decimal string balance', async function (t) {
  t.plan(1)
  const { addresses, token: contract } = await setupSimpleTokenEnvironment()
  const token = new Token({
    balance: '10',
    contract,
    owner: addresses[0],
  })

  const serializedToken = token.serialize()
  t.deepEqual(serializedToken.balance, '16', 'should serialize token balance correctly')
  t.end()
})

test('token with BN.js balance', async function (t) {
  t.plan(1)
  const { addresses, token: contract } = await setupSimpleTokenEnvironment()
  const token = new Token({
    balance: new BN(10),
    contract,
    owner: addresses[0],
  })

  const serializedToken = token.serialize()
  t.deepEqual(serializedToken.balance, '10', 'should serialize token balance correctly')
  t.end()
})

test('token with array balance', async function (t) {
  t.plan(1)
  const { addresses, token: contract } = await setupSimpleTokenEnvironment()
  const token = new Token({
    balance: [10],
    contract,
    owner: addresses[0],
  })

  const serializedToken = token.serialize()
  t.deepEqual(serializedToken.balance, '10', 'should serialize token balance correctly')
  t.end()
})

test('token with prefixed hex string balance', async function (t) {
  t.plan(1)
  const { addresses, token: contract } = await setupSimpleTokenEnvironment()
  t.throws(
    () => {
      new Token({
        balance: '0x10',
        contract,
        owner: addresses[0],
      })
    },
    'should throw if given prefixed hex string balance',
  )
  t.end()
})

test('token with invalid string balance', async function (t) {
  t.plan(1)
  const { addresses, token: contract } = await setupSimpleTokenEnvironment()
  t.throws(
    () => {
      new Token({
        balance: 'z',
        contract,
        owner: addresses[0],
      })
    },
    'should throw if given invalid string balance',
  )
  t.end()
})

test('token with zero balance', async function (t) {
  t.plan(1)
  const { addresses, token: contract } = await setupSimpleTokenEnvironment()
  const token = new Token({
    balance: 0,
    contract,
    owner: addresses[0],
  })

  const serializedToken = token.serialize()
  t.deepEqual(serializedToken.balance, '0', 'should serialize token balance correctly')
  t.end()
})

test('token with empty string balance', async function (t) {
  t.plan(1)
  const { addresses, token: contract } = await setupSimpleTokenEnvironment()
  const token = new Token({
    balance: '',
    contract,
    owner: addresses[0],
  })

  const serializedToken = token.serialize()
  t.deepEqual(serializedToken.balance, '0', 'should serialize token balance correctly')
  t.end()
})

test('token with decimals', async function (t) {
  t.plan(1)
  const { addresses, token: contract } = await setupSimpleTokenEnvironment()
  const token = new Token({
    decimals: 10,
    contract,
    owner: addresses[0],
  })

  const serializedToken = token.serialize()
  t.deepEqual(serializedToken.decimals, 10, 'should serialize token decimals correctly')
  t.end()
})

test('token with string decimals', async function (t) {
  t.plan(1)
  const { addresses, token: contract } = await setupSimpleTokenEnvironment()
  const token = new Token({
    decimals: '10',
    contract,
    owner: addresses[0],
  })

  const serializedToken = token.serialize()
  t.deepEqual(serializedToken.decimals, 10, 'should serialize token decimals correctly')
  t.end()
})

test('token with unprefixed hex string decimals', async function (t) {
  t.plan(1)
  const { addresses, token: contract } = await setupSimpleTokenEnvironment()
  t.throws(
    () => {
      new Token({
        decimals: 'f',
        contract,
        owner: addresses[0],
      })
    },
    'should throw if given unprefixed hex string decimals',
  )
  t.end()
})

test('token with prefixed hex string decimals', async function (t) {
  t.plan(1)
  const { addresses, token: contract } = await setupSimpleTokenEnvironment()
  t.throws(
    () => {
      new Token({
        decimals: '0x10',
        contract,
        owner: addresses[0],
      })
    },
    'should throw if given prefixed hex string decimals',
  )
  t.end()
})

test('token with invalid string decimals', async function (t) {
  t.plan(1)
  const { addresses, token: contract } = await setupSimpleTokenEnvironment()
  t.throws(
    () => {
      new Token({
        decimals: 'z',
        contract,
        owner: addresses[0],
      })
    },
    'should throw if given invalid string decimals',
  )
  t.end()
})

test('token with zero decimals', async function (t) {
  t.plan(1)
  const { addresses, token: contract } = await setupSimpleTokenEnvironment()
  const token = new Token({
    decimals: 0,
    contract,
    owner: addresses[0],
  })

  const serializedToken = token.serialize()
  t.deepEqual(serializedToken.decimals, 0, 'should serialize token decimals correctly')
  t.end()
})

test('token with empty string decimals', async function (t) {
  t.plan(1)
  const { addresses, token: contract } = await setupSimpleTokenEnvironment()
  const token = new Token({
    decimals: '',
    contract,
    owner: addresses[0],
  })

  const serializedToken = token.serialize()
  t.deepEqual(serializedToken.decimals, 0, 'should serialize token decimals correctly')
  t.end()
})

test('token with BN.js decimals', async function (t) {
  t.plan(1)
  const { addresses, token: contract } = await setupSimpleTokenEnvironment()
  const token = new Token({
    decimals: new BN(10),
    contract,
    owner: addresses[0],
  })

  const serializedToken = token.serialize()
  t.deepEqual(serializedToken.decimals, 10, 'should serialize token decimals correctly')
  t.end()
})

test('token with array decimals', async function (t) {
  t.plan(1)
  const { addresses, token: contract } = await setupSimpleTokenEnvironment()
  const token = new Token({
    decimals: [10],
    contract,
    owner: addresses[0],
  })

  const serializedToken = token.serialize()
  t.deepEqual(serializedToken.decimals, 10, 'should serialize token decimals correctly')
  t.end()
})
