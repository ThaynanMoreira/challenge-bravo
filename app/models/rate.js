//const fs = require('fs');

module.exports = {
    getRates: () => {
        try {
            return require('../data/rates.json');
        } catch (error) {
            return [];
        }
    },
    getAllowedRates: () => {
        try {
            return require('../data/allowedRates.json');
        } catch (error) {
            return [];
        }
    },
};