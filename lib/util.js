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
    let len = bal.length
    let decimalIndex = len - decimals
    let prefix = ''

    if (decimalIndex < 0) {
      while (prefix.length <= decimalIndex * -1) {
        prefix += '0'
        len++
      }
      bal = prefix + bal
      decimalIndex = 1
    }

    const result = `${bal.substr(0, len - decimals)}.${bal.substr(decimalIndex, 3)}`
    return result
  }

}
