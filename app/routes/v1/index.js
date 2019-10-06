require('dotenv').config();
const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();

router.use('/exchange', require('./exchange'));
module.exports = router;