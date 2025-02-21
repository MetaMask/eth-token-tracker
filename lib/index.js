const { PollingBlockTracker } = require('@metamask/eth-block-tracker')
const { Web3Provider } = require('@ethersproject/providers')
const { Contract } = require('@ethersproject/contracts')
const Token = require('./token')
const abi = require('human-standard-token-abi')
const SafeEventEmitter = require('@metamask/safe-event-emitter').default
const deepEqual = require('deep-equal')

class TokenTracker extends SafeEventEmitter {

  constructor (opts = {}) {
    super()

    this.includeFailedTokens = opts.includeFailedTokens || false
    this.userAddress = opts.userAddress || '0x0'
    const pollingInterval = opts.pollingInterval || 4000
    this.blockTracker = new PollingBlockTracker({
      provider: opts.provider,
      pollingInterval,
    })

    this.provider = opts.provider

    const tokens = opts.tokens || []
    this.balanceDecimals = opts.balanceDecimals

    this.tokens = tokens.map((tokenOpts) => {
      return this.createTokenFrom(tokenOpts, this.balanceDecimals)
    })

    // initialize to empty array to ensure a tracker initialized
    // with zero tokens doesn't emit an update until a token is added.
    this._oldBalances = []

    Promise.all(this.tokens.map((token) => token.update()))
      .then((newBalances) => {
        this._update(newBalances)
      })
      .catch((error) => {
        this.emit('error', error)
      })

    this.updateBalances = this.updateBalances.bind(this)

    this.running = true
    this.blockTracker.on('latest', this.updateBalances)
  }

  serialize() {
    return this.tokens.map(token => token.serialize())
  }

  getContractAtAddress(tokenAddress) {
    return new Contract(
      tokenAddress,
      abi,
      new Web3Provider(this.provider),
    )
  }

  async updateBalances() {
    try {
      await Promise.all(this.tokens.map((token) => {
        return token.updateBalance()
      }))

      const newBalances = this.serialize()
      this._update(newBalances)
    } catch (reason) {
      this.emit('error', reason)
    }
  }

  createTokenFrom (opts, balanceDecimals) {
    const owner = this.userAddress
    const { address, symbol, balance, decimals } = opts
    const contract = this.getContractAtAddress(address)
    return new Token({
      address,
      symbol,
      balance,
      decimals,
      contract,
      owner,
      throwOnBalanceError: this.includeFailedTokens === false,
      balanceDecimals,
    })
  }

  add(opts) {
    const token = this.createTokenFrom(opts)
    this.tokens.push(token)
    token.update()
      .then(() => {
        this._update(this.serialize())
      })
      .catch((error) => {
        this.emit('error', error)
      })
  }

  stop(){
    this.running = false
    this.blockTracker.removeListener('latest', this.updateBalances)
  }

  _update(newBalances) {
    if (!this.running || deepEqual(newBalances, this._oldBalances)) {
      return
    }
    this._oldBalances = newBalances
    this.emit('update', newBalances)
  }
}

module.exports = TokenTracker
