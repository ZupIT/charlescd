"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;
var gridcellRole = {
  abstract: false,
  accessibleNameRequired: true,
  baseConcepts: [],
  childrenPresentational: false,
  nameFrom: ['author', 'contents'],
  props: {
    'aria-readonly': null,
    'aria-required': null,
    'aria-selected': null
  },
  relatedConcepts: [{
    module: 'HTML',
    concept: {
      name: 'td',
      attributes: [{
        name: 'role',
        value: 'gridcell'
      }]
    }
  }],
  requireContextRole: ['row'],
  requiredContextRole: ['row'],
  requiredOwnedElements: [],
  requiredProps: {},
  superClass: [['roletype', 'structure', 'section', 'cell'], ['roletype', 'widget']]
};
var _default = gridcellRole;
exports.default = _default;