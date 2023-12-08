const redis = require('redis');
const { promisify } = require('util');

class RedisClient {
  constructor() {
    this.client = redis.createClient();

    // Display any error of the redis client in the console
    this.client.on('error', (err) => {
      console.error(`Redis Client Error: ${err}`);
    });
  }

  isAlive() {
      return this.client.connected;
  }

  async get(key) {
    const getAsync = promisify(this.client.get).bind(this.client);
    try {
      const value = await getAsync(key);
      return value;
    } catch (error) {
      console.error(`Error getting value from Redis: ${error}`);
      throw error;
    }
  }

  async set(key, value, durationInSeconds) {
    try {
      await this.client.set(key, value, 'EX', durationInSeconds);
    } catch (error) {
      console.error(`Error setting value in Redis: ${error}`);
      throw error;
    }
  }

  async del(key) {
    try {
      await this.client.del(key);
    } catch (error) {
      console.error(`Error deleting value from Redis: ${error}`);
      throw error;
    }
  }
}

const redisClient = new RedisClient();

module.exports = redisClient;
