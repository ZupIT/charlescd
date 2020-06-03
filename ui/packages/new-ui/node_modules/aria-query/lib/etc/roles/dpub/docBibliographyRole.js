"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;
var docBibliographyRole = {
  abstract: false,
  accessibleNameRequired: false,
  baseConcepts: [],
  childrenPresentational: false,
  nameFrom: ['author'],
  props: {},
  relatedConcepts: [{
    module: 'EPUB',
    concept: {
      name: 'bibliography [EPUB-SSV]'
    }
  }],
  requireContextRole: [],
  requiredContextRole: [],
  requiredOwnedElements: [['doc-biblioentry']],
  requiredProps: {},
  superClass: [['roletype', 'structure', 'section', 'landmark']]
};
var _default = docBibliographyRole;
exports.default = _default;