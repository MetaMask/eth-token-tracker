# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
