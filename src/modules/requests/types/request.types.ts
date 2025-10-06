import { Request } from '@/generated/prisma';

export interface RequestStateInterface extends Request {
	isSaved: boolean;
	body: {
		raw: string;
		formData: Array<{
			key: string;
			value: string;
			isActive: boolean;
			description: string;
		}>;
		urlEncoded: Array<{
			key: string;
			value: string;
			isActive: boolean;
			description: string;
		}>;
		file: null | { src: string };
	};
}
