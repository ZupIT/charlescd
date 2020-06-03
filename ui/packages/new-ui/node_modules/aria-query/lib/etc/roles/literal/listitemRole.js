"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;
var listitemRole = {
  abstract: false,
  accessibleNameRequired: false,
  baseConcepts: [],
  childrenPresentational: false,
  nameFrom: ['author'],
  props: {
    'aria-level': null,
    'aria-posinset': null,
    'aria-setsize': null
  },
  relatedConcepts: [{
    module: 'HTML',
    concept: {
      name: 'li',
      constraints: ['direct descendant of ol, ul or menu']
    }
  }, {
    module: 'XForms',
    concept: {
      name: 'item'
    }
  }],
  requireContextRole: ['group', 'list'],
  requiredContextRole: ['group', 'list'],
  requiredOwnedElements: [],
  requiredProps: {},
  superClass: [['roletype', 'structure', 'section']]
};
var _default = listitemRole;
exports.default = _default;