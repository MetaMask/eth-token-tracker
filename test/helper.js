const assert = require('assert').strict
const fs = require('fs')
const path = require('path')
const ganache = require('ganache')
const { Web3Provider } = require('@ethersproject/providers')
const { ContractFactory } = require('@ethersproject/contracts')
const solc = require('solc')

const source = fs.readFileSync(path.resolve(__dirname, 'contracts/Token.sol')).toString();
const compiled = solc.compile(source, 1)
const SimpleTokenDeployer = compiled.contracts[':SimpleToken']

const defaultQuantity = '100000000000000000000' // 100 x 10 ^ 18
async function setupSimpleTokenEnvironment ({ qty = defaultQuantity } = {}) {
  const provider = ganache.provider()
  const ethersProvider = new Web3Provider(provider)

  const addresses = await ethersProvider.listAccounts()
  assert(addresses.length > 0, 'test network should be initialized with accounts')

  const owner = addresses[0]
  const abi = JSON.parse(SimpleTokenDeployer.interface)
  const factory = new ContractFactory(abi, SimpleTokenDeployer.bytecode, ethersProvider.getSigner(owner))

  const token = await factory.deploy(qty)
  const txHash = token.deployTransaction.hash
  assert.ok(txHash, 'should have published the token and returned a transaction hash')

  await token.deployed()
  const receipt = await ethersProvider.getTransactionReceipt(txHash)

  const tokenAddress = receipt.contractAddress
  assert.ok(tokenAddress, 'should have a token address')

  const balance = await token.balanceOf(owner)
  assert.equal(balance.toString(), qty, 'owner should have all')

  return { addresses, provider, token, tokenAddress }
}

module.exports = { setupSimpleTokenEnvironment }
