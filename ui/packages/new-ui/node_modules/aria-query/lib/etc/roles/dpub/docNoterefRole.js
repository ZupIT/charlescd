"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;
var docNoterefRole = {
  abstract: false,
  accessibleNameRequired: true,
  baseConcepts: [],
  childrenPresentational: false,
  nameFrom: ['author', 'contents'],
  props: {},
  relatedConcepts: [{
    module: 'EPUB',
    concept: {
      name: 'noteref [EPUB-SSV]'
    }
  }],
  requireContextRole: [],
  requiredContextRole: [],
  requiredOwnedElements: [],
  requiredProps: {},
  superClass: [['roletype', 'widget', 'command', 'link']]
};
var _default = docNoterefRole;
exports.default = _default;