const Eth = require('ethjs-query')
const EthContract = require('ethjs-contract')
const Token = require('./token')
const BlockTracker = require('eth-block-tracker')
const abi = require('human-standard-token-abi')

class TokenTracker {

  constructor (opts = {}) {
    this.userAddress = opts.userAddress || '0x0'
    this.provider = opts.provider
    const pollingInterval = opts.pollingInterval || 4000
    this.blockTracker = new BlockTracker({
      provider: this.provider,
      pollingInterval,
    })

    this.eth = new Eth(this.provider)
    this.contract = new EthContract(this.eth)
    this.TokenContract = this.contract(abi)

    const tokens = opts.tokens || []

    this.tokens = tokens.map((tokenOpts) => {
      const owner = this.userAddress
      const { address, symbol, balance, decimals } = tokenOpts
      const contract = this.TokenContract.at(address)
      return new Token({ address, symbol, balance, decimals, contract, owner })
    })

    this.blockTracker.on('latest', this.updateBalances.bind(this))
  }

  serialize() {
    return this.tokens.map(token => token.serialize())
  }

  updateBalances() {
    return Promise.all(this.tokens.map((token) => {
      return token.updateBalance()
    }))
  }

}

module.exports = TokenTracker
