const fs = require('fs')
const path = require('path')
const test = require('tape')
const ganache = require('ganache')
const solc = require('solc')
const TokenTracker = require('../../lib')
const BN = require('bn.js')
const util = require('../../lib/util')
const { ContractFactory, BrowserProvider } = require('ethers')

const provider = ganache.provider()
const ethersProvider = new BrowserProvider(provider)
let count = 0

const source = fs.readFileSync(path.resolve(__dirname, '..', 'contracts/ZeppelinToken.sol')).toString();
const compiled = solc.compile(source, 1)

const SimpleTokenDeployer = compiled.contracts[':TutorialToken']

let addresses = []
let token, tokenAddress, tracked

test('testrpc has addresses', function (t) {
  ethersProvider.listAccounts()
  .then((accounts) => {
    addresses = accounts.map(account => account.address)
    t.ok(accounts, 'loaded accounts')
    t.end()
  })
})

generateTestWithParams({
  quantity: '10000',
  precision: 2,
  result: function (token, t) {
    t.equal(tracked.decimals, 2, 'initial decimals retained')
    t.equal(tracked.string, '100', 'represents decimals')
    t.end()
  },
})

generateTestWithParams({
  quantity: '120',
  precision: 4,
  result: function (token, t) {
    t.equal(tracked.decimals, 4, 'initial decimals retained')
    t.equal(tracked.string, '0.012', 'represents decimals')
    t.end()
  },
})

generateTestWithParams({
  quantity: '120',
  precision: 18,
  result: function (token, t) {
    t.equal(tracked.decimals, 18, 'initial decimals retained')
    t.equal(tracked.string, '0.00000000000000012', 'represents decimals')
    t.end()
  },
})

// Test for MetaMask Issue #2162
generateTestWithParams({
  quantity: '2179663820576',
  precision: 18,
  result: function (token, t) {
    t.equal(tracked.decimals, 18, 'initial decimals retained')
    t.equal(tracked.string, '0.000002179663820576', 'represents decimals')
    t.end()
  },
})

// Test for MetaMask Issue #2162
generateTestWithParams({
  quantity: '279290',
  precision: 18,
  result: function (token, t) {
    t.equal(tracked.decimals, 18, 'initial decimals retained')
    t.equal(tracked.string, '0.00000000000027929', 'represents decimals')
    t.end()
  },
})

test('Precision rendering test for issue 2162', function (t) {
  const quantity = new BN('279290')
  const precision = new BN('18')
  const string = util.stringifyBalance(quantity, precision)
  t.equal(string, '0.00000000000027929', 'represents decimals')
  t.end()
})

function generateTestWithParams(opts = {}) {
  const qty = opts.quantity || '10000'
  const precision = opts.precision || 2
  const callback = opts.result

  test(`Generated token precision test ${++count}`, function (t) {
    const abi = JSON.parse(SimpleTokenDeployer.interface)
    const owner = addresses[0]
    ethersProvider.getSigner(owner).then((signer) => {
      const factory = new ContractFactory(abi, SimpleTokenDeployer.bytecode, signer)

      return factory.deploy(qty, precision, {
        gasLimit: 3000000,
        gasPrice: 875000000
      })
    })
    .then((contract) => {
      t.ok(contract.deploymentTransaction().hash, 'publishes a txHash')
      return contract.waitForDeployment()
    })
    .then((deployedContract) => {
      token = deployedContract
      return deployedContract.getAddress()
    })
    .then((address) => {
      t.ok(address, 'should have an address')
      tokenAddress = address
      return token.balanceOf(owner)
    })
    .then((balance) => {
      t.equal(balance.toString(), qty, 'owner should have all')

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
        tokenTracker.stop()
        callback(tracked, t)
      })
    })
    .catch((reason) => {
      t.notOk(reason, 'should not throw error')
      t.end()
    })
  })
}

