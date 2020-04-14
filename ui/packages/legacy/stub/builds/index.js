const API = '/builds'

const generateRelease = {
  method: 'POST',
  path: `${API}`,
  handler: (req, h) => h.response({}),
}

module.exports = {
    generateRelease,
}
