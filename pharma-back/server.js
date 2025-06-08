const jsonServer = require('json-server');
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

app.use(cors()); //
app.use(express.json());
app.use(middlewares);
app.use('/', router);

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
