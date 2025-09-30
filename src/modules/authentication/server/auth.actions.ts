'use server';

import { headers } from 'next/headers';
import auth from '@/lib/auth';
import db from '@/lib/db';

export const currentUser = async () => {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user?.id) {
			return null;
		}

		const user = await db.user.findUnique({
			where: {
				id: session.user.id,
			},
			select: {
				id: true,
				email: true,
				name: true,
				image: true,
				createdAt: true,
				updatedAt: true,
				emailVerified: true,
			},
		});

		return { user, session: session.session };
	} catch (error) {
		console.error('Error fetching current user:', error);
		return null;
	}
};
