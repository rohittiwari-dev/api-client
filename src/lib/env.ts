import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

const env = createEnv({
	server: {
		DATABASE_URL: z.string(),
		BETTER_AUTH_URL: z.url(),
		BETTER_AUTH_SECRET: z.string(),
		GOOGLE_CLIENT_ID: z.string(),
		GOOGLE_CLIENT_SECRET: z.string(),
		REDIS_URL: z.string(),
		CLOUDINARY_CLOUD_NAME: z.string(),
		CLOUDINARY_API_KEY: z.string(),
		CLOUDINARY_API_SECRET: z.string(),
	},
	client: {
		NEXT_PUBLIC_WEB_PUBLIC_URL: z.string(),
	},
	experimental__runtimeEnv: {
		...process.env,
		NEXT_PUBLIC_WEB_PUBLIC_URL: process.env['NEXT_PUBLIC_WEB_PUBLIC_URL'],
	},
});

export default env;
