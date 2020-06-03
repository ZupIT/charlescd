import React, { Component } from 'react';
import memoizeOne from 'memoize-one';
import { CacheProvider } from '@emotion/core';
import 'react-dom';
import 'prop-types';
import './utils-06b0d5a4.browser.esm.js';
export { y as components } from './index-4322c0ed.browser.esm.js';
import { S as Select } from './Select-9fdb8cd0.browser.esm.js';
export { c as createFilter, a as defaultTheme, m as mergeStyles } from './Select-9fdb8cd0.browser.esm.js';
import '@emotion/css';
import 'react-input-autosize';
import { m as manageState } from './stateManager-04f734a2.browser.esm.js';
import createCache from '@emotion/cache';

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var NonceProvider =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(NonceProvider, _Component);

  function NonceProvider(props) {
    var _this;

    _this = _Component.call(this, props) || this;

    _this.createEmotionCache = function (nonce) {
      return createCache({
        nonce: nonce
      });
    };

    _this.createEmotionCache = memoizeOne(_this.createEmotionCache);
    return _this;
  }

  var _proto = NonceProvider.prototype;

  _proto.render = function render() {
    var emotionCache = this.createEmotionCache(this.props.nonce);
    return React.createElement(CacheProvider, {
      value: emotionCache
    }, this.props.children);
  };

  return NonceProvider;
}(Component);

var index = manageState(Select);

export default index;
export { NonceProvider };
