require('dotenv').config({ path: '.env.local' });
const express = require('express');
const cors = require('cors');
const { connectdb } = require('./db/connect'); 
const routes = require('./routes/routes');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/', routes);

connectdb()
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to DB:', err);
  });
