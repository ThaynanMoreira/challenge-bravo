require('dotenv').config();
const express = require('express');
const http = require('http');
const morgan = require('morgan');

const ensurePathExist = require('./helper/ensurePathExist');
const indexRouter = require('./routes/index');
const logger = require('./middlewares/logger');

const loggerFormat = ':id [:date[web]] ":method :url" :status :response-time';

// Method to create the log path in any environment and prevent an error if no such path exists
ensurePathExist.mkdir(process.env.FOLDERS_LOGPATH);

const app = express();
const port = parseInt(process.env.PORT);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

morgan.token('id', (req) => req.id);
app.use(morgan(loggerFormat, {
    skip(req, res) {
        return res.statusCode < 400;
    },
    stream: process.stderr,
}));
app.use(morgan(loggerFormat, {
    skip(req, res) {
        return res.statusCode >= 400;
    },
    stream: process.stdout,
}));

app.use(logger.logRequisitionMiddleware);
app.use(logger.logResponseMiddleware);


app.use('/', indexRouter);
app.set('port', port);

const server = http.createServer(app);
server.listen(port, () => {
    console.log(`Server listening on port ${process.env.PORT}!`);
});

// For testing purposes
module.exports = app;