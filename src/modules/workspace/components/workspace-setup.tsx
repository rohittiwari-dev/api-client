'use client';

import React from 'react';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconBrandSocketIo } from '@tabler/icons-react';
import _ from 'lodash';
import { Briefcase, CheckCircle, Slash, XCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import AuthImage from '@/assets/authImage.webp';
import { AddOnInput, InputField } from '@/components/app-ui/inputs';
import ThemeSwitcher from '@/components/app-ui/theme-switcher';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import authClient from '@/lib/authClient';
import { CreateWorkspaceSchema } from '@/lib/form-schemas/workspace';
import { cn } from '@/lib/utils';

const WorkspaceSetup = ({
	type = 'get-started-page',
}: {
	type: 'get-started-page' | 'workspace-setup-modal';
}) => {
	const debouncedCheckSlug = React.useRef<_.DebouncedFunc<
		() => Promise<void>
	> | null>(null);
	const [checkSlugMessage, setCheckSlugMessage] = React.useState<{
		status: 'error' | 'success';
		message: string;
	} | null>(null);

	const form = useForm<z.infer<typeof CreateWorkspaceSchema>>({
		defaultValues: {
			name: undefined,
			slug: undefined,
		},
		resolver: zodResolver(CreateWorkspaceSchema),
		mode: 'onBlur',
	});

	const onSubmit = form.handleSubmit(async (data) => {
		return await authClient.organization.create(
			{ ...data, keepCurrentActiveOrganization: false },
			{
				onSuccess: (ctx) => {
					toast.success('Workspace created successfully!');
					form.reset();
					redirect(`/workspace/${ctx.data.slug}`);
				},
				onError: (ctx) => {
					toast.error(
						'Failed to create Workspace: ' + ctx.error.message,
					);
				},
			},
		);
	});

	const slug = form.watch('slug');

	const checkSlug = async () => {
		if (!slug || slug.length < 3) {
			setCheckSlugMessage({
				status: 'error',
				message: 'Slug must be at least 3 characters long',
			});
			return;
		}

		const response = await authClient.organization.checkSlug({
			slug,
		});
		if (response.data?.status) {
			setCheckSlugMessage({
				status: 'success',
				message: 'Slug is available',
			});
		} else {
			setCheckSlugMessage({
				status: 'error',
				message: 'Slug is already taken',
			});
		}
	};

	return (
		<div
			className={cn(
				'grid lg:grid-cols-1',
				type === 'get-started-page' &&
					'min-h-svh overflow-hidden lg:!grid-cols-2',
			)}
		>
			<AnimatePresence
				key={'getting-started'}
				presenceAffectsLayout
				mode="sync"
				initial={type === 'get-started-page'}
			>
				<motion.div
					key={'right'}
					initial={
						type === 'get-started-page'
							? { opacity: 0, x: -100 }
							: { opacity: 1, x: 0 }
					}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: -100 }}
					transition={{
						type: 'spring',
						stiffness: 300,
						damping: 30,
						duration: 0.5,
					}}
					className={cn('flex flex-col gap-4 p-6 md:p-10')}
				>
					{type === 'get-started-page' && (
						<div className="flex justify-between gap-2 w-full">
							<a
								href="#"
								className="flex items-center gap-2 font-medium"
							>
								<div className="flex justify-center items-center bg-primary rounded-md size-6 text-primary-foreground">
									<IconBrandSocketIo className="size-4" />
								</div>
								ApiClient
							</a>
							<ThemeSwitcher variant="multiple" />
						</div>
					)}

					<div className="flex flex-1 justify-center items-center">
						<div className="w-full max-w-xs">
							<form
								className={cn('flex flex-col gap-6')}
								onSubmit={onSubmit}
							>
								<div className="flex flex-col items-center gap-2 text-center">
									<h1 className="font-bold text-2xl">
										{type === 'get-started-page'
											? 'Get Started with ApiClient'
											: 'Create New Workspace'}
									</h1>
									<p className="text-muted-foreground text-sm text-balance">
										Create your Workspace and start managing
										your teams effectively.
									</p>
								</div>
								<div className="gap-6 grid">
									<div className="gap-3 grid">
										<InputField
											id="organization-name"
											label={
												<Label htmlFor="organization-name">
													Workspace Name
												</Label>
											}
											leftIcon={<Briefcase />}
											placeholder="Personal Workspace"
											error={
												form.formState.errors?.name
													?.message
											}
											{...form.register('name')}
										/>
									</div>
									<div className="gap-2 grid">
										<AddOnInput
											leftIcon={
												<Slash className="size-3 rotate-[112deg]" />
											}
											placeholder="personal"
											error={
												form.formState.errors?.slug
													?.message
											}
											id="slug"
											{...form.register('slug')}
											onChange={(e) => {
												const value = e.target.value;
												form.setValue('slug', value);
												setCheckSlugMessage(null);
												if (
													debouncedCheckSlug.current
												) {
													debouncedCheckSlug.current.cancel();
												}
												debouncedCheckSlug.current =
													_.debounce(checkSlug, 500);
												debouncedCheckSlug.current();
											}}
										/>
										{!!checkSlugMessage && (
											<p
												className={cn(
													'flex items-center gap-1 text-muted-foreground text-xs',
													checkSlugMessage.status ===
														'error'
														? 'text-red-500'
														: 'text-green-500',
												)}
											>
												{checkSlugMessage.status ===
												'error' ? (
													<XCircle className="size-3" />
												) : (
													<CheckCircle className="size-3" />
												)}{' '}
												{checkSlugMessage.message}
											</p>
										)}
									</div>

									<Button type="submit" className="w-full">
										Create Workspace
									</Button>
								</div>
							</form>
						</div>
					</div>
				</motion.div>
				{type === 'get-started-page' && (
					<motion.div
						key={'left'}
						initial={
							type === 'get-started-page'
								? { opacity: 0, x: 100 }
								: { opacity: 1, x: 0 }
						}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: 100 }}
						transition={{
							type: 'spring',
							stiffness: 300,
							damping: 30,
							duration: 0.5,
						}}
						className={cn('hidden lg:block relative p-6')}
					>
						<div
							className={cn(
								'hidden lg:block relative bg-primary rounded-2xl w-full h-full overflow-hidden',
							)}
						>
							<div className="z-10 absolute inset-0 bg-primary/10 blur-in w-full h-full" />
							<Image
								width={1000}
								height={1000}
								src={AuthImage}
								alt={'Image'}
								className="absolute bg-primary/10 opacity-65 dark:invert w-full h-full object-center object-cover"
							/>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default WorkspaceSetup;
