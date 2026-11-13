const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const express = require('express');

const app = express();
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/api/boards', require('./routes/boards'));
app.use('/api', require('./routes/tasks'));
app.use('/api/users', require('./routes/users'));

app.listen(3000, () => {
  console.log('Server: http://localhost:3000');
});