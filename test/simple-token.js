const test = require('tape')
const TestRPC = require('ethereumjs-testrpc')
const provider = TestRPC.provider()
const ProviderEngine = require('web3-provider-engine')
const fs = require('fs')
const solc = require('solc')
const TokenTracker = require('../')
const BN = require('ethjs').BN

const Eth = require('ethjs-query')
const EthContract = require('ethjs-contract')
const eth = new Eth(provider)
const contract = new EthContract(eth)

const source = fs.readFileSync(__dirname + '/contracts/Token.sol').toString();
const compiled = solc.compile(source, 1)
const SimpleTokenDeployer = compiled.contracts[':SimpleToken']

let addresses = []
let token, tokenAddress, tracked

test('testrpc has addresses', function (t) {
  eth.accounts()
  .then((accounts) => {
    addresses = accounts
    t.ok(accounts, 'loaded accounts')
    t.end()
  })
})

const qty = '100000000000000000000' // 100 x 10 ^ 18
const less = '10000000000000000000' // 100 x 10 ^ 17
test('StandardToken publishing token & checking balance', function (t) {
  const abi = JSON.parse(SimpleTokenDeployer.interface)
  const StandardToken = contract(abi, SimpleTokenDeployer.bytecode, {
    from: addresses[0],
    gas: '3000000',
    gasPrice: '30000',
  })
  const humanStandardToken = StandardToken.new(qty)
  .then((txHash) => {
    t.ok(txHash, 'publishes a txHash')

    return new Promise((res, rej) => {
      setTimeout(() => res(txHash), 200)
    })
  })
  .then((txHash) => {
    return eth.getTransactionReceipt(txHash)
  })
  .then((receipt) => {
    const addr = receipt.contractAddress
    t.ok(addr, 'should have an address')
    tokenAddress = addr
    token = StandardToken.at(addr)
    return token.balanceOf(addresses[0])
  })
  .then((res) => {
    const balance = res[0]
    t.equal(balance.toString(10), qty, 'owner should have all')
    t.end()
  })
  .catch((reason) => {
    t.notOk(reason, 'should not throw error')
    t.end()
  })
})

test('StandardToken balances are tracked', function (t) {

  var tokenTracker = new TokenTracker({
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

  var a = new Promise((res, rej) => { setTimeout(res, 200) })
  a.then(() => {
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

    t.equal(tracked.symbol, 'DBX', 'symbol retrieved')
    t.equal(tracked.address, tokenAddress, 'token address set')
    t.equal(tracked.balance.toString(10), should, 'tokens sent')

    const data = tracked.serialize()
    t.ok(data.string.indexOf('90.0') === 0, 'represents decimals')

    const serialized = tokenTracker.serialize()
    t.equal(serialized[0].string, data.string, 'serializes data')

    tokenTracker.stop()
    t.end()
  })
  .catch((reason) => {
    t.notOk(reason, 'should not throw an error')
    tokenTracker.stop()
    t.end()
  })

})

test('StandardToken balance changes are emitted', function (t) {

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
      return t.equal(tracked.string, '8.90', 'initial balance loaded from last test')
    }

    t.equal(tracked.symbol, 'DBX', 'symbol retrieved')
    t.equal(tracked.string, '7.90', 'balance updated')
    tokenTracker.stop()
    t.end()
  })

  var a = new Promise((res, rej) => { setTimeout(res, 200) })
  a.then(() => {
    return token.transfer(addresses[1], '100')
  })
  .catch((reason) => {
    t.notOk(reason, 'should not throw an error')
    tokenTracker.stop()
    t.end()
  })
})

test('StandardToken non balance changes are not emitted', function (t) {

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
      return t.equal(tracked.string, '7.90', 'initial balance loaded from last test')
    }

    t.notOk(true, 'a second event should not have fired')
    tokenTracker.stop()
    t.end()
  })

  var a = new Promise((res, rej) => { setTimeout(res, 200) })
  a.then(() => {
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
