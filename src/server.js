const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors')

const app = express();
const port = 3000;
const outputDirectory = 'videos/output/';

app.use(cors())

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/hls/*', (req, res) => {
    const filePath = path.join(__dirname, outputDirectory, req.url.replace('/hls/', ''));
    console.log(filePath)
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.status(404).send('Not Found');
            console.log('erro')
            return;
        }

        res.header('Content-Type', getContentType(filePath));
        res.send(data);
    });
});

app.listen(port, () => {
    console.log(`Servidor de streaming iniciado em http://localhost:${port}`);
});

function getContentType(filePath) {
    const extname = path.extname(filePath).toLowerCase();
    switch (extname) {
        case '.m3u8':
            return 'application/vnd.apple.mpegurl';
        case '.ts':
            return 'video/mp2t';
        default:
            return 'text/plain';
    }
}