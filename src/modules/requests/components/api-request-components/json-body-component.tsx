import React from 'react';
import { Textarea } from '@/components/ui/textarea';

const JsonBodyComponent = () => {
	return (
		<Textarea
			className="!bg-muted/30 !border-border/40 focus-visible:!ring-none h-full resize-none overflow-auto p-4 text-[0.7rem] !ring-transparent !outline-none"
			defaultValue={JSON.stringify(
				{
					key: 'value',
					array: [1, 2, 3],
					object: { nestedKey: 'nestedValue' },
					boolean: true,
					nullValue: null,
				},
				null,
				16,
			)}
		/>
	);
};

export default JsonBodyComponent;
