const fs = require('fs')
const path = require('path')
const test = require('tape')
const ganache = require('ganache')
const { Web3Provider } = require('@ethersproject/providers')
const { ContractFactory } = require('@ethersproject/contracts')
const solc = require('solc')
const TokenTracker = require('../../lib')


const provider = ganache.provider()
const source = fs.readFileSync(path.resolve(__dirname, '..', 'contracts/Token.sol')).toString();
const compiled = solc.compile(source, 1)
const HumanStandardDeployer = compiled.contracts[':HumanStandardToken']

const SET_SYMBOL = 'DBX'
const EXPECTED_SYMBOL = 'EXP'

let addresses = []
let token, tokenAddress, tracked

const ethersProvider = new Web3Provider(provider)

test('testrpc has addresses', function (t) {
  ethersProvider.listAccounts()
  .then((accounts) => {
    addresses = accounts
    t.ok(accounts, 'loaded accounts')
    t.end()
  })
})

test('HumanStandardToken publishing token & checking balance', function (t) {
  const abi = JSON.parse(HumanStandardDeployer.interface)
  const factory = new ContractFactory(abi, HumanStandardDeployer.bytecode, ethersProvider.getSigner(addresses[0]))

  factory.deploy('1000', 'DanBucks', '2', SET_SYMBOL, {
    gasLimit: '3000000',
    gasPrice: '875000000',
  })
  .then((contract) => {
    t.ok(contract.deployTransaction.hash, 'publishes a txHash')
    return contract.deployed()
  })
  .then((deployedContract) => {
    token = deployedContract
    tokenAddress = token.address
    return token.balanceOf(addresses[0])
  })
  .then((balance) => {
    t.equal(balance.toString(), '1000', 'owner should have all')
    t.end()
  })
  .catch((reason) => {
    t.notOk(reason, 'should not throw error')
    t.end()
  })
})

test('HumanStandardToken balances are tracked', function (t) {

  var tokenTracker = new TokenTracker({
    userAddress: addresses[0],
    provider,
    pollingInterval: 20,
    tokens: [
      {
        address: tokenAddress,
        symbol: EXPECTED_SYMBOL,
      }
    ],
  })
  tracked = tokenTracker.tokens[0]

  var a = new Promise((res, rej) => { setTimeout(res, 200) })
  a.then(() => {
    t.equal(tracked.balance.toString(10), '1000', 'initial balance loaded')
    return token.transfer(addresses[1], '110')
  })
  .then((tx) => {
    return ethersProvider.getTransactionReceipt(tx.hash)
  })
  .then((receipt) => {
    var a = new Promise((res, rej) => { setTimeout(res, 200) })
    return a
  })
  .then(() => {
    t.equal(tracked.symbol, EXPECTED_SYMBOL, 'symbol cached')
    t.equal(tracked.address, tokenAddress, 'token address set')
    t.equal(tracked.balance.toString(10), '890', 'tokens sent')
    t.equal(tracked.decimals.toString(), '2', 'decimals received')

    const data = tracked.serialize()
    t.equal(data.string, '8.9', 'represents decimals')

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

test('HumanStandardToken balance changes are emitted', function (t) {

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
    if (updateCounter < 3) {
      return t.equal(tracked.string, '8.9', 'initial balance loaded from last test')
    }

    t.equal(tracked.symbol, SET_SYMBOL, 'symbol retrieved')
    t.equal(tracked.string, '7.9', 'balance updated')
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

test('HumanStandardToken non balance changes are not emitted', function (t) {

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
    , ended = false
  tokenTracker.on('update', (data) => {
    const tracked = data[0]

    updateCounter++
    if (updateCounter < 3) {
      return t.equal(tracked.string, '7.9', 'initial balance loaded from last test')
    }

    t.notOk(true, 'a second event should not have fired')
    if (!ended) {
      tokenTracker.stop()
      t.end()
      ended = true
    }
  })

  ;(new Promise((res) => { setTimeout(res, 200) }))
  .then(() =>
    token.transfer(addresses[1], '0')
  )
  .then(
    new Promise((res) => { setTimeout(res, 200) })
  )
  .then(() => {
    t.ok(true, 'time passed, no new events were fired.')
  })
  .catch((reason) => {
    t.notOk(reason, 'should not throw an error')
  })
  .finally(() => {
    if (!ended) {
      tokenTracker.stop()
      t.end()
      ended = true
    }
  })
})
