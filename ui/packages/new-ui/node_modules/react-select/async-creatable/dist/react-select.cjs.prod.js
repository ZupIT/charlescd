"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), require("react"), require("memoize-one"), require("@emotion/core"), require("react-dom"), 
require("prop-types"), require("../../dist/utils-2db2ca57.cjs.prod.js"), require("../../dist/index-4f270825.cjs.prod.js");

var reactSelect = require("../../dist/Select-95fb2b5c.cjs.prod.js");

require("@emotion/css"), require("react-input-autosize");

var stateManager = require("../../dist/stateManager-1f3302b2.cjs.prod.js"), reactSelect$1 = require("../../async/dist/react-select.cjs.prod.js"), reactSelect$2 = require("../../creatable/dist/react-select.cjs.prod.js"), SelectCreatable = reactSelect$2.makeCreatableSelect(reactSelect.Select), SelectCreatableState = stateManager.manageState(SelectCreatable), AsyncCreatable = reactSelect$1.makeAsyncSelect(SelectCreatableState);

exports.default = AsyncCreatable;
