import React from 'react';
import Spinner from '@/components/app-ui/spinner';

const Loading = () => {
	return (
		<div
			className={
				'flex h-screen w-screen items-center justify-center overflow-hidden'
			}
		>
			<div
				className={'flex h-[50px] w-[50px] items-center justify-center'}
			>
				<Spinner string={'Loading Your Workspace'} />
			</div>
		</div>
	);
};

export default Loading;
