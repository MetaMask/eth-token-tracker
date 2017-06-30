'use strict';

var BN = require('ethjs').BN;
var zero = new BN(0);

module.exports = {
  stringifyBalance: function stringifyBalance(balance, bnDecimals) {
    if (balance.eq(zero)) {
      return '0';
    }

    var decimals = parseInt(bnDecimals.toString());
    if (decimals === 0) {
      return balance.toString();
    }

    var bal = balance.toString();
    var len = bal.length;
    var decimalIndex = len - decimals;
    var result = bal.substr(0, len - decimals) + '.' + bal.substr(decimalIndex, 3);
    return result;
  }
};