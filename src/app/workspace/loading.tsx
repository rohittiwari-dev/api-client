import React from 'react';
import Spinner from '@/components/app-ui/spinner';

const Loading = () => {
	return (
		<div className="flex min-h-screen w-full items-center justify-center overflow-hidden">
			<Spinner
				color="secondary"
				loadingLabel="Loading Your Workspace"
				className="dark:text-violet-700/60"
				size="lg"
				stroke="3"
			/>
		</div>
	);
};

export default Loading;
