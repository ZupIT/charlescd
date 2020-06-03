'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./svg-injector.cjs.production.js')
} else {
  module.exports = require('./svg-injector.cjs.development.js')
}
