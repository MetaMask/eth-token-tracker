# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [10.0.0]

### Changed

- **BREAKING**: Adapt to EIP-1193 provider changes by replacing the deprecated `sendAsync` method with the `request` method ([#143](https://github.com/MetaMask/eth-token-tracker/pull/143))
- **BREAKING**: Bump `@metamask/eth-block-tracker` from `^10.1.0` to `^11.0.1` ([#148](https://github.com/MetaMask/eth-token-tracker/pull/148))

## [9.0.0]

### Changed

- **BREAKING**: Drop support for Node.js v16 and v21 ([#140](https://github.com/MetaMask/eth-token-tracker/pull/140))
- Update `@metamask/eth-block-tracker` from `^9.0.2` to `^10.0.0` ([#141](https://github.com/MetaMask/eth-token-tracker/pull/141))

## [8.0.0]

### Removed

- **BREAKING**: Remove properties `eth`, `contract`, `provider` from `TokenTracker` class ([#121](https://github.com/MetaMask/eth-token-tracker/pull/121))

### Fixed

- Update dependency `eth-block-tracker` from `^8.0.0` to `^9.0.2` ([#133](https://github.com/MetaMask/eth-token-tracker/pull/133))
  - Mitigates polling-loop related concurrency issue in the block tracker.

## [7.0.2]

### Fixed

- Remove dependency on `babel-runtime` (#117)
- Add missing peerDependency `@babel/runtime` (#120)
  - This is not a breaking change because this has always been an implicit dependency of this package.
- Update `bn.js` from `^4.12.0` to `^5.2.1` (#117)
- Update `@metamask/ethjs-contract` from `^0.3.4` to `^0.4.1` (#117)
- Update `@metamask/ethjs-query` from `^0.5.2` to `^0.7.1` (#117)

## [7.0.1] - 2023-12-20

### Fixed

- Update `ethjs` packages to `@metamask/` maintenance forks (#115)

## [7.0.0] - 2023-10-13

### Changed

- **BREAKING**: Update dependency eth-block-tracker@^7.1.0->^8.0.0 (#111)

## [6.0.1] - 2023-10-11

### Fixed

- Update dependency safe-event-emitter@^2.0.0->^3.0.0 (#108)

## [6.0.0] - 2023-08-04

### Changed

- **BREAKING**: Set the minimum Node.js version to v16 (#105)
- Update dependency eth-block-tracker@^6.1.0->^7.1.0 (#105)

## [5.0.0] - 2023-07-25

### Changed

- **BREAKING**: Set the minimum Node.js version to v14 (#104)
- Update dependency eth-block-tracker@^5.0.1->^6.1.0 (#104)

## [4.1.0] - 2023-04-24

### Changed

- Update dependencies
  - deep-equal@1.1.0->2.2.0
  - ethjs@0.3.6->0.4.0
  - ethjs-contract@0.2.1->0.2.3
  - ethjs-query@0.3.7->0.3.8

## [4.0.1] - 2023-04-24

### Fixed

- Fix Node.js v14+ compatibility (#86)
- Update dependencies
  - eth-block-tracker@4.4.2->5.0.1
  - @metamask/safe-event-emitter@1.0.1->2.0.0
  - Remove unused web3-provider-engine
  - Various security and maintenance bumps (#85,#84,#75,#77,#80,#83,#89,#91)

## [4.0.0] - 2022-01-10

### Changed

- **BREAKING**: Set the minimum Node.js version to v12 (#58)
- Support configuration of the number of decimals in the balance returned by `stringify`, via a new `balanceDecimals` property on the config object passed to the Token constructor (#71)

### Fixed

- Properly clear error state after retrieving a balance successfully (#73)

## [3.1.0] - 2020-11-17

### Added

- Add ability to include tokens with balance errors in update events, behind an option flag (#53)

## [3.0.1] - 2020-09-11

### Fixed

- Ensure balances >= 0.1 and < 1 start with a zero (#47)

## [3.0.0] - 2020-07-22

### Changed

- **BREAKING**: Change the output format of string property to include significant digits (#44)

### Security

- Update 'lodash' to address security advisory (#43)

## [2.0.0] - 2020-03-30

### Changed

- **BREAKING**: Validate token parameters (#30)
- **BREAKING**: Emit events for initial token updates (#34)
- **BREAKING**: Move package under '@metamask' scope (#40)
- Ignore extraneous files when publishing (#36)

### Fixed

- Prevent redundant update caused by simultaneous token updates (#32)
- Ensure first token update is always emitted (#33)

### Security

- Update 'mkdirp' and 'minimist' to address security advisory (#27)
- Update 'kind-of' to address security advisory (#28)

[Unreleased]: https://github.com/MetaMask/eth-token-tracker/compare/v10.0.0...HEAD
[10.0.0]: https://github.com/MetaMask/eth-token-tracker/compare/v9.0.0...v10.0.0
[9.0.0]: https://github.com/MetaMask/eth-token-tracker/compare/v8.0.0...v9.0.0
[8.0.0]: https://github.com/MetaMask/eth-token-tracker/compare/v7.0.2...v8.0.0
[7.0.2]: https://github.com/MetaMask/eth-token-tracker/compare/v7.0.1...v7.0.2
[7.0.1]: https://github.com/MetaMask/eth-token-tracker/compare/v7.0.0...v7.0.1
[7.0.0]: https://github.com/MetaMask/eth-token-tracker/compare/v6.0.1...v7.0.0
[6.0.1]: https://github.com/MetaMask/eth-token-tracker/compare/v6.0.0...v6.0.1
[6.0.0]: https://github.com/MetaMask/eth-token-tracker/compare/v5.0.0...v6.0.0
[5.0.0]: https://github.com/MetaMask/eth-token-tracker/compare/v4.1.0...v5.0.0
[4.1.0]: https://github.com/MetaMask/eth-token-tracker/compare/v4.0.1...v4.1.0
[4.0.1]: https://github.com/MetaMask/eth-token-tracker/compare/v4.0.0...v4.0.1
[4.0.0]: https://github.com/MetaMask/eth-token-tracker/compare/v3.1.0...v4.0.0
[3.1.0]: https://github.com/MetaMask/eth-token-tracker/compare/v3.0.1...v3.1.0
[3.0.1]: https://github.com/MetaMask/eth-token-tracker/compare/v3.0.0...v3.0.1
[3.0.0]: https://github.com/MetaMask/eth-token-tracker/compare/v2.0.0...v3.0.0
[2.0.0]: https://github.com/MetaMask/eth-token-tracker/releases/tag/v2.0.0
