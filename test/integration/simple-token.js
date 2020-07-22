const test = require('tape')
const ProviderEngine = require('web3-provider-engine')

const BN = require('ethjs').BN

const TokenTracker = require('../../lib')
const { setupSimpleTokenEnvironment } = require('../helper')

let tracked
const qty = '100000000000000000000' // 100 x 10 ^ 18
const less = '10000000000000000000' // 100 x 10 ^ 17

test('StandardToken balances are tracked', function (t) {
  let addresses
  let eth
  let token
  let tokenAddress
  let tokenTracker
  setupSimpleTokenEnvironment()
  .then((environment) => {
    addresses = environment.addresses
    eth = environment.eth
    token = environment.token
    tokenAddress = environment.tokenAddress
    const { provider } = environment
    tokenTracker = new TokenTracker({
      userAddress: addresses[0],
      provider,
      pollingInterval: 20,
      tokens: [
        {
          symbol: 'MKR',
          decimals: 18,
          address: tokenAddress,
        }
      ],
    })
    tracked = tokenTracker.tokens[0]

    return new Promise((res, rej) => { setTimeout(res, 200) })
  })
  .then(() => {
    tracked = tokenTracker.serialize()[0]
    t.equal(tracked.balance.toString(10), qty, 'initial balance loaded')
    return token.transfer(addresses[1], less)
  })
  .then((txHash) => {
    return eth.getTransactionReceipt(txHash)
  })
  .then((receipt) => {
    var a = new Promise((res, rej) => { setTimeout(res, 200) })
    return a
  })
  .then(() => {

    const bnFull = new BN(qty)
    const bnLess = new BN(less)
    const should = bnFull.sub(bnLess).toString()
    tracked = tokenTracker.serialize()[0]

    t.equal(tracked.symbol, 'MKR', 'initial symbol assumed')
    t.equal(tracked.decimals, 18, 'initial decimals retained')
    t.equal(tracked.address, tokenAddress, 'token address set')
    t.equal(tracked.balance.toString(10), should, 'tokens sent')

    t.ok(tracked.string.indexOf('90') === 0, 'represents decimals')

    tokenTracker.stop()
    t.end()
  })
  .catch((reason) => {
    t.notOk(reason, 'should not throw an error')
    tokenTracker.stop()
    t.end()
  })

})

test('StandardToken balance changes are emitted and symbol fetched', function (t) {
  let addresses
  let token
  setupSimpleTokenEnvironment()
  .then((environment) => {
    addresses = environment.addresses
    token = environment.token
    const { provider, tokenAddress } = environment
    var tokenTracker = new TokenTracker({
      userAddress: addresses[0],
      provider,
      pollingInterval: 20,
      tokens: [
        {
          address: tokenAddress,
        }
      ],
    })
    tracked = tokenTracker.tokens[0]

    let updateCounter = 0
    tokenTracker.on('update', (data) => {
      const tracked = data[0]

      updateCounter++
      if (updateCounter < 2) {
        return t.ok(true, 'should be called once on initial load')
      }

      t.equal(tracked.symbol, 'TKN', 'symbol defaulted')
      tokenTracker.stop()
      t.end()
    })

    return new Promise((res, rej) => { setTimeout(res, 200) })
  })
  .then(() => {
    return token.transfer(addresses[1], '100')
  })
  .catch((reason) => {
    t.notOk(reason, 'should not throw an error')
    tokenTracker.stop()
    t.end()
  })
})

test('StandardToken non balance changes are not emitted', function (t) {
  let addresses
  let token
  let tokenTracker
  setupSimpleTokenEnvironment()
  .then((environment) => {
    addresses = environment.addresses
    token = environment.token
    const { provider, tokenAddress } = environment
    tokenTracker = new TokenTracker({
      userAddress: addresses[0],
      provider,
      pollingInterval: 20,
      tokens: [
        {
          address: tokenAddress,
        }
      ],
    })

    let updateCounter = 0
    tokenTracker.on('update', (data) => {
      updateCounter++
      if (updateCounter < 2) {
        return t.ok(true, 'should be called for initial load')
      }

      t.notOk(true, 'a second event should not have fired')
      tokenTracker.stop()
      t.end()
    })

    return new Promise((res, rej) => { setTimeout(res, 200) })
  })
  .then(() => {
    return token.transfer(addresses[1], '0')
  })
  .then(() => {
    var a = new Promise((res, rej) => { setTimeout(res, 200) })
    return a
  })
  .then(() => {
    t.ok(true, 'time passed, no new events were fired.')
    tokenTracker.stop()
    t.end()
  })
  .catch((reason) => {
    t.notOk(reason, 'should not throw an error')
    tokenTracker.stop()
    t.end()
  })
})

test('StandardToken able to add new tokens', function (t) {
  setupSimpleTokenEnvironment()
  .then(({ addresses, provider, tokenAddress }) => {
    var tokenTracker = new TokenTracker({
      userAddress: addresses[0],
      provider,
      pollingInterval: 20,
      tokens: [],
    })

    tokenTracker.on('update', (data) => {
      const tracked = data[0]
      t.equal(tracked.address, tokenAddress, 'token was added')
      tokenTracker.stop()
      t.end()
    })

    tokenTracker.add({ address: tokenAddress })
  })
})
