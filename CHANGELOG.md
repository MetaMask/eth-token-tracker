# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [7.0.2]
- Update `bn.js` from `^4.12.0` to `^5.2.1` (#117)
- Update `@metamask/ethjs-contract` from `^0.3.4` to `^0.4.1` (#117)
- Update `@metamask/ethjs-query` from `^0.5.2` to `^0.7.1` (#117)
- Remove dependency on `babel-runtime` (#117)
- Add missing peerDependency `@babel/runtime` (#120)
  - This is not a breaking change because this has always been an implicit dependency of this package.

## [7.0.1] - 2023-12-20
- Update `ethjs` packages to `@metamask/` maintenance forks (#115)

## [7.0.0] - 2023-10-13
- **BREAKING**: Update dependency eth-block-tracker@^7.1.0->^8.0.0 (#111)

## [6.0.1] - 2023-10-11
- Update dependency safe-event-emitter@^2.0.0->^3.0.0 (#108)

## [6.0.0] - 2023-08-04
- **BREAKING**: Set the minimum Node.js version to v16 (#105)
- Update dependency eth-block-tracker@^6.1.0->^7.1.0 (#105)

## [5.0.0] - 2023-07-25
- **BREAKING**: Set the minimum Node.js version to v14 (#104)
- Update dependency eth-block-tracker@^5.0.1->^6.1.0 (#104)

## [4.1.0] - 2023-04-24
- Update dependencies
  - deep-equal@1.1.0->2.2.0
  - ethjs@0.3.6->0.4.0
  - ethjs-contract@0.2.1->0.2.3
  - ethjs-query@0.3.7->0.3.8

## [4.0.1] - 2023-04-24
- Fix Node.js v14+ compatibility (#86)
- Update dependencies
  - eth-block-tracker@4.4.2->5.0.1
  - @metamask/safe-event-emitter@1.0.1->2.0.0
  - Remove unused web3-provider-engine
  - Various security and maintenance bumps (#85,#84,#75,#77,#80,#83,#89,#91)

## [4.0.0] - 2022-01-10
- Set the minimum Node.js version to v12 (#58)
- Support configuration of the number of decimals in the balance returned by `stringify`, via a new `balanceDecimals`
property on the config object passed to the Token constructor (#71)
- Properly clear error state after retrieving a balance successfully (#73)

## [3.1.0] - 2020-11-17
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
