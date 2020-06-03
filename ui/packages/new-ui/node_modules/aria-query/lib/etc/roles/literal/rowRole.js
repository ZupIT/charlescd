"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;
var rowRole = {
  abstract: false,
  accessibleNameRequired: false,
  baseConcepts: [],
  childrenPresentational: false,
  nameFrom: ['author', 'contents'],
  props: {
    'aria-colindex': null,
    'aria-level': null,
    'aria-rowindex': null,
    'aria-selected': null
  },
  relatedConcepts: [{
    module: 'HTML',
    concept: {
      name: 'tr'
    }
  }],
  requireContextRole: ['grid', 'rowgroup', 'table', 'treegrid'],
  requiredContextRole: ['grid', 'rowgroup', 'table', 'treegrid'],
  requiredOwnedElements: [['cell'], ['columnheader'], ['gridcell'], ['rowheader']],
  requiredProps: {},
  superClass: [['roletype', 'structure', 'section', 'group'], ['roletype', 'widget']]
};
var _default = rowRole;
exports.default = _default;