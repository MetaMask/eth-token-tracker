const BN = require('ethjs').BN
const zero = new BN(0)

module.exports = {

  stringifyBalance (balance, bnDecimals) {
    if (balance.eq(zero)) {
      return '0'
    }

    const decimals = parseInt(bnDecimals.toString())
    if (decimals === 0) {
      return balance.toString()
    }

    let bal = balance.toString()
    const len = bal.length
    const decimalIndex = len - decimals
    const result = `${bal.substr(0, len - decimals)}.${bal.substr(decimalIndex, 3)}`
    return result
  }

}
