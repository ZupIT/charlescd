import React, { Component } from 'react';
import memoizeOne from 'memoize-one';
import '@emotion/core';
import 'react-dom';
import 'prop-types';
import '../../dist/utils-06b0d5a4.browser.esm.js';
import { x as exportedEqual, w as defaultComponents } from '../../dist/index-4322c0ed.browser.esm.js';
import '@emotion/css';
import 'react-input-autosize';
import { Transition, TransitionGroup } from 'react-transition-group';

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

// strip transition props off before spreading onto select component
// note we need to be explicit about innerRef for flow
var AnimatedInput = function AnimatedInput(WrappedComponent) {
  return function (_ref) {
    var inProp = _ref.in,
        onExited = _ref.onExited,
        appear = _ref.appear,
        enter = _ref.enter,
        exit = _ref.exit,
        props = _objectWithoutPropertiesLoose(_ref, ["in", "onExited", "appear", "enter", "exit"]);

    return React.createElement(WrappedComponent, props);
  };
};

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutPropertiesLoose$1(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
var Fade = function Fade(_ref) {
  var Tag = _ref.component,
      _ref$duration = _ref.duration,
      duration = _ref$duration === void 0 ? 1 : _ref$duration,
      inProp = _ref.in,
      onExited = _ref.onExited,
      props = _objectWithoutPropertiesLoose$1(_ref, ["component", "duration", "in", "onExited"]);

  var transition = {
    entering: {
      opacity: 0
    },
    entered: {
      opacity: 1,
      transition: "opacity " + duration + "ms"
    },
    exiting: {
      opacity: 0
    },
    exited: {
      opacity: 0
    }
  };
  return React.createElement(Transition, {
    mountOnEnter: true,
    unmountOnExit: true,
    in: inProp,
    timeout: duration
  }, function (state) {
    var innerProps = {
      style: _extends({}, transition[state])
    };
    return React.createElement(Tag, _extends({
      innerProps: innerProps
    }, props));
  });
}; // ==============================
// Collapse Transition
// ==============================

var collapseDuration = 260;
// wrap each MultiValue with a collapse transition; decreases width until
// finally removing from DOM
var Collapse =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(Collapse, _Component);

  function Collapse() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _Component.call.apply(_Component, [this].concat(args)) || this;
    _this.duration = collapseDuration;
    _this.rafID = void 0;
    _this.state = {
      width: 'auto'
    };
    _this.transition = {
      exiting: {
        width: 0,
        transition: "width " + _this.duration + "ms ease-out"
      },
      exited: {
        width: 0
      }
    };

    _this.getWidth = function (ref) {
      if (ref && isNaN(_this.state.width)) {
        /*
          Here we're invoking requestAnimationFrame with a callback invoking our
          call to getBoundingClientRect and setState in order to resolve an edge case
          around portalling. Certain portalling solutions briefly remove children from the DOM
          before appending them to the target node. This is to avoid us trying to call getBoundingClientrect
          while the Select component is in this state.
        */
        // cannot use `offsetWidth` because it is rounded
        _this.rafID = window.requestAnimationFrame(function () {
          var _ref$getBoundingClien = ref.getBoundingClientRect(),
              width = _ref$getBoundingClien.width;

          _this.setState({
            width: width
          });
        });
      }
    };

    _this.getStyle = function (width) {
      return {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        width: width
      };
    };

    _this.getTransition = function (state) {
      return _this.transition[state];
    };

    return _this;
  }

  var _proto = Collapse.prototype;

  _proto.componentWillUnmount = function componentWillUnmount() {
    if (this.rafID) {
      window.cancelAnimationFrame(this.rafID);
    }
  } // width must be calculated; cannot transition from `undefined` to `number`
  ;

  _proto.render = function render() {
    var _this2 = this;

    var _this$props = this.props,
        children = _this$props.children,
        inProp = _this$props.in;
    var width = this.state.width;
    return React.createElement(Transition, {
      enter: false,
      mountOnEnter: true,
      unmountOnExit: true,
      in: inProp,
      timeout: this.duration
    }, function (state) {
      var style = _extends({}, _this2.getStyle(width), _this2.getTransition(state));

      return React.createElement("div", {
        ref: _this2.getWidth,
        style: style
      }, children);
    });
  };

  return Collapse;
}(Component);

function _extends$1() { _extends$1 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1.apply(this, arguments); }

function _objectWithoutPropertiesLoose$2(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var AnimatedMultiValue = function AnimatedMultiValue(WrappedComponent) {
  return function (_ref) {
    var inProp = _ref.in,
        onExited = _ref.onExited,
        props = _objectWithoutPropertiesLoose$2(_ref, ["in", "onExited"]);

    return React.createElement(Collapse, {
      in: inProp,
      onExited: onExited
    }, React.createElement(WrappedComponent, _extends$1({
      cropWithEllipsis: inProp
    }, props)));
  };
};

function _extends$2() { _extends$2 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2.apply(this, arguments); }

var AnimatedPlaceholder = function AnimatedPlaceholder(WrappedComponent) {
  return function (props) {
    return React.createElement(Fade, _extends$2({
      component: WrappedComponent,
      duration: props.isMulti ? collapseDuration : 1
    }, props));
  };
};

function _extends$3() { _extends$3 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$3.apply(this, arguments); }

var AnimatedSingleValue = function AnimatedSingleValue(WrappedComponent) {
  return function (props) {
    return React.createElement(Fade, _extends$3({
      component: WrappedComponent
    }, props));
  };
};

function _extends$4() { _extends$4 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$4.apply(this, arguments); }

// make ValueContainer a transition group
var AnimatedValueContainer = function AnimatedValueContainer(WrappedComponent) {
  return function (props) {
    return React.createElement(TransitionGroup, _extends$4({
      component: WrappedComponent
    }, props));
  };
};

function _extends$5() { _extends$5 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$5.apply(this, arguments); }

function _objectWithoutPropertiesLoose$3(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var makeAnimated = function makeAnimated(externalComponents) {
  if (externalComponents === void 0) {
    externalComponents = {};
  }

  var components = defaultComponents({
    components: externalComponents
  });

  var Input = components.Input,
      MultiValue = components.MultiValue,
      Placeholder = components.Placeholder,
      SingleValue = components.SingleValue,
      ValueContainer = components.ValueContainer,
      rest = _objectWithoutPropertiesLoose$3(components, ["Input", "MultiValue", "Placeholder", "SingleValue", "ValueContainer"]);

  return _extends$5({
    Input: AnimatedInput(Input),
    MultiValue: AnimatedMultiValue(MultiValue),
    Placeholder: AnimatedPlaceholder(Placeholder),
    SingleValue: AnimatedSingleValue(SingleValue),
    ValueContainer: AnimatedValueContainer(ValueContainer)
  }, rest);
};

var AnimatedComponents = makeAnimated();
var Input = AnimatedComponents.Input;
var MultiValue = AnimatedComponents.MultiValue;
var Placeholder = AnimatedComponents.Placeholder;
var SingleValue = AnimatedComponents.SingleValue;
var ValueContainer = AnimatedComponents.ValueContainer;
var index = memoizeOne(makeAnimated, exportedEqual);

export default index;
export { Input, MultiValue, Placeholder, SingleValue, ValueContainer };
