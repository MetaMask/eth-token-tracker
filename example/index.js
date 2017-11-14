const TokenTracker = require('../')
const Eth = require('ethjs')
const eth = new Eth(new Eth.HttpProvider('https://mainnet.infura.io'))

const userAddress = '0x2a7750ce195376166e4abdc916e64b48d6da19aa'
const tokenAddress = '0xc138c004F23E0246dA3AB1a2c945659036b95495'

var tokenTracker = new TokenTracker({

  provider: eth.currentProvider,
  userAddress,
  tokens: [
    {
      address: tokenAddress,
    }
  ],
})

// You can use this method to check the state of the tokens
window.setInterval(function checkBalance () {
  var balances = tokenTracker.serialize()
  console.log('serialized', balances)
  infoParagraph.innerText = JSON.stringify(balances)
}, 1000)
console.dir(tokenTracker)

// You can also subscribe to updates
tokenTracker.on('update', function (balances) {
  console.log(`Your balance of ${balances[0].symbol} is ${balances[0].string}`)
})

window.tokenTracker = tokenTracker

tokenTracker.on('error', function (reason) {
  console.log('there was a problem!', reason)
  console.trace(reason)
})

