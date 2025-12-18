const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
app.use(cors());


app.use('/auth', createProxyMiddleware({
    target: 'http://localhost:3001/auth',
    changeOrigin: true,
}));

app.use('/content', createProxyMiddleware({
    target: 'http://localhost:3002/content',
    changeOrigin: true,
}));

app.use('/learning', createProxyMiddleware({
    target: 'http://localhost:3003/learning',
    changeOrigin: true,
}));


app.listen(3000, () => console.log('Gateway running on 3000'));