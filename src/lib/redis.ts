import Redis from "ioredis";
import env from "./env";

const redisUrl = env.REDIS_URL;

if (!redisUrl) {
  console.warn("REDIS_URL is not defined in environment variables.");
}
export const redis = new Redis(redisUrl!);
export default redis;
