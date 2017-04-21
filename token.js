const BN = require('ethjs').BN

class Token {

  constructor (opts = {}) {
    const { address, symbol, balance, decimals, contract, owner } = opts
    this.isLoading = !address || !symbol || !balance || !decimals
    this.address = address || '0x0'
    this.symbol  = symbol || 'TKN'
    this.balance = new BN(balance || '0', 16)
    this.decimals = decimals || 0
    this.owner = owner

    this.contract = contract
    this.update()
  }

  async update() {
    const results = await Promise.all([
      this.updateSymbol(),
      this.updateBalance(),
      this.updateDecimals(),
    ])
    this.isLoading = false
    return results
  }

  serialize() {
    return {
      address: this.address,
      symbol: this.symbol,
      balance: this.balance.toString(10),
      decimals: this.decimals,
      string: this.stringify(),
    }
  }

  stringify() {
    let bal = this.balance.toString()
    let decimals = this.decimals
    const len = bal.length
    const result = `${bal.substr(0, len - decimals)}.${bal.substr(decimals - 1)}`
    return result
  }

  async updateSymbol() {
    return this.updateValue('symbol')
  }

  async updateBalance() {
    return this.updateValue('balance')
  }

  async updateDecimals() {
    return this.updateValue('decimals')
  }

  async updateValue(value) {
    let methodName
    let args = []

    switch (value) {
      case 'balance':
        methodName = 'balanceOf'
        args = [ this.owner ]
        break
      default:
        methodName = value
    }

    let result
    try {
      result = await this.contract[methodName](...args)
    } catch (e) {
      console.warn(`failed to load token ${value} for ${this.address}`, e)
    }

    if (result) {
      const val = result[0]
      this[value] = val
    }
    return this[value]
  }

}

module.exports = Token
