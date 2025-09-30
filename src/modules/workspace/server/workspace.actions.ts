'use server';

import db from '@/lib/db';

export const getActiveOrganization = async (
	userId: string,
): Promise<{
	name: string;
	id: string;
	createdAt: Date;
	slug: string | null;
	logo: string | null;
	metadata: string | null;
} | null> => {
	const organizations = await db.organization.findFirst({
		where: {
			members: { some: { userId } },
		},
		orderBy: { createdAt: 'desc' },
	});
	return organizations;
};
