"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;
var tableRole = {
  abstract: false,
  accessibleNameRequired: true,
  baseConcepts: [],
  childrenPresentational: false,
  nameFrom: ['author'],
  props: {
    'aria-colcount': null,
    'aria-rowcount': null
  },
  relatedConcepts: [{
    module: 'HTML',
    concept: {
      name: 'table'
    }
  }],
  requireContextRole: [],
  requiredContextRole: [],
  requiredOwnedElements: [['row'], ['rowgroup', 'row']],
  requiredProps: {},
  superClass: [['roletype', 'structure', 'section']]
};
var _default = tableRole;
exports.default = _default;