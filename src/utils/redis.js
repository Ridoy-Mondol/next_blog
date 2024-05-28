import { createClient } from 'redis';

const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  password: process.env.REDIS_PASSWORD,
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

async function connectRedis() {
  if (!redisClient.isOpen) {
    while (true) {
      try {
        await redisClient.connect();
        console.log('Connected to Redis');
        break; 
      } catch (err) {
        console.error('Redis Client Error', err);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }
}

export { redisClient, connectRedis };

