const BN = require('ethjs').BN
const util = require('./util')

class Token {
  constructor(opts = {}) {
    const { address, symbol, balance, decimals, contract, owner, spender, allowance } = opts
    this.isLoading = !address || !symbol || !balance || !decimals
    this.address = address || '0x0'
    this.symbol = symbol
    this.balance = new BN(balance || '0', 16)
    this.decimals = decimals ? new BN(decimals) : undefined
    this.owner = owner
    this.spender = spender
    this.allowance = allowance

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
      this.updateAllowance(),
      this.decimals || this.updateDecimals(),
    ])
    this.isLoading = false
    return results
  }

  serialize() {
    return {
      address: this.address,
      spender: this.spender,
      symbol: this.symbol,
      balance: this.balance.toString(10),
      allowance: this.allowance.toString(10),
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

  async updateAllowance() {
    const allowance = await this.updateValue('allowance')
    this.allowance = allowance
    return this.allowance
  }

  async updateDecimals() {
    if (this.decimals !== undefined) return this.decimals
    const decimals = await this.updateValue('decimals')
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
        args = [this.owner]
        break
      case 'allowance':
        methodName = 'allowance'
        args = [this.owner, this.spender]
        break
      default:
        methodName = key
    }

    let result
    try {
      window.contract = this.contract
      result = await this.contract[methodName](...args)
    } catch (e) {
      console.warn(`failed to load ${key} for token at ${this.address}`)
      if (key === 'balance' || key === 'allowance') {
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
