const mock = require('./mock')

const API = '/cards'

const getCard = {
  method: 'GET',
  path: `${API}/{cardId}`,
  handler: (req, h) => h.response(mock.card),
}

module.exports = {
  getCard,
}
