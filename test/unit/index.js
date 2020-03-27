const test = require('tape')

const TokenTracker = require('../../lib/')
const { setupSimpleTokenEnvironment } = require('../helper')

test('tracker with minimal options', async function (t) {
  t.plan(1)
  let tracker
  try {
    const { provider } = await setupSimpleTokenEnvironment()
    tracker = new TokenTracker({ provider })
    t.deepEqual(tracker.serialize(), [], 'should serialize as an empty array')
    t.end()
  } finally {
    tracker.stop()
  }
})

test('tracker with minimal token', async function (t) {
  t.plan(2)
  let tracker
  try {
    const { addresses, provider, tokenAddress } = await setupSimpleTokenEnvironment()
    tracker = new TokenTracker({
      pollingInterval: 20,
      provider,
      tokens: [
        {
          address: tokenAddress,
        }
      ],
      userAddress: addresses[1],
    })

    const updates = []
    tracker.on('update', (tokens) => {
      updates.push(tokens)
    })

    await new Promise((resolve) => setTimeout(() => resolve(), 200))

    t.equal(updates.length, 1, 'should have one update')
    t.deepEqual(
      updates,
      [
        [{
          address: tokenAddress,
          symbol: 'TKN',
          balance: '0',
          decimals: 0,
          string: '0',
        }],
      ],
      'should have expected initial state'
    )
    t.end()
  } finally {
    tracker.stop()
  }
})

test('tracker with token including metadata', async function (t) {
  t.plan(2)
  let tracker
  try {
    const { addresses, provider, tokenAddress } = await setupSimpleTokenEnvironment()
    tracker = new TokenTracker({
      pollingInterval: 20,
      provider,
      tokens: [
        {
          address: tokenAddress,
          symbol: 'TKN',
          decimals: 0,
        }
      ],
      userAddress: addresses[1],
    })

    const updates = []
    tracker.on('update', (tokens) => {
      updates.push(tokens)
    })

    await new Promise((resolve) => setTimeout(() => resolve(), 200))

    t.equal(updates.length, 1, 'should have one update')
    t.deepEqual(
      updates,
      [
        [{
          address: tokenAddress,
          symbol: 'TKN',
          balance: '0',
          decimals: 0,
          string: '0',
        }],
      ],
      'should have expected initial state'
    )
    t.end()
  } finally {
    tracker.stop()
  }
})

test('tracker with minimal token and one block update with no changes', async function (t) {
  t.plan(2)
  let tracker
  try {
    const { addresses, provider, token, tokenAddress } = await setupSimpleTokenEnvironment()
    tracker = new TokenTracker({
      pollingInterval: 20,
      provider,
      tokens: [
        {
          address: tokenAddress,
        }
      ],
      userAddress: addresses[1],
    })

    const updates = []
    tracker.on('update', (tokens) => {
      updates.push(tokens)
    })

    await new Promise((resolve) => setTimeout(() => resolve(), 200))
    await token.transfer(addresses[1], '0')
    await new Promise((resolve) => setTimeout(() => resolve(), 200))

    t.equal(updates.length, 1, 'should have one update')
    t.deepEqual(
      updates,
      [
        [{
          address: tokenAddress,
          symbol: 'TKN',
          balance: '0',
          decimals: 0,
          string: '0',
        }],
      ],
      'should have expected initial state'
    )
    t.end()
  } finally {
    tracker.stop()
  }
})

test('tracker with minimal token and two rapid block updates, the first with changes', async function (t) {
  t.plan(2)
  let tracker
  try {
    const { addresses, provider, token, tokenAddress } = await setupSimpleTokenEnvironment()
    tracker = new TokenTracker({
      pollingInterval: 20,
      provider,
      tokens: [
        {
          address: tokenAddress,
        }
      ],
      userAddress: addresses[1],
    })

    const updates = []
    tracker.on('update', (tokens) => {
      updates.push(tokens)
    })
    await new Promise((resolve) => setTimeout(() => resolve(), 200))

    await Promise.all([
      token.transfer(addresses[1], '110'),
      token.transfer(addresses[1], '0'),
    ])
    await new Promise((resolve) => setTimeout(() => resolve(), 200))

    t.equal(updates.length, 2, 'should have only two updates')
    t.deepEqual(
      updates,
      [
        [{
          address: tokenAddress,
          symbol: 'TKN',
          balance: '0',
          decimals: 0,
          string: '0',
        }],
        [{
          address: tokenAddress,
          symbol: 'TKN',
          balance: '110',
          decimals: 0,
          string: '110',
        }],
      ],
      'should have expected state for both updates'
    )
    t.end()
  } finally {
    tracker.stop()
  }
})

test('tracker with minimal token and one block update with changes', async function (t) {
  t.plan(1)
  let tracker
  try {
    const { addresses, provider, token, tokenAddress } = await setupSimpleTokenEnvironment()
    tracker = new TokenTracker({
      pollingInterval: 20,
      provider,
      tokens: [
        {
          address: tokenAddress,
        }
      ],
      userAddress: addresses[1],
    })

    const updates = []
    tracker.on('update', (tokens) => {
      updates.push(tokens)
    })
    await new Promise((resolve) => setTimeout(() => resolve(), 200))
    await token.transfer(addresses[1], '110')
    await new Promise((resolve) => setTimeout(() => resolve(), 200))

    t.deepEqual(
      updates,
      [
        [{
          address: tokenAddress,
          symbol: 'TKN',
          balance: '0',
          decimals: 0,
          string: '0',
        }],
        [{
          address: tokenAddress,
          symbol: 'TKN',
          balance: '110',
          decimals: 0,
          string: '110',
        }],
      ],
      'should have expected state for both updates'
    )
    t.end()
  } finally {
    tracker.stop()
  }
})
