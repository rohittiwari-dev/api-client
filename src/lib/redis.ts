import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
	console.warn('REDIS_URL is not defined in environment variables.');
}

export const redis = new Redis(redisUrl!);
export default redis;
