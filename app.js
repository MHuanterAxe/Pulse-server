const express = require('express');
const app = express();
const cors = require('cors');
const server = require('http').createServer(app);
const config = require('./src/Config/default');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const db = require('./src/DataBase');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', require('./src/Routes/auth'));
app.use('/api/notes', require('./src/Routes/notes'));
app.use('/api/tasks', require('./src/Routes/tasks'));
app.use('/api/user', require('./src/Routes/user'));

server.listen(config.port, function () {
  console.log('Server listening at port %d', config.port);
});
module.exports = app
