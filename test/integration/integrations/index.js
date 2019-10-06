const supertest = require('supertest');
const chai = require('chai');
const mocha = require('mocha');
const expect = chai.expect;
const describe = mocha.describe;
const it = mocha.it;
const app = require('../../../app');
const routes = require('../integrations/routes/exchange');

const request = supertest(app);

describe('Routes Index', () => {
    describe('Route GET /health', () => {
        it('Should return a health of system', (done) => {
            request
                .get('/health')
                .end((err, res) => {
                    expect(res.text).to.be.eql('Server running');
                    return done(err);
                });
        });
    });
});

routes.test();