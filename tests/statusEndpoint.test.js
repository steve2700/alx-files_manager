const { expect } = require('chai');
const request = require('chai-http');
const app = require('../server');

describe('/status Endpoint Tests', () => {
  it('should return status and Redis and DB information', async () => {
    const response = await request(app).get('/status');
    expect(response).to.have.status(200);
    expect(response.body).to.have.property('redis').to.be.a('boolean');
    expect(response.body).to.have.property('db').to.be.a('boolean');
    expect(response.body.redis).to.equal(true); // Assuming Redis is alive
    expect(response.body.db).to.equal(true); // Assuming MongoDB is alive
  });
});
