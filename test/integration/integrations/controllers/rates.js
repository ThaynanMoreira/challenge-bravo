const supertest = require('supertest');
const chai = require('chai');
const mocha = require('mocha');
const rewire = require('rewire');
const app = require('../../../../app');

const ratesModule = rewire('../../../../app/models/rates.js');

const ratesMock = rewire('../../mocks/rates.json');

ratesModule.__set__('getRates', () => {
    return new Promise((res) => {
        res(ratesMock);
    });
});


const { it, describe } = mocha;
const request = supertest(app);
// const { expect } = chai;

module.exports.test = () => {
    describe('Routes Reviews', () => {
        describe('Route GET /exchange', () => {
            it('Should return result 0 of an exchange', (done) => {
                request
                    .get('/v1/exchange?from=BRL&to=USD&amount=0')
                    .expect(200)
                    .expect(0)
                    .end(done);
            });
        });
    });
};
