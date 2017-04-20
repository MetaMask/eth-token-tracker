const BN = require('ethjs').BN

class Token {

  constructor (opts = {}) {
    const { address, symbol, balance, decimals, contract, owner } = opts
    this.address = address || '0x0'
    this.symbol  = symbol || 'TKN'
    this.balance = new BN(balance || '0', 16)
    this.decimals = decimals || 0
    this.owner = owner

    this.contract = contract

    Promise.all([
      this.updateSymbol(),
      this.updateBalance(),
    ])
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

}

module.exports = Token
