"use strict";

function _interopDefault(ex) {
  return ex && "object" == typeof ex && "default" in ex ? ex.default : ex;
}

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var React = require("react"), React__default = _interopDefault(React);

require("memoize-one"), require("@emotion/core"), require("react-dom"), require("prop-types");

var utils = require("../../dist/utils-2db2ca57.cjs.prod.js");

require("../../dist/index-4f270825.cjs.prod.js");

var reactSelect = require("../../dist/Select-95fb2b5c.cjs.prod.js");

require("@emotion/css"), require("react-input-autosize");

var stateManager = require("../../dist/stateManager-1f3302b2.cjs.prod.js");

function _extends() {
  return (_extends = Object.assign || function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
    }
    return target;
  }).apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (null == source) return {};
  var key, i, target = {}, sourceKeys = Object.keys(source);
  for (i = 0; i < sourceKeys.length; i++) key = sourceKeys[i], excluded.indexOf(key) >= 0 || (target[key] = source[key]);
  return target;
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype), subClass.prototype.constructor = subClass, 
  subClass.__proto__ = superClass;
}

var defaultProps = {
  cacheOptions: !1,
  defaultOptions: !1,
  filterOption: null,
  isLoading: !1
}, makeAsyncSelect = function(SelectComponent) {
  var _class, _temp;
  return _temp = _class = function(_Component) {
    function Async(props) {
      var _this;
      return (_this = _Component.call(this) || this).select = void 0, _this.lastRequest = void 0, 
      _this.mounted = !1, _this.optionsCache = {}, _this.handleInputChange = function(newValue, actionMeta) {
        var _this$props = _this.props, cacheOptions = _this$props.cacheOptions, onInputChange = _this$props.onInputChange, inputValue = utils.handleInputChange(newValue, actionMeta, onInputChange);
        if (!inputValue) return delete _this.lastRequest, void _this.setState({
          inputValue: "",
          loadedInputValue: "",
          loadedOptions: [],
          isLoading: !1,
          passEmptyOptions: !1
        });
        if (cacheOptions && _this.optionsCache[inputValue]) _this.setState({
          inputValue: inputValue,
          loadedInputValue: inputValue,
          loadedOptions: _this.optionsCache[inputValue],
          isLoading: !1,
          passEmptyOptions: !1
        }); else {
          var request = _this.lastRequest = {};
          _this.setState({
            inputValue: inputValue,
            isLoading: !0,
            passEmptyOptions: !_this.state.loadedInputValue
          }, (function() {
            _this.loadOptions(inputValue, (function(options) {
              _this.mounted && (options && (_this.optionsCache[inputValue] = options), request === _this.lastRequest && (delete _this.lastRequest, 
              _this.setState({
                isLoading: !1,
                loadedInputValue: inputValue,
                loadedOptions: options || [],
                passEmptyOptions: !1
              })));
            }));
          }));
        }
        return inputValue;
      }, _this.state = {
        defaultOptions: Array.isArray(props.defaultOptions) ? props.defaultOptions : void 0,
        inputValue: void 0 !== props.inputValue ? props.inputValue : "",
        isLoading: !0 === props.defaultOptions,
        loadedOptions: [],
        passEmptyOptions: !1
      }, _this;
    }
    _inheritsLoose(Async, _Component);
    var _proto = Async.prototype;
    return _proto.componentDidMount = function() {
      var _this2 = this;
      this.mounted = !0;
      var defaultOptions = this.props.defaultOptions, inputValue = this.state.inputValue;
      !0 === defaultOptions && this.loadOptions(inputValue, (function(options) {
        if (_this2.mounted) {
          var isLoading = !!_this2.lastRequest;
          _this2.setState({
            defaultOptions: options || [],
            isLoading: isLoading
          });
        }
      }));
    }, _proto.UNSAFE_componentWillReceiveProps = function(nextProps) {
      nextProps.cacheOptions !== this.props.cacheOptions && (this.optionsCache = {}), 
      nextProps.defaultOptions !== this.props.defaultOptions && this.setState({
        defaultOptions: Array.isArray(nextProps.defaultOptions) ? nextProps.defaultOptions : void 0
      });
    }, _proto.componentWillUnmount = function() {
      this.mounted = !1;
    }, _proto.focus = function() {
      this.select.focus();
    }, _proto.blur = function() {
      this.select.blur();
    }, _proto.loadOptions = function(inputValue, callback) {
      var loadOptions = this.props.loadOptions;
      if (!loadOptions) return callback();
      var loader = loadOptions(inputValue, callback);
      loader && "function" == typeof loader.then && loader.then(callback, (function() {
        return callback();
      }));
    }, _proto.render = function() {
      var _this3 = this, _this$props2 = this.props, isLoadingProp = (_this$props2.loadOptions, 
      _this$props2.isLoading), props = _objectWithoutPropertiesLoose(_this$props2, [ "loadOptions", "isLoading" ]), _this$state = this.state, defaultOptions = _this$state.defaultOptions, inputValue = _this$state.inputValue, isLoading = _this$state.isLoading, loadedInputValue = _this$state.loadedInputValue, loadedOptions = _this$state.loadedOptions, options = _this$state.passEmptyOptions ? [] : inputValue && loadedInputValue ? loadedOptions : defaultOptions || [];
      return React__default.createElement(SelectComponent, _extends({}, props, {
        ref: function(_ref) {
          _this3.select = _ref;
        },
        options: options,
        isLoading: isLoading || isLoadingProp,
        onInputChange: this.handleInputChange
      }));
    }, Async;
  }(React.Component), _class.defaultProps = defaultProps, _temp;
}, SelectState = stateManager.manageState(reactSelect.Select), Async = makeAsyncSelect(SelectState);

exports.default = Async, exports.defaultProps = defaultProps, exports.makeAsyncSelect = makeAsyncSelect;
