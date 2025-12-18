const express = require('express');
const cors = require('cors');
// ... các import khác (prisma, routes...)
const contentRoutes = require('./src/routes/contentRoutes');

const app = express();
app.use(cors());
app.use(express.json());


app.use('/uploads', express.static('uploads'));
// ----------------------------------

app.use('/content', contentRoutes); // Hoặc app.use('/', routes) tùy cấu hình của bạn

app.listen(3002, () => {
    console.log('Content Service running on port 3002');
});