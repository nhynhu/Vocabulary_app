const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);

app.listen(3001, () => console.log('Auth Service running on 3001'));