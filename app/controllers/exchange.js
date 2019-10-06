const rawModel = require('../models/rate');

const convertCurrency = (fromBaseValue, toBaseValue, amount) => {
    /* It is calculated as follows:
        step 1: ballast currency is split with source currency
            value 1 is used to find out how much the source currency is worth
            in relation to the ballast
        step 2: The amount in the source currency is multiplied by the ballast currency factor.
            This way the amount of money has already been converted to the ballast currency.
        step 3: The resulting amount of money is multiplied by the target currency factor.
            Since the factor has already been calculated, you do not need to redo i
            That way we convert the amount of money into the target currency.
    */
    return ((1/fromBaseValue)*amount)*toBaseValue;
};

module.exports = {
    convert: (from, to, amount, model = rawModel) => {
        return new Promise((resolved, reject)=> {
            if(!from || !to) {
                return reject('\'From\' and \'To\' values are invalid');
            }
            if(!amount || parseFloat(amount) < 0){
                return reject('\'Amount\' value is invalid');
            }

            const allowedRates = model.getAllowedRates();
            if(!allowedRates || typeof allowedRates !== 'object' ||
                (allowedRates.length >= 2 &&
                    allowedRates.filter((v) => v === from || v === to).length <= 1)) {
                return reject('Exchange not Allowed. See allowed exchanges in /allowed');
            }

            const rates = model.getRates().rates;
            if(!rates){
                return reject('Internal server error');
            } else if(!rates[from] || !rates[to]) {
                return reject('\'From\' and \'To\' values are invalid');
            }
            return resolved(
                convertCurrency(parseFloat(rates[from]), parseFloat(rates[to]), parseFloat(amount))
            );
        });
    },

    isValidUserError: (error) => {
        if(error === '\'From\' and \'To\' values are invalid' ||
        error ===  '\'Amount\' value is invalid' ||
        error ===  'Exchange not Allowed. See allowed exchanges in /allowed'){
            return true;
        }
        return false;
    },
};

