"use strict";

function _interopDefault(ex) {
  return ex && "object" == typeof ex && "default" in ex ? ex.default : ex;
}

var React = require("react"), React__default = _interopDefault(React);

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
  defaultInputValue: "",
  defaultMenuIsOpen: !1,
  defaultValue: null
}, manageState = function(SelectComponent) {
  var _class, _temp;
  return _temp = _class = function(_Component) {
    function StateManager() {
      for (var _this, _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
      return (_this = _Component.call.apply(_Component, [ this ].concat(args)) || this).select = void 0, 
      _this.state = {
        inputValue: void 0 !== _this.props.inputValue ? _this.props.inputValue : _this.props.defaultInputValue,
        menuIsOpen: void 0 !== _this.props.menuIsOpen ? _this.props.menuIsOpen : _this.props.defaultMenuIsOpen,
        value: void 0 !== _this.props.value ? _this.props.value : _this.props.defaultValue
      }, _this.onChange = function(value, actionMeta) {
        _this.callProp("onChange", value, actionMeta), _this.setState({
          value: value
        });
      }, _this.onInputChange = function(value, actionMeta) {
        var newValue = _this.callProp("onInputChange", value, actionMeta);
        _this.setState({
          inputValue: void 0 !== newValue ? newValue : value
        });
      }, _this.onMenuOpen = function() {
        _this.callProp("onMenuOpen"), _this.setState({
          menuIsOpen: !0
        });
      }, _this.onMenuClose = function() {
        _this.callProp("onMenuClose"), _this.setState({
          menuIsOpen: !1
        });
      }, _this;
    }
    _inheritsLoose(StateManager, _Component);
    var _proto = StateManager.prototype;
    return _proto.focus = function() {
      this.select.focus();
    }, _proto.blur = function() {
      this.select.blur();
    }, _proto.getProp = function(key) {
      return void 0 !== this.props[key] ? this.props[key] : this.state[key];
    }, _proto.callProp = function(name) {
      if ("function" == typeof this.props[name]) {
        for (var _this$props, _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) args[_key2 - 1] = arguments[_key2];
        return (_this$props = this.props)[name].apply(_this$props, args);
      }
    }, _proto.render = function() {
      var _this2 = this, _this$props2 = this.props, props = (_this$props2.defaultInputValue, 
      _this$props2.defaultMenuIsOpen, _this$props2.defaultValue, _objectWithoutPropertiesLoose(_this$props2, [ "defaultInputValue", "defaultMenuIsOpen", "defaultValue" ]));
      return React__default.createElement(SelectComponent, _extends({}, props, {
        ref: function(_ref) {
          _this2.select = _ref;
        },
        inputValue: this.getProp("inputValue"),
        menuIsOpen: this.getProp("menuIsOpen"),
        onChange: this.onChange,
        onInputChange: this.onInputChange,
        onMenuClose: this.onMenuClose,
        onMenuOpen: this.onMenuOpen,
        value: this.getProp("value")
      }));
    }, StateManager;
  }(React.Component), _class.defaultProps = defaultProps, _temp;
};

exports.manageState = manageState;
