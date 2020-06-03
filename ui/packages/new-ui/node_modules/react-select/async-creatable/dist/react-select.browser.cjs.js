'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('react');
require('memoize-one');
require('@emotion/core');
require('react-dom');
require('prop-types');
require('../../dist/utils-896a48cb.browser.cjs.js');
require('../../dist/index-30113876.browser.cjs.js');
var reactSelect = require('../../dist/Select-b0ada71d.browser.cjs.js');
require('@emotion/css');
require('react-input-autosize');
var stateManager = require('../../dist/stateManager-61815400.browser.cjs.js');
var reactSelect$1 = require('../../async/dist/react-select.browser.cjs.js');
var reactSelect$2 = require('../../creatable/dist/react-select.browser.cjs.js');

var SelectCreatable = reactSelect$2.makeCreatableSelect(reactSelect.Select);
var SelectCreatableState = stateManager.manageState(SelectCreatable);
var AsyncCreatable = reactSelect$1.makeAsyncSelect(SelectCreatableState);

exports.default = AsyncCreatable;
