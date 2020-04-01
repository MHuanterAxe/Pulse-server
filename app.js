const express = require('express')
const app = express()
const cors = require('cors')
const server = require('http').createServer(app);
const config = require('./src/config/default')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const sassMiddleware = require('node-sass-middleware')
const db = require('./src/db')

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/api/auth', require('./src/routes/auth'))
app.use('/api/notes', require('./src/routes/notes'))

server.listen(config.port, function () {
  console.log('Server listening at port %d', config.port);
});
module.exports = app
