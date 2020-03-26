const BN = require('ethjs').BN
const util = require('./util')

// bn.js requires extra validation to safely use
// See here: https://github.com/indutny/bn.js/issues/151
function _isInvalidBnInput (input) {
  return (
    typeof input === 'string' &&
    (
      input.startsWith('0x') ||
      Number.isNaN(parseInt(input))
    )
  )
}

class Token {

  constructor ({ address, symbol, balance, decimals, contract, owner } = {}) {
    if (!contract) {
      throw new Error('Missing requried \'contract\' parameter')
    } else if (!owner) {
      throw new Error('Missing requried \'owner\' parameter')
    }
    this.isLoading = !address || !symbol || !balance || !decimals
    this.address = address || '0x0'
    this.symbol  = symbol

    if (!balance) {
      balance = '0'
    } else if (_isInvalidBnInput(balance)) {
      throw new Error('Invalid \'balance\' option provided; must be non-prefixed hex string if given as string')
    }

    if (decimals && _isInvalidBnInput(decimals)) {
      throw new Error('Invalid \'decimals\' option provided; must be non-prefixed hex string if given as string')
    }

    this.balance = new BN(balance, 16)
    this.decimals = decimals ? new BN(decimals) : undefined
    this.owner = owner

    this.contract = contract
    this.update()
    .catch((reason) => {
      console.error('token updating failed', reason)
    })
  }

  async update() {
    const results = await Promise.all([
      this.symbol || this.updateSymbol(),
      this.updateBalance(),
      this.decimals || this.updateDecimals(),
    ])
    this.isLoading = false
    return results
  }

  serialize() {
    return {
      address: this.address,
      symbol: this.symbol,
      balance: this.balance.toString(10),
      decimals: this.decimals ? parseInt(this.decimals.toString()) : 0,
      string: this.stringify(),
    }
  }

  stringify() {
    return util.stringifyBalance(this.balance, this.decimals || new BN(0))
  }

  async updateSymbol() {
    const symbol = await this.updateValue('symbol')
    this.symbol = symbol || 'TKN'
    return this.symbol
  }

  async updateBalance() {
    const balance = await this.updateValue('balance')
    this.balance = balance
    return this.balance
  }

  async updateDecimals() {
    if (this.decimals !== undefined) return this.decimals
    var decimals = await this.updateValue('decimals')
    if (decimals) {
      this.decimals = decimals
    }
    return this.decimals
  }

  async updateValue(key) {
    let methodName
    let args = []

    switch (key) {
      case 'balance':
        methodName = 'balanceOf'
        args = [ this.owner ]
        break
      default:
        methodName = key
    }

    let result
    try {
      result = await this.contract[methodName](...args)
    } catch (e) {
      console.warn(`failed to load ${key} for token at ${this.address}`)
      if (key === 'balance') {
        throw e
      }
    }

    if (result) {
      const val = result[0]
      this[key] = val
      return val
    }

    return this[key]
  }

}

module.exports = Token
