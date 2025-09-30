import React from 'react';
import { ThemeProvider } from '@/lib/providers/theme.provider';

const SystemProviders = ({ children }: { children?: React.ReactNode }) => {
	return <ThemeProvider>{children}</ThemeProvider>;
};

export default SystemProviders;
