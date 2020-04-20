const express = require('express')
const path = require('path')
const compression = require('compression')
const chalk = require('chalk')

const port = 3000
const app = express()
const ctx = new chalk.constructor({ level: 3 })


app.use(compression())

app.use(express.static(path.resolve(__dirname)))
app.get('*', (req, res) => {
  res.sendFile(path.resolve(path.resolve(__dirname), 'index.html'))
})

app.get('/*.js', (req, res, next) => {
  req.url = `${req.url}.gz`
  res.set('Content-Encoding', 'gzip')
  next()
})

app.get('/health', (req, res) => res.json({ status: 'OK' }))

app.listen(port)
console.log(`MOOVE LISTEN ON: ${ctx.keyword('orange')(`${port} 👂`)}`)
