"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;
var searchboxRole = {
  abstract: false,
  accessibleNameRequired: true,
  baseConcepts: [],
  childrenPresentational: false,
  nameFrom: ['author'],
  props: {},
  relatedConcepts: [{
    module: 'HTML',
    concept: {
      name: 'input',
      attributes: [{
        name: 'type',
        value: 'search'
      }, {
        name: 'list',
        constraints: ['undefined']
      }]
    }
  }],
  requireContextRole: [],
  requiredContextRole: [],
  requiredOwnedElements: [],
  requiredProps: {},
  superClass: [['roletype', 'widget', 'input', 'textbox']]
};
var _default = searchboxRole;
exports.default = _default;