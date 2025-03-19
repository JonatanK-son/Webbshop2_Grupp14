var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
require('dotenv').config();

// Import routes
const productsRouter = require('./routes/products');
const cartRouter = require('./routes/cart');
const ratingsRouter = require('./routes/ratings');
const usersRouter = require('./routes/users');
const geminiRouter = require('./routes/gemini');

var app = express();

// Middleware
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/images', express.static('images'));

// Routes
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/ratings', ratingsRouter);
app.use('/api/users', usersRouter);
app.use('/api/gemini', geminiRouter);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

module.exports = app;
