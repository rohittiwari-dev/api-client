import React from 'react';
import Spinner from '@/components/app-ui/spinner';

const Loading = () => {
	return (
		<div className="flex justify-center items-center w-full min-h-screen overflow-hidden">
			<Spinner
				color="secondary"
				className="dark:text-neutral-200/60"
				size="lg"
				stroke="3"
			/>
		</div>
	);
};

export default Loading;
