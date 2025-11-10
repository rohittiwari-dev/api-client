import React from 'react';
import { ThemeProvider } from '@/lib/providers/theme.provider';
import { QueryProvider } from './query-provider';

const SystemProviders = ({ children }: { children?: React.ReactNode }) => {
	return (
		<QueryProvider>
			<ThemeProvider>{children}</ThemeProvider>
		</QueryProvider>
	);
};

export default SystemProviders;
