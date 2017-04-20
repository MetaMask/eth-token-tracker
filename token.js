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

  update() {
    return Promise.all([
      this.updateSymbol(),
      this.updateBalance(),
      this.updateDecimals(),
    ])
    .then((results) => {
      this.isLoading = false
      return results
    })
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

  updateSymbol() {
    this.contract.symbol()
    .then((result) => {
      this.symbol = result[0]
      return this.symbol
    })
    .catch((reason) => {
      console.error('failed to load token symbol', reason)
    })
  }

  updateBalance() {
    return this.contract.balanceOf(this.owner)
    .then((result) => {
      this.balance = result[0]
      return this.balance
    })
    .catch((reason) => {
      console.error('failed to load token balance', reason)
    })
  }

  updateDecimals() {
    return this.contract.decimals()
    .then((result) => {
      this.decimals = parseInt(result[0].toString())
      return this.decimals
    })
    .catch((reason) => {
      console.error('failed to load token decimals', reason)
    })
  }

}

module.exports = Token
