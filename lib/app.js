const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors');

const authenticate = require('./middleware/authenticate');

// Built in middleware
app.use(express.json());
app.use(cookieParser());

// App routes

app.use('/api/v1/users', require('./controllers/users'));
app.use('/api/v1/items', authenticate, require('./controllers/items'));
app.use(
  cors({
    origin: [
      'http://localhost:5500',
      'https://alchemy-shopping-front-end-demo.netlify.app',
    ],
    credentials: true,
  })
);
// app.options('/api/v1/users', cors()); // enable pre-flight request for DELETE request
// app.post('/api/v1/users', cors(), (req, res) => {
//   res.json({ msg: 'This is CORS-enabled for all origins!' });
// });

// Error handling & 404 middleware for when
// a request doesn't match any app routes
app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
