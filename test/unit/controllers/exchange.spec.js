/* eslint-disable no-undef */
const chai = require('chai');
const mocha = require('mocha');
const expect = chai.expect;
const describe = mocha.describe;
const it = mocha.it;
const rewire = require('rewire');

const exchangeController = require('../../../app/conrollers/exchange');
const ratesModule = rewire('../../../app/models/rates');

const ratesMock = rewire('../../mocks/rates.json');

ratesModule.__set__('getRates', () => {
    return new Promise((res) => {
        res(ratesMock);
    });
});

describe('Testing Exchange Controller', () => {
    describe('...convert', () => {
        it('Should return 0', (done) => {
            exchangeController.convert('BRL', 'JPY', '0')
                .then((response) => {
                    expect(response).to.be.eql(0);
                    done();
                })
                .catch((err) => {
                    return done(err);
                });
        });
    });
});