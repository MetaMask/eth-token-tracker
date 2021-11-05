const BN = require('ethjs').BN
const zero = new BN(0)

module.exports = {

  stringifyBalance (balance, bnDecimals, balanceDecimals = 3) {
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

    if (decimalIndex <= 0) {
      while (prefix.length <= decimalIndex * -1) {
        prefix += '0'
        len++
      }
      bal = prefix + bal
      decimalIndex = 1
    }

    const whole = bal.substr(0, len - decimals)

    if (balanceDecimals === 0) {
      return whole;
    }

    const fractional = bal.substr(decimalIndex, balanceDecimals)
    if (/0+$/.test(fractional)) {
      let withOnlySigZeroes = bal.substr(decimalIndex).replace(/0+$/, '')
      if (withOnlySigZeroes.length > 0) withOnlySigZeroes = `.${withOnlySigZeroes}`
      return `${whole}${withOnlySigZeroes}`
    }
    return `${whole}.${fractional}`
  }

}
