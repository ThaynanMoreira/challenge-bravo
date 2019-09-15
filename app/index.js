require('dotenv').config();
const express = require('express');
const http = require('http');

const app = express();
const port = parseInt(process.env.PORT);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/health', (req, res) => {
    res.send('Server running');
});
app.set('port', port);

const server = http.createServer(app);
server.listen(port, () => {
    console.log(`Server listening on port ${process.env.PORT}!`);
});

// For testing purposes
module.exports = app;