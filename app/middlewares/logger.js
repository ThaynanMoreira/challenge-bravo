const bunyan = require('bunyan');
const serializer = require('bunyan-express-serializer');
const RotatingFileStream = require('bunyan-rotating-file-stream');

let level;
switch (process.env.NODE_ENV) {
case 'production':
    level = 'info';
    break;
case 'test':
    level = 'fatal';
    break;
default:
    level = 'debug';
    break;
}

exports.loggerInstance = bunyan.createLogger({
    name: 'transaction-notifier',
    serializers: {
        req: serializer,
        res: bunyan.stdSerializers.res,
        err: bunyan.stdSerializers.err,
    },
    level: level,
    streams: [{
        name: 'info',
        level: 'info',
        stream: new RotatingFileStream({
            path: process.env.INFO_LOGPATH,
            period: '1d', // daily rotation
            totalFiles: 10, // keep 10 back copies
            rotateExisting: true, // Give ourselves a clean file when we start up, based on period
            threshold: '10m', // Rotate log files larger than 10 megabytes
            totalSize: '20m', // Don't keep more than 20mb of archived log files
            gzip: true, // Compress the archive log files to save space
        }),
    },
    {
        name: 'error',
        level: 'error',
        stream: new RotatingFileStream({
            path: process.env.ERROR_LOGPATH,
            period: '1d', // daily rotation
            totalFiles: 10, // keep 10 back copies
            rotateExisting: true, // Give ourselves a clean file when we start up, based on period
            threshold: '10m', // Rotate log files larger than 10 megabytes
            totalSize: '20m', // Don't keep more than 20mb of archived log files
            gzip: true, // Compress the archive log files to save space
        }),
    },
    {
        stream: process.stdout,
    },
    ],
});

exports.logResponse = (id, body, statusCode) => {
    const log = this.loggerInstance.child({
        id,
        body,
        statusCode,
    }, true);
    log.info('response');
};

exports.logError = (id, body, statusCode, error) => {
    const log = this.loggerInstance.child({
        id,
        body,
        statusCode,
        error,
    }, true);
    log.error('error');
};

exports.logRequisitionMiddleware = (req, res, next) => {
    const log = this.loggerInstance.child({
        id: req.id,
        body: req.body,
    }, true);
    log.info({
        req,
    });
    next();
};

exports.logResponseMiddleware = (req, res, next) => {
    const context = this;
    function afterResponse() {
        res.removeListener('finish', afterResponse);
        res.removeListener('close', afterResponse);
        const log = context.loggerInstance.child({
            id: req.id,
        }, true);
        log.info({ res }, 'response');
    }

    res.on('finish', afterResponse);
    res.on('close', afterResponse);
    next();
};