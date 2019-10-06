const supertest = require('supertest');
const chai = require('chai');
const mocha = require('mocha');
const mockery = require('mockery');
const app = require('../../../../app');
const expect = chai.expect;
const describe = mocha.describe;
const it = mocha.it;
const before = mocha.before;
const after = mocha.after;

const ratesMock = require('../../../mocks/rates.json');
const allowedRatesMock = require('../../../mocks/allowedRates.json');

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

const request = supertest(app);

module.exports.test = () => {
    describe('Routes Reviews', () => {
        describe('Route GET /exchange', () => {
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
                    request
                        .get('/v1/exchange?from=BRL&to=JPY&amount=0')
                        .then((response) => {
                            expect(response.status).to.be.eql(200);
                            expect(response.body).to.be.eql(0);
                            done();
                        })
                        .catch((err) => {
                            return done(err);
                        });
                });
                it('Should convert 100 to 300', (done) => {
                    request
                        .get('/v1/exchange?from=TEST&to=TEST2&amount=100')
                        .then((response) => {
                            expect(response.status).to.be.eql(200);
                            expect(response.body).to.be.eql(300);
                            done();
                        })
                        .catch((err) => {
                            return done(err);
                        });
                });
            });
            describe('...errors', () => {
                it('Should return error missing params', (done) => {
                    request
                        .get('/v1/exchange?from=BRL&to=&amount=100')
                        .then((response) => {
                            expect(response.status).to.be.eql(422);
                            expect(response.body).to.be.eql('Unprocessable Entity');
                            done();
                        })
                        .catch((err) => {
                            return done(err);
                        });
                });
                it('Should return error amount negative', (done) => {
                    request
                        .get('/v1/exchange?from=BRL&to=JPY&amount=-100')
                        .then((response) => {
                            expect(response.status).to.be.eql(400);
                            expect(response.body).to.be.eql('\'Amount\' value is invalid');
                            done();
                        })
                        .catch((err) => {
                            return done(err);
                        });
                });
                it('Should return error not allowed exchange ', (done) => {
                    request
                        .get('/v1/exchange?from=TEST2&to=TEST3&amount=100')
                        .then((response) => {
                            expect(response.status).to.be.eql(400);
                            expect(response.body).to.be.eql(
                                'Exchange not Allowed. See allowed exchanges in /allowed'
                            );
                            done();
                        })
                        .catch((err) => {
                            return done(err);
                        });
                });
            });
        });
    });
};
