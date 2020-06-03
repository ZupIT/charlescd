"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;
var comboboxRole = {
  abstract: false,
  accessibleNameRequired: true,
  baseConcepts: [],
  childrenPresentational: false,
  nameFrom: ['author'],
  props: {
    'aria-expanded': 'false',
    'aria-autocomplete': null,
    'aria-required': null,
    'aria-haspopup': 'listbox',
    'aria-readonly': null
  },
  relatedConcepts: [{
    module: 'HTML',
    concept: {
      name: 'select',
      attributes: [{
        name: 'multiple',
        constraints: ['undefined']
      }, {
        name: 'size',
        constraints: ['undefined']
      }]
    }
  }, {
    module: 'HTML',
    concept: {
      name: 'select',
      attributes: [{
        name: 'multiple',
        constraints: ['undefined']
      }, {
        name: 'size',
        value: 1
      }]
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
        constraints: ['set']
      }]
    }
  }, {
    module: 'HTML',
    concept: {
      name: 'input',
      attributes: [{
        name: 'type',
        value: 'search'
      }, {
        name: 'list',
        constraints: ['set']
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
        constraints: ['set']
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
        constraints: ['set']
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
        constraints: ['set']
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
        constraints: ['set']
      }]
    }
  }, {
    module: 'XForms',
    concept: {
      name: 'select'
    }
  }],
  requireContextRole: [],
  requiredContextRole: [],
  requiredOwnedElements: [['textbox'], ['listbox'], ['tree'], ['grid'], ['dialog']],
  requiredProps: {
    'aria-controls': null,
    'aria-expanded': 'false'
  },
  superClass: [['roletype', 'widget', 'composite', 'select'], ['roletype', 'structure', 'section', 'group', 'select']]
};
var _default = comboboxRole;
exports.default = _default;