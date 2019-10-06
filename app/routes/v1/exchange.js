/* eslint-disable new-cap */
const express = require('express');
const Exchange = require('../../controllers/exchange');
const logger = require('../../middlewares/logger');

const router = express.Router();


const defaultResponse = (reqId, data, statusCode = 200) => {
    logger.logResponse(reqId, data, statusCode);
    return { data, statusCode };
};

const errorResponse = (reqId, message, statusCode = 500, error = null) => {
    logger.logError(reqId, message, statusCode, error);
    return { error, message, statusCode };
};


router.get('/', (req, res) => {
    if(!req.query.from || !req.query.to || !req.query.amount){
        // eslint-disable-next-line max-len
        const response = errorResponse(req.id, 'Unprocessable Entity', 422, `Empty querystring parameters - From :${!req.query.from}  To: ${!req.query.to}  Amount: ${!req.query.amount}`);
        res.status(response.statusCode);
        res.json(response.message);
        return;
    }
    Exchange.convert(req.query.from, req.query.to, req.query.amount)
        .then((result) => {
            const response = defaultResponse(req.id, result);
            res.status(response.statusCode);
            res.json(response.data);
        })
        .catch((error) => {
            let statusCode = 500;
            let message = 'Internal Server Error';
            if(Exchange.isValidUserError(error)){
                statusCode = 400;
                message = error;
            }
            const response = errorResponse(req.id, message, statusCode, error);
            res.status(response.statusCode);
            res.json(response.message);
        });
});

module.exports = router;
