const assert = require('assert').strict
const fs = require('fs')
const path = require('path')
const ganache = require('ganache')
const Eth = require('@metamask/ethjs-query')
const EthContract = require('@metamask/ethjs-contract')
const solc = require('solc')

const source = fs.readFileSync(path.resolve(__dirname, 'contracts/Token.sol')).toString();
const compiled = solc.compile(source, 1)
const SimpleTokenDeployer = compiled.contracts[':SimpleToken']

const defaultQuantity = '100000000000000000000' // 100 x 10 ^ 18
async function setupSimpleTokenEnvironment ({ qty = defaultQuantity } = {}) {
  const provider = ganache.provider()
  const eth = new Eth(provider)

  const addresses = await eth.accounts()
  assert(addresses.length > 0, 'test network should be initialized with accounts')

  const owner = addresses[0]
  const contract = new EthContract(eth)
  const abi = JSON.parse(SimpleTokenDeployer.interface)
  const StandardToken = contract(abi, SimpleTokenDeployer.bytecode, {
    from: owner,
    gas: '3000000',
    gasPrice: '875000000',
  })

  const txHash = await StandardToken.new(qty)
  assert.ok(txHash, 'should have published the token and returned a transaction hash')

  await new Promise((resolve) => setTimeout(resolve, 300))
  const receipt = await eth.getTransactionReceipt(txHash)

  const tokenAddress = receipt.contractAddress
  assert.ok(tokenAddress, 'should have a token address')

  const token = StandardToken.at(tokenAddress)
  const result = await token.balanceOf(owner)
  const balance = result[0]
  assert.equal(balance.toString(10), qty, 'owner should have all')

  return { addresses, eth, provider, token, tokenAddress }
}

module.exports = { setupSimpleTokenEnvironment }
