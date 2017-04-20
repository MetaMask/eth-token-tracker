const test = require('tape')
const TestRPC = require('ethereumjs-testrpc')
const provider = TestRPC.provider()
const ProviderEngine = require('web3-provider-engine')
const fs = require('fs')
const solc = require('solc')
const TokenTracker = require('../')

const Eth = require('ethjs-query')
const EthContract = require('ethjs-contract')
const eth = new Eth(provider)
const contract = new EthContract(eth)

const source = fs.readFileSync(__dirname + '/contracts/Token.sol').toString();
const compiled = solc.compile(source, 1)
const deployer = compiled.contracts[':HumanStandardToken']

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

test('publishing token & checking balance', function (t) {
  const abi = JSON.parse(deployer.interface)
  const HumanStandardToken = contract(abi, deployer.bytecode, {
    from: addresses[0],
    gas: '3000000',
    gasPrice: '30000',
  })
  const humanStandardToken = HumanStandardToken.new('100', 'DanBucks', '1', 'DBX')
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
    tokenAddress = addr
    token = HumanStandardToken.at(addr)
    return token.balanceOf(addresses[0])
  })
  .then((res) => {
    const balance = res[0]
    t.equal(balance.toString(10), '100', 'owner should have all')
    t.end()
  })
  .catch((reason) => {
    t.notOk(reason, 'should not throw error')
    t.end()
  })
})

test('balances are tracked', function (t) {

  var tokenTracker = new TokenTracker({
    userAddress: addresses[0],
    provider,
    tokens: [
      {
        address: tokenAddress,
      }
    ],
  })
  tracked = tokenTracker.tokens[0]

  var a = new Promise((res, rej) => { setTimeout(res, 200) })
  a.then(() => {
    t.equal(tracked.balance.toString(10), '100', 'initial balance loaded')
    return token.transfer(addresses[1], '1')
  })
  .then((txHash) => {
    return eth.getTransactionReceipt(txHash)
  })
  .then((receipt) => {
    return tokenTracker.updateBalances()
  })
  .then(() => {
    t.equal(tracked.symbol, 'DBX', 'symbol retrieved')
    t.equal(tracked.address, tokenAddress, 'token address set')
    t.equal(tracked.balance.toString(10), '99', 'tokens sent')
    t.end()
  })
  .catch((reason) => {
    t.notOk(reason, 'should not throw an error')
    t.end()
  })

})

