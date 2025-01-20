const assert = require('assert').strict
const fs = require('fs')
const path = require('path')
const ganache = require('ganache')
const { ContractFactory, BrowserProvider } = require('ethers')
const solc = require('solc')

const source = fs.readFileSync(path.resolve(__dirname, 'contracts/Token.sol')).toString();
const compiled = solc.compile(source, 1)
const SimpleTokenDeployer = compiled.contracts[':SimpleToken']

const defaultQuantity = '100000000000000000000' // 100 x 10 ^ 18
async function setupSimpleTokenEnvironment ({ qty = defaultQuantity } = {}) {
  const provider = ganache.provider()
  const ethersProvider = new BrowserProvider(provider)

  const accounts = await ethersProvider.listAccounts()
  const addresses = accounts.map(account => account.address)
  assert(addresses.length > 0, 'test network should be initialized with accounts')

  const owner = addresses[0]
  const abi = JSON.parse(SimpleTokenDeployer.interface)
  const signer = await ethersProvider.getSigner(owner)
  const factory = new ContractFactory(abi, SimpleTokenDeployer.bytecode, signer)

  const contract = await factory.deploy(qty)
  const { hash } = contract.deploymentTransaction()
  assert.ok(hash, 'should have published the token and returned a transaction hash')

  await contract.waitForDeployment()
  const receipt = await ethersProvider.getTransactionReceipt(hash)

  const tokenAddress = receipt.contractAddress
  assert.ok(tokenAddress, 'should have a token address')

  const balance = await contract.balanceOf(owner)
  assert.equal(balance.toString(), qty, 'owner should have all')

  return { addresses, provider, contract, tokenAddress }
}

module.exports = { setupSimpleTokenEnvironment }
