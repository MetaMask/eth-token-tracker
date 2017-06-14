const BN = require('ethjs').BN
const zero = new BN(0)

class Token {

  constructor (opts = {}) {
    const { address, symbol, balance, decimals, contract, owner } = opts
    this.isLoading = !address || !symbol || !balance || !decimals
    this.address = address || '0x0'
    this.symbol  = symbol || 'TKN'
    this.balance = new BN(balance || '0', 16)
    this.decimals = new BN(decimals || 0)
    this.owner = owner

    this.contract = contract
    this.update()
    .catch((reason) => {
      console.error('token updating failed', reason)
    })
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
      decimals: parseInt(this.decimals.toString()),
      string: this.stringify(),
    }
  }

  stringify() {
    if (this.balance.eq(zero)) {
      return '0'
    }
    let bal = this.balance.toString()
    let decimals = parseInt(this.decimals.toString())
    const len = bal.length
    const result = `${bal.substr(0, len - decimals)}.${bal.substr(decimals - 1)}`
    return result
  }

  async updateSymbol() {
    const symbol = await this.updateValue('symbol')
    if (symbol) {
      this.symbol = symbol
    }
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
      return val
    }

    return this[key]
  }

}

module.exports = Token
