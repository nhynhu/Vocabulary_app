const express = require('express');
const cors = require('cors');
const learningRoutes = require('./src/routes/learningRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/learning', learningRoutes);

app.listen(3003, () => console.log('Learning Service running on 3003'));