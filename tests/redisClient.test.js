const { expect } = require('chai');
const RedisClient = require('../utils/redis');

describe('Redis Client Tests', () => {
  let client;

  beforeEach(() => {
    client = new RedisClient();
  });

  afterEach(() => {
    client.client.quit(); // Closes the Redis client after each test
  });

  it('should check if Redis is alive', () => {
    expect(client.isAlive()).to.be.true;
  });

  it('should set and get a value from Redis', async () => {
    const key = 'testKey';
    const value = 'testValue';
    const durationInSeconds = 10;

    await client.set(key, value, durationInSeconds);
    const retrievedValue = await client.get(key);

    expect(retrievedValue).to.equal(value);
  });

  it('should delete a value from Redis', async () => {
    const key = 'testKey';
    const value = 'testValue';

    await client.set(key, value, 10);
    await client.del(key);
    const retrievedValue = await client.get(key);

    expect(retrievedValue).to.be.null;
  });

  // more test could be added
});
