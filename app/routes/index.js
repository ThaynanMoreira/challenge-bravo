require('dotenv').config();
const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/health', (req, res) => {
    res.send('Server running');
});

router.use('/v1', require('./v1'));

module.exports = router;