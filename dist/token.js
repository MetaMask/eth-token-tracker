'use strict';

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BN = require('ethjs').BN;
var util = require('./util');

var Token = function () {
  function Token() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, Token);
    var address = opts.address,
        symbol = opts.symbol,
        balance = opts.balance,
        decimals = opts.decimals,
        contract = opts.contract,
        owner = opts.owner;

    this.isLoading = !address || !symbol || !balance || !decimals;
    this.address = address || '0x0';
    this.symbol = symbol;
    this.balance = new BN(balance || '0', 16);
    this.decimals = decimals ? new BN(decimals) : undefined;
    this.owner = owner;

    this.contract = contract;
    this.update().catch(function (reason) {
      console.error('token updating failed', reason);
    });
  }

  (0, _createClass3.default)(Token, [{
    key: 'update',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
        var results;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _promise2.default.all([this.symbol || this.updateSymbol(), this.updateBalance(), this.decimals || this.updateDecimals()]);

              case 2:
                results = _context.sent;

                this.isLoading = false;
                return _context.abrupt('return', results);

              case 5:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function update() {
        return _ref.apply(this, arguments);
      }

      return update;
    }()
  }, {
    key: 'serialize',
    value: function serialize() {
      return {
        address: this.address,
        symbol: this.symbol,
        balance: this.balance.toString(10),
        decimals: this.decimals ? parseInt(this.decimals.toString()) : 0,
        string: this.stringify()
      };
    }
  }, {
    key: 'stringify',
    value: function stringify() {
      return util.stringifyBalance(this.balance, this.decimals || new BN(0));
    }
  }, {
    key: 'updateSymbol',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
        var symbol;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.updateValue('symbol');

              case 2:
                symbol = _context2.sent;

                this.symbol = symbol || 'TKN';
                return _context2.abrupt('return', this.symbol);

              case 5:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function updateSymbol() {
        return _ref2.apply(this, arguments);
      }

      return updateSymbol;
    }()
  }, {
    key: 'updateBalance',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
        var balance;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.updateValue('balance');

              case 2:
                balance = _context3.sent;

                this.balance = balance;
                return _context3.abrupt('return', this.balance);

              case 5:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function updateBalance() {
        return _ref3.apply(this, arguments);
      }

      return updateBalance;
    }()
  }, {
    key: 'updateDecimals',
    value: function () {
      var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {
        var decimals;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (!(this.decimals !== undefined)) {
                  _context4.next = 2;
                  break;
                }

                return _context4.abrupt('return', this.decimals);

              case 2:
                _context4.next = 4;
                return this.updateValue('decimals');

              case 4:
                decimals = _context4.sent;

                if (decimals) {
                  this.decimals = decimals;
                }
                return _context4.abrupt('return', this.decimals);

              case 7:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function updateDecimals() {
        return _ref4.apply(this, arguments);
      }

      return updateDecimals;
    }()
  }, {
    key: 'updateValue',
    value: function () {
      var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(key) {
        var methodName, args, result, _contract, val;

        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                methodName = void 0;
                args = [];
                _context5.t0 = key;
                _context5.next = _context5.t0 === 'balance' ? 5 : 8;
                break;

              case 5:
                methodName = 'balanceOf';
                args = [this.owner];
                return _context5.abrupt('break', 9);

              case 8:
                methodName = key;

              case 9:
                result = void 0;
                _context5.prev = 10;
                _context5.next = 13;
                return (_contract = this.contract)[methodName].apply(_contract, (0, _toConsumableArray3.default)(args));

              case 13:
                result = _context5.sent;
                _context5.next = 21;
                break;

              case 16:
                _context5.prev = 16;
                _context5.t1 = _context5['catch'](10);

                console.warn('failed to load ' + key + ' for token at ' + this.address);

                if (!(key === 'balance')) {
                  _context5.next = 21;
                  break;
                }

                throw _context5.t1;

              case 21:
                if (!result) {
                  _context5.next = 25;
                  break;
                }

                val = result[0];

                this[key] = val;
                return _context5.abrupt('return', val);

              case 25:
                return _context5.abrupt('return', this[key]);

              case 26:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this, [[10, 16]]);
      }));

      function updateValue(_x2) {
        return _ref5.apply(this, arguments);
      }

      return updateValue;
    }()
  }]);
  return Token;
}();

module.exports = Token;