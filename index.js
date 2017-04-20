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
    this.TokenContract = this.contract(abi)

    // If provider is event emitter, register for blocks:
    if (typeof this.provider.on === 'function') {
      this.provider.on('block', this.updateBalances.bind(this))
    }

    const tokens = opts.tokens || []

    this.tokens = tokens.map((tokenOpts) => {
      const owner = this.userAddress
      const { address, symbol, balance, decimals } = tokenOpts
      const contract = this.TokenContract.at(address)
      return new Token({ address, symbol, balance, decimals, contract, owner })
    })
  }

  updateBalances() {
    return Promise.all(this.tokens.map((token) => {
      return token.updateBalance()
    }))
  }

}

module.exports = TokenTracker
