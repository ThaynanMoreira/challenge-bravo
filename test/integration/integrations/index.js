/* eslint-disable no-undef */

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
