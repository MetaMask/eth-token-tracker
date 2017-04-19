const Eth = require('ethjs-query')
const EthContract = require('ethjs-contract')
const Token = require('./token')
const abi = require('human-standard-token-abi')

class TokenTracker {

  constructor (opts = {}) {
    this.userAddress = opts.userAddress || '0x0'
    this.provider = opts.provider
    this.eth = new Eth(this.provider)
    this.contract = new EthContract(this.eth)
    this.provider.on('block', this.updateBalances.bind(this))

    const tokens = opts.tokens || []
    this.tokens = tokens.map((tokenOpts) => {
      const owner = this.userAddress
      const { address, symbol, balance, decimals } = tokenOpts
      const contract = this.contract(abi).at(address)
      return new Token({ address, symbol, balance, decimals, contract, owner })
    })
  }

  updateBalances() {
    this.tokens.forEach((token) => {
      token.updateBalance()
    })
  }

}

