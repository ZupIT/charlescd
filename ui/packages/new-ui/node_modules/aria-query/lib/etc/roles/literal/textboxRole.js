"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;
var textboxRole = {
  abstract: false,
  accessibleNameRequired: true,
  baseConcepts: [],
  childrenPresentational: false,
  nameFrom: ['author'],
  props: {
    'aria-activedescendant': null,
    'aria-autocomplete': null,
    'aria-multiline': null,
    'aria-placeholder': null,
    'aria-readonly': null,
    'aria-required': null
  },
  relatedConcepts: [{
    module: 'XForms',
    concept: {
      name: 'input'
    }
  }, {
    module: 'HTML',
    concept: {
      name: 'textarea'
    }
  }, {
    module: 'HTML',
    concept: {
      name: 'input',
      attributes: [{
        name: 'type',
        value: 'text'
      }, {
        name: 'list',
        constraints: ['undefined']
      }]
    }
  }, {
    module: 'HTML',
    concept: {
      name: 'input',
      attributes: [{
        name: 'type',
        value: 'email'
      }, {
        name: 'list',
        constraints: ['undefined']
      }]
    }
  }, {
    module: 'HTML',
    concept: {
      name: 'input',
      attributes: [{
        name: 'type',
        value: 'tel'
      }, {
        name: 'list',
        constraints: ['undefined']
      }]
    }
  }, {
    module: 'HTML',
    concept: {
      name: 'input',
      attributes: [{
        name: 'type',
        value: 'url'
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
  superClass: [['roletype', 'widget', 'input']]
};
var _default = textboxRole;
exports.default = _default;