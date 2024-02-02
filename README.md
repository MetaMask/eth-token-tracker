# Eth Token Tracker

A JS module for tracking Ethereum tokens and their values over time.

## Installation

`yarn install '@metamask/eth-token-tracker'`

## Usage

```javascript
const TokenTracker = require('@metamask/eth-token-tracker')

var tokenTracker = new TokenTracker({

  userAddress: addresses[0], // whose balance to track
  provider,                  // a web3-style provider
  pollingInterval: 4000,     // block polling interval (optional)

  // Tell it about the tokens to track:
  tokens: [
    {
      address: tokenAddress,
    }
  ],
})

// You can use this method to check the state of the tokens
var balances = tokenTracker.serialize()

// You can also subscribe to updates
tokenTracker.on('update', function (balances) {
  console.log(`Your balance of ${balances[0].symbol} is ${balances[0].string}`)
})

// You can add additional tokens after initialization:
tokenTracker.add({ address: otherTokenAddress })

// Make sure to clean up, or it will hold a reference:
tokenTracker.stop()
```

## Running tests

```bash
yarn setup
yarn test
```
