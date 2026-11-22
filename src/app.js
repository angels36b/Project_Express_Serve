const path = require('path');
const express = require('express');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.set('strict routing', true);
app.disable('x-powered-by');
app.use(express.json({ strict: true, limit: '32kb' }));

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/', routes);

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.use(errorHandler);

module.exports = app;