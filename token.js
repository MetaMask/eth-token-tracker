class Token {
  constructor (opts = {}) {
    const { address, symbol, balance, decimals, contract, owner } = opts
    this.address = address || '0x0'
    this.symbol  = symbol || 'TKN'
    this.balance = balance || '0x0'
    this.decimals = decimals || 0

    this.contract = contract

    this.updateSymbol()
    this.updateBalance()
  }

  updateSymbol() {
    this.contract.symbol({ from: this.owner })
    .then((symbol) => {
      this.symbol = symbol
    })
    .catch((reason) => {
      console.error('failed to load token symbol', reason)
    })
  }

  updateBalance() {
    this.contract.balanceOf(this.owner)
    .then((balance) => {
      this.balance = '0x' + balance.toString(16)
    })
    .catch((reason) => {
      console.error('failed to load token balance', reason)
    })
  }

}
