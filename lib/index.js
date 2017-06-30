const Eth = require('ethjs-query')
const EthContract = require('ethjs-contract')
const Token = require('./token')
const BlockTracker = require('eth-block-tracker')
const abi = require('human-standard-token-abi')
const EventEmitter = require('events').EventEmitter
const deepEqual = require('deep-equal')

class TokenTracker extends EventEmitter {

  constructor (opts = {}) {
    super()

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
      return this.createTokenFrom(tokenOpts)
    })

    this.running = true
    this.blockTracker.on('latest', this.updateBalances.bind(this))
    this.blockTracker.start()
  }

  serialize() {
    return this.tokens.map(token => token.serialize())
  }

  async updateBalances() {
    const oldBalances = this.serialize()
    return Promise.all(this.tokens.map((token) => {
      return token.updateBalance()
    }))
    .then(() => {
      const newBalances = this.serialize()
      if (!deepEqual(newBalances, oldBalances)) {
        if (this.running) {
          this.emit('update', newBalances)
        }
      }
    })
    .catch((reason) => {
      this.emit('error', reason)
    })
  }

  createTokenFrom (opts) {
    const owner = this.userAddress
    const { address, symbol, balance, decimals } = opts
    const contract = this.TokenContract.at(address)
    return new Token({ address, symbol, balance, decimals, contract, owner })
  }

  add(opts) {
    const token = this.createTokenFrom(opts)
    this.tokens.push(token)
  }

  stop(){
    this.running = false
    this.blockTracker.stop()
  }
}

module.exports = TokenTracker
