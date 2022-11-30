const express = require('express');
const cookieParser = require('cookie-parser');

const authenticate = require('./middleware/authenticate');

const app = express();

// Built in middleware
app.use(express.json());
app.use(cookieParser());

// App routes

app.use('/api/v1/users', require('./controllers/users'));

// Error handling & 404 middleware for when
// a request doesn't match any app routes
app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
