import { ComponentProps } from 'react';
import {
	IconGraphQL,
	IconGRPC,
	IconSocketIO,
	IconWebSocket,
} from '@/assets/app-icons';
import { cn } from '@/lib/utils';
import { RequestType } from '../types/store.types';

export const RequestIcon = ({
	type,
	className,
	...props
}: {
	type: RequestType | 'NEW';
	className?: string;
} & ComponentProps<'svg'>) => {
	switch (type) {
		case 'WEBSOCKET':
			return (
				<IconWebSocket
					className={cn('!w-[20px] !h-[20px]', className)}
					{...props}
				/>
			);
		case 'SOCKET_IO':
			return (
				<IconSocketIO
					className={cn('!w-[18px] !h-[18px]', className)}
					{...props}
				/>
			);
		case 'NEW':
			return null;
		default:
			return (
				<IconWebSocket
					className={cn('!w-[20px] !h-[20px]', className)}
					{...props}
				/>
			);
	}
};
