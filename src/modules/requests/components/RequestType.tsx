import { ComponentProps } from 'react';
import {
	IconGraphQL,
	IconGRPC,
	IconSocketIO,
	IconWebSocket,
} from '@/assets/app-icons';
import { cn } from '@/lib/utils';
import { RequestType } from '@/modules/requests/types';

export const RequestIcon = ({
	type,
	className,
	...props
}: { type: RequestType; className?: string } & ComponentProps<'svg'>) => {
	switch (type) {
		case 'websocket':
			return (
				<IconWebSocket
					className={cn('!h-[20px] !w-[20px]', className)}
					{...props}
				/>
			);
		case 'socketio':
			return (
				<IconSocketIO
					className={cn('!h-[20px] !w-[20px]', className)}
					{...props}
				/>
			);
		case 'grpc':
			return (
				<IconGRPC
					className={cn('!h-[20px] !w-[20px]', className)}
					{...props}
				/>
			);
		case 'graphql':
			return (
				<IconGraphQL
					className={cn('!h-[20px] !w-[20px]', className)}
					{...props}
				/>
			);
		case 'new':
			return null;
		default:
			return (
				<IconWebSocket
					className={cn('!h-[20px] !w-[20px]', className)}
					{...props}
				/>
			);
	}
};
