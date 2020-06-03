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

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype), subClass.prototype.constructor = subClass, 
  subClass.__proto__ = superClass;
}

function _extends() {
  return (_extends = Object.assign || function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
    }
    return target;
  }).apply(this, arguments);
}

var compareOption = function(inputValue, option) {
  void 0 === inputValue && (inputValue = "");
  var candidate = String(inputValue).toLowerCase(), optionValue = String(option.value).toLowerCase(), optionLabel = String(option.label).toLowerCase();
  return optionValue === candidate || optionLabel === candidate;
}, builtins = {
  formatCreateLabel: function(inputValue) {
    return 'Create "' + inputValue + '"';
  },
  isValidNewOption: function(inputValue, selectValue, selectOptions) {
    return !(!inputValue || selectValue.some((function(option) {
      return compareOption(inputValue, option);
    })) || selectOptions.some((function(option) {
      return compareOption(inputValue, option);
    })));
  },
  getNewOptionData: function(inputValue, optionLabel) {
    return {
      label: optionLabel,
      value: inputValue,
      __isNew__: !0
    };
  }
}, defaultProps = _extends({
  allowCreateWhileLoading: !1,
  createOptionPosition: "last"
}, builtins), makeCreatableSelect = function(SelectComponent) {
  var _class, _temp;
  return _temp = _class = function(_Component) {
    function Creatable(props) {
      var _this;
      (_this = _Component.call(this, props) || this).select = void 0, _this.onChange = function(newValue, actionMeta) {
        var _this$props = _this.props, getNewOptionData = _this$props.getNewOptionData, inputValue = _this$props.inputValue, isMulti = _this$props.isMulti, onChange = _this$props.onChange, onCreateOption = _this$props.onCreateOption, value = _this$props.value, name = _this$props.name;
        if ("select-option" !== actionMeta.action) return onChange(newValue, actionMeta);
        var newOption = _this.state.newOption, valueArray = Array.isArray(newValue) ? newValue : [ newValue ];
        if (valueArray[valueArray.length - 1] !== newOption) onChange(newValue, actionMeta); else if (onCreateOption) onCreateOption(inputValue); else {
          var newOptionData = getNewOptionData(inputValue, inputValue), newActionMeta = {
            action: "create-option",
            name: name
          };
          onChange(isMulti ? [].concat(utils.cleanValue(value), [ newOptionData ]) : newOptionData, newActionMeta);
        }
      };
      var options = props.options || [];
      return _this.state = {
        newOption: void 0,
        options: options
      }, _this;
    }
    _inheritsLoose(Creatable, _Component);
    var _proto = Creatable.prototype;
    return _proto.UNSAFE_componentWillReceiveProps = function(nextProps) {
      var allowCreateWhileLoading = nextProps.allowCreateWhileLoading, createOptionPosition = nextProps.createOptionPosition, formatCreateLabel = nextProps.formatCreateLabel, getNewOptionData = nextProps.getNewOptionData, inputValue = nextProps.inputValue, isLoading = nextProps.isLoading, isValidNewOption = nextProps.isValidNewOption, value = nextProps.value, options = nextProps.options || [], newOption = this.state.newOption;
      newOption = isValidNewOption(inputValue, utils.cleanValue(value), options) ? getNewOptionData(inputValue, formatCreateLabel(inputValue)) : void 0, 
      this.setState({
        newOption: newOption,
        options: !allowCreateWhileLoading && isLoading || !newOption ? options : "first" === createOptionPosition ? [ newOption ].concat(options) : [].concat(options, [ newOption ])
      });
    }, _proto.focus = function() {
      this.select.focus();
    }, _proto.blur = function() {
      this.select.blur();
    }, _proto.render = function() {
      var _this2 = this, options = this.state.options;
      return React__default.createElement(SelectComponent, _extends({}, this.props, {
        ref: function(_ref) {
          _this2.select = _ref;
        },
        options: options,
        onChange: this.onChange
      }));
    }, Creatable;
  }(React.Component), _class.defaultProps = defaultProps, _temp;
}, SelectCreatable = makeCreatableSelect(reactSelect.Select), Creatable = stateManager.manageState(SelectCreatable);

exports.default = Creatable, exports.defaultProps = defaultProps, exports.makeCreatableSelect = makeCreatableSelect;
