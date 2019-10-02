/* eslint-disable no-undef */
const chai = require('chai');
const mocha = require('mocha');
mockery = require('mockery');
const expect = chai.expect;
const describe = mocha.describe;
const it = mocha.it;
const before = mocha.before;
const after = mocha.after;

const exchangeController = require('../../../app/controllers/exchange');
const ratesMock = require('../../mocks/rates.json');
const allowedRatesMock = require('../../mocks/allowedRates.json');

const ratesModule = {};

ratesModule.getRates = () => {
    return ratesMock;
    // return new Promise((res) => {
    // });
};

ratesModule.getAllowedRates = () => {
    return allowedRatesMock;
    // return new Promise((res) => {
    // });
};

describe('Testing Exchange Controller', () => {
    before(() => {
        mockery.enable({
            warnOnUnregistered: false,
        });
        mockery.registerMock('../data/rates.json', ratesMock);
        mockery.registerMock('../data/allowedRates.json', allowedRatesMock);
        // mockery.registerMock('../models/rate', ratesModule);
    });

    after(() => {
        mockery.disable();
    });
    describe('...convert', () => {
        it('Should convert 0 to 0', (done) => {
            exchangeController.convert('BRL', 'JPY', '0')
                .then((response) => {
                    expect(response).to.be.eql(0);
                    done();
                })
                .catch((err) => {
                    return done(err);
                });
        });
        it('Should convert 100 to 300', (done) => {
            exchangeController.convert('TEST', 'TEST2', '100')
                .then((response) => {
                    expect(response).to.be.eql(300);
                    done();
                })
                .catch((err) => {
                    return done(err);
                });
        });
    });
    describe('...errors', () => {
        it('Should return error missing params', (done) => {
            exchangeController.convert('BRL', '', '100')
                .then((response) => {
                    return done(response);
                })
                .catch((err) => {
                    expect(err).to.be.eql('\'From\' and \'To\' values are invalid');
                    return done();
                }).catch((err) => {
                    return done(err);
                });
        });
        it('Should return error amount negative', (done) => {
            exchangeController.convert('BRL', 'JPY', '-100')
                .then((response) => {
                    return done(response);
                })
                .catch((err) => {
                    expect(err).to.be.eql('\'Amount\' value is invalid');
                    return done();
                }).catch((err) => {
                    return done(err);
                });
        });
        it('Should return error not allowed exchange ', (done) => {
            exchangeController.convert('TEST2', 'TEST3', '100')
                .then((response) => {
                    return done(response);
                })
                .catch((err) => {
                    expect(err).to.be.eql(
                        'Exchange not Allowed. See allowed exchanges in /allowed'
                    );
                    return done();
                }).catch((err) => {
                    return done(err);
                });
        });
    });
});