'use client';

import React from 'react';
import { SearchIcon } from 'lucide-react';
import { InputField } from '@/components/app-ui/inputs';
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';

const SearchPanel = () => {
	const [open, setOpen] = React.useState(false);
	const [searchText, setSearchText] = React.useState('');

	React.useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};
		document.addEventListener('keydown', down);
		return () => document.removeEventListener('keydown', down);
	}, []);

	return (
		<>
			<InputField
				onClick={() => setOpen(true)}
				onChange={(e) => setSearchText(e.target.value)}
				leftIcon={<SearchIcon />}
				rightIcon={
					<div className="flex items-center justify-center gap-1">
						<kbd className={'bg-secondary rounded p-1 px-2'}>
							ctrl
						</kbd>
						<kbd className={'bg-secondary rounded p-1 px-2'}>k</kbd>
					</div>
				}
				containerClassName={'min-w-[450px] scale-90'}
			/>
			<CommandDialog open={open} onOpenChange={setOpen}>
				<CommandInput placeholder="Type a command or search..." />
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>
					<CommandGroup heading="Search Results">
						<CommandItem>Calendar</CommandItem>
						<CommandItem>Search Emoji</CommandItem>
						<CommandItem>Calculator</CommandItem>
					</CommandGroup>
				</CommandList>
			</CommandDialog>
		</>
	);
};

export default SearchPanel;
