"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;
var buttonRole = {
  abstract: false,
  accessibleNameRequired: true,
  baseConcepts: [],
  childrenPresentational: true,
  nameFrom: ['author', 'contents'],
  props: {
    'aria-expanded': null,
    'aria-pressed': null
  },
  relatedConcepts: [{
    module: 'HTML',
    concept: {
      name: 'button'
    }
  }, {
    module: 'HTML',
    concept: {
      name: 'input',
      attributes: [{
        name: 'type',
        value: 'button'
      }]
    }
  }, {
    module: 'HTML',
    concept: {
      name: 'input',
      attributes: [{
        name: 'type',
        value: 'image'
      }]
    }
  }, {
    module: 'HTML',
    concept: {
      name: 'input',
      attributes: [{
        name: 'type',
        value: 'reset'
      }]
    }
  }, {
    module: 'HTML',
    concept: {
      name: 'input',
      attributes: [{
        name: 'type',
        value: 'submit'
      }]
    }
  }, {
    module: 'HTML',
    concept: {
      name: 'input',
      attributes: [{
        name: 'type',
        value: 'checkbox'
      }, {
        name: 'aria-pressed',
        constraints: ['set']
      }]
    }
  }, {
    module: 'HTML',
    concept: {
      name: 'summary',
      constraints: ['direct descendant of details element with the open attribute defined'],
      attributes: [{
        name: 'aria-expanded',
        value: 'true'
      }]
    }
  }, {
    module: 'HTML',
    concept: {
      name: 'summary',
      attributes: [{
        name: 'aria-expanded',
        value: 'false'
      }]
    }
  }, {
    module: 'XForms',
    concept: {
      name: 'trigger'
    }
  }],
  requireContextRole: [],
  requiredContextRole: [],
  requiredOwnedElements: [],
  requiredProps: {},
  superClass: [['roletype', 'widget', 'command']]
};
var _default = buttonRole;
exports.default = _default;