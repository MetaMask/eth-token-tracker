const test = require('tape')
const TestRPC = require('ethereumjs-testrpc')
const provider = TestRPC.provider()
const ProviderEngine = require('web3-provider-engine')
const fs = require('fs')
const solc = require('solc')
const TokenTracker = require('../lib')
const BN = require('ethjs').BN

const Eth = require('ethjs-query')
const EthContract = require('ethjs-contract')
const eth = new Eth(provider)
const contract = new EthContract(eth)

const source = fs.readFileSync(__dirname + '/contracts/ZeppelinToken.sol').toString();
const compiled = solc.compile(source, 1)

const SimpleTokenDeployer = compiled.contracts[':TutorialToken']

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

const qty = '10000'
test('StandardToken publishing token & checking balance', function (t) {
  const abi = JSON.parse(SimpleTokenDeployer.interface)
  const owner = addresses[0]
  const StandardToken = contract(abi, SimpleTokenDeployer.bytecode, {
    from: owner,
    gas: '3000000',
    gasPrice: '30000',
  })
  StandardToken.new()
  .then((txHash) => {
    t.ok(txHash, 'publishes a txHash')

    return new Promise((res, rej) => {
      setTimeout(() => res(txHash), 300)
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
    return token.balanceOf(owner)
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
        decimals: 0,
        address: tokenAddress,
      }
    ],
  })
  tracked = tokenTracker.tokens[0]

  var a = new Promise((res, rej) => { setTimeout(res, 200) })
  a.then(() => {

    const bnFull = new BN(qty)
    const should = bnFull.toString()
    tracked = tokenTracker.serialize()[0]

    t.equal(tracked.symbol, 'TUT', 'initial symbol assumed')
    t.equal(tracked.decimals, 2, 'initial decimals retained')
    t.equal(tracked.address, tokenAddress, 'token address set')
    t.equal(tracked.balance.toString(10), should, 'tokens allocated')
    t.equal(tracked.string, '100.00', 'represents decimals')

    tokenTracker.stop()
    t.end()
  })
  .catch((reason) => {
    t.notOk(reason, 'should not throw an error')
    tokenTracker.stop()
    t.end()
  })

})

