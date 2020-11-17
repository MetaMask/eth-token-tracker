const test = require('tape')

const TokenTracker = require('../../lib/')
const { setupSimpleTokenEnvironment } = require('../helper')

test('tracker with minimal options', async function (t) {
  t.plan(2)
  let tracker
  try {
    const { provider } = await setupSimpleTokenEnvironment()
    tracker = new TokenTracker({ provider })

    const updates = []
    tracker.on('update', (tokens) => {
      updates.push(tokens)
    })

    await new Promise((resolve) => setTimeout(() => resolve(), 200))

    t.equal(updates.length, 0, 'should have zero updates')
    t.deepEqual(tracker.serialize(), [], 'should serialize as an empty array')
    t.end()
  } finally {
    tracker.stop()
  }
})

test('tracker with token added after initialization', async function (t) {
  t.plan(2)
  let tracker
  try {
    const { addresses, provider, tokenAddress } = await setupSimpleTokenEnvironment()
    tracker = new TokenTracker({
      pollingInterval: 20,
      provider,
      userAddress: addresses[1],
    })

    const updates = []
    tracker.on('update', (tokens) => {
      updates.push(tokens)
    })

    await new Promise((resolve) => setTimeout(() => resolve(), 200))
    tracker.add({ address: tokenAddress })
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
          balanceError: null,
        }],
      ],
      'should have expected initial state'
    )
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
          balanceError: null,
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
          balanceError: null,
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
          balanceError: null,
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
          balanceError: null,
        }],
        [{
          address: tokenAddress,
          symbol: 'TKN',
          balance: '110',
          decimals: 0,
          string: '110',
          balanceError: null,
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
          balanceError: null,
        }],
        [{
          address: tokenAddress,
          symbol: 'TKN',
          balance: '110',
          decimals: 0,
          string: '110',
          balanceError: null,
        }],
      ],
      'should have expected state for both updates'
    )
    t.end()
  } finally {
    tracker.stop()
  }
})

test('tracker with minimal token and one immediate block update with changes', async function (t) {
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
          balanceError: null,
        }],
        [{
          address: tokenAddress,
          symbol: 'TKN',
          balance: '110',
          decimals: 0,
          string: '110',
          balanceError: null,
        }],
      ],
      'should have expected state for both updates'
    )
    t.end()
  } finally {
    tracker.stop()
  }
})

test('tracker with broken provider', async function (t) {
  t.plan(1)
  let tracker
  try {
    tracker = new TokenTracker({
      provider: {
        sendAsync: () => {
          throw new Error('Fake provider error')
        }
      },
      tokens: [{
        address: '0xf83c3761a5c0042ab9a694d29520aa9cd6788987',
      }],
    })
    tracker.on('error', () => {
      t.pass('should emit error event')
    })
    await new Promise((resolve) => setTimeout(() => resolve(), 200))
    t.end()
  } finally {
    tracker.stop()
  }
})

test('tracker with broken provider and includeFailedTokens', async function (t) {
  t.plan(1)
  let tracker
  try {
    tracker = new TokenTracker({
      provider: {
        sendAsync: () => {
          throw new Error('Fake provider error')
        }
      },
      includeFailedTokens: true,
      tokens: [{
        address: '0xf83c3761a5c0042ab9a694d29520aa9cd6788987',
      }],
    })
    tracker.on('update', () => {
      t.pass('should emit update event')
    })
    await new Promise((resolve) => setTimeout(() => resolve(), 200))
    t.end()
  } finally {
    tracker.stop()
  }
})