"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;
var cellRole = {
  abstract: false,
  accessibleNameRequired: false,
  baseConcepts: [],
  childrenPresentational: false,
  nameFrom: ['author', 'contents'],
  props: {
    'aria-colindex': null,
    'aria-colspan': null,
    'aria-rowindex': null,
    'aria-rowspan': null
  },
  relatedConcepts: [{
    module: 'HTML',
    concept: {
      name: 'td',
      constraints: ['descendant of table']
    }
  }],
  requireContextRole: ['row'],
  requiredContextRole: ['row'],
  requiredOwnedElements: [],
  requiredProps: {},
  superClass: [['roletype', 'structure', 'section']]
};
var _default = cellRole;
exports.default = _default;