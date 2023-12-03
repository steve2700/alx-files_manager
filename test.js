import { createClient } from 'redis';

const redisConnect = () => {
  const client = createClient();

  client
    .on('connect', () => console.log('Redis client connected to the server'))
    .on('error', (err) => console.error(`Redis client not connected to the server: ${err.stack}`));

  // The client could be returned if needed
  // return client;
};

redisConnect();
