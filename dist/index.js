'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Eth = require('ethjs-query');
var EthContract = require('ethjs-contract');
var Token = require('./token');
var BlockTracker = require('eth-block-tracker');
var abi = require('human-standard-token-abi');
var SafeEventEmitter = require('safe-event-emitter');
var deepEqual = require('deep-equal');

var TokenTracker = function (_SafeEventEmitter) {
  (0, _inherits3.default)(TokenTracker, _SafeEventEmitter);

  function TokenTracker() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, TokenTracker);

    var _this = (0, _possibleConstructorReturn3.default)(this, (TokenTracker.__proto__ || (0, _getPrototypeOf2.default)(TokenTracker)).call(this));

    _this.userAddress = opts.userAddress || '0x0';
    _this.provider = opts.provider;
    var pollingInterval = opts.pollingInterval || 4000;
    _this.blockTracker = new BlockTracker({
      provider: _this.provider,
      pollingInterval: pollingInterval
    });

    _this.eth = new Eth(_this.provider);
    _this.contract = new EthContract(_this.eth);
    _this.TokenContract = _this.contract(abi);

    var tokens = opts.tokens || [];

    _this.tokens = tokens.map(function (tokenOpts) {
      return _this.createTokenFrom(tokenOpts);
    });

    _this.updateBalances = _this.updateBalances.bind(_this);

    _this.running = true;
    _this.blockTracker.on('latest', _this.updateBalances);
    return _this;
  }

  (0, _createClass3.default)(TokenTracker, [{
    key: 'serialize',
    value: function serialize() {
      return this.tokens.map(function (token) {
        return token.serialize();
      });
    }
  }, {
    key: 'updateBalances',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        var oldBalances, newBalances;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                oldBalances = this.serialize();
                _context.prev = 1;
                _context.next = 4;
                return _promise2.default.all(this.tokens.map(function (token) {
                  return token.updateBalance();
                }));

              case 4:
                newBalances = this.serialize();

                if (!deepEqual(newBalances, oldBalances)) {
                  if (this.running) {
                    this.emit('update', newBalances);
                  }
                }
                _context.next = 11;
                break;

              case 8:
                _context.prev = 8;
                _context.t0 = _context['catch'](1);

                this.emit('error', _context.t0);

              case 11:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[1, 8]]);
      }));

      function updateBalances() {
        return _ref.apply(this, arguments);
      }

      return updateBalances;
    }()
  }, {
    key: 'createTokenFrom',
    value: function createTokenFrom(opts) {
      var owner = this.userAddress;
      var address = opts.address,
          symbol = opts.symbol,
          balance = opts.balance,
          decimals = opts.decimals;

      var contract = this.TokenContract.at(address);
      return new Token({ address: address, symbol: symbol, balance: balance, decimals: decimals, contract: contract, owner: owner });
    }
  }, {
    key: 'add',
    value: function add(opts) {
      var token = this.createTokenFrom(opts);
      this.tokens.push(token);
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.running = false;
      this.blockTracker.removeListener('latest', this.updateBalances);
    }
  }]);
  return TokenTracker;
}(SafeEventEmitter);

module.exports = TokenTracker;