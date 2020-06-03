"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;
var optionRole = {
  abstract: false,
  accessibleNameRequired: true,
  baseConcepts: [],
  childrenPresentational: true,
  nameFrom: ['author', 'contents'],
  props: {
    'aria-checked': null,
    'aria-posinset': null,
    'aria-selected': 'false',
    'aria-setsize': null
  },
  relatedConcepts: [{
    module: 'HTML',
    concept: {
      name: 'option'
    }
  }, {
    module: 'ARIA',
    concept: {
      name: 'listitem'
    }
  }, {
    module: 'XForms',
    concept: {
      name: 'item'
    }
  }],
  requireContextRole: ['listbox'],
  requiredContextRole: ['listbox'],
  requiredOwnedElements: [],
  requiredProps: {
    'aria-selected': 'false'
  },
  superClass: [['roletype', 'widget', 'input']]
};
var _default = optionRole;
exports.default = _default;