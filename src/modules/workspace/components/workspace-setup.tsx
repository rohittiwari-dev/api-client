'use client';

import React from 'react';
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconBrandSocketIo } from '@tabler/icons-react';
import _ from 'lodash';
import { Briefcase, CheckCircle, Loader2, Slash, Sparkles, XCircle } from 'lucide-react';
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

	// Loading states
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const [isCheckingSlug, setIsCheckingSlug] = React.useState(false);

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
		setIsSubmitting(true);

		try {
			// Validate slug availability before creating
			if (checkSlugMessage?.status !== 'success') {
				setIsCheckingSlug(true);
				const slugCheck = await authClient.organization.checkSlug({
					slug: data.slug,
				});
				setIsCheckingSlug(false);

				if (!slugCheck.data?.status) {
					toast.error('Slug is already taken. Please choose a different one.');
					setCheckSlugMessage({
						status: 'error',
						message: 'Slug is already taken',
					});
					setIsSubmitting(false);
					return;
				}
			}

			const result = await authClient.organization.create({ ...data });

			if (result.error) {
				toast.error('Failed to create Workspace: ' + result.error.message);
				setIsSubmitting(false);
				return;
			}

			// Set the newly created organization as active
			await authClient.organization.setActive({
				organizationId: result.data.id,
			});

			toast.success('Workspace created successfully!');
			form.reset();
			// Use window.location for full page reload to ensure session is updated
			window.location.href = `/workspace/${result.data.slug}`;
		} catch (error) {
			toast.error('An unexpected error occurred. Please try again.');
			setIsSubmitting(false);
		}
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

		setIsCheckingSlug(true);
		try {
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
		} catch {
			setCheckSlugMessage({
				status: 'error',
				message: 'Failed to check slug availability',
			});
		} finally {
			setIsCheckingSlug(false);
		}
	};

	const isFormValid = form.formState.isValid && checkSlugMessage?.status === 'success';

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
						<div className="w-full max-w-sm">
							{/* Card Container */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.1, duration: 0.4 }}
								className={cn(
									'relative rounded-2xl border bg-card/50 backdrop-blur-sm p-8 shadow-xl',
									type === 'workspace-setup-modal' && 'border-0 shadow-none p-0 bg-transparent'
								)}
							>
								{/* Decorative gradient */}
								{type === 'get-started-page' && (
									<div className="absolute -top-px left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
								)}

								<form
									className={cn('flex flex-col gap-6')}
									onSubmit={onSubmit}
								>
									{/* Header */}
									<div className="flex flex-col items-center gap-3 text-center">
										<motion.div
											initial={{ scale: 0.8, opacity: 0 }}
											animate={{ scale: 1, opacity: 1 }}
											transition={{ delay: 0.2 }}
											className="flex items-center justify-center size-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20"
										>
											<Sparkles className="size-7 text-primary" />
										</motion.div>
										<div className="space-y-1">
											<h1 className="font-bold text-2xl tracking-tight">
												{type === 'get-started-page'
													? 'Create Your Workspace'
													: 'New Workspace'}
											</h1>
											<p className="text-muted-foreground text-sm text-balance max-w-[280px]">
												Set up your workspace to organize and manage your API collections.
											</p>
										</div>
									</div>

									{/* Form Fields */}
									<div className="space-y-4">
										<div className="space-y-2">
											<InputField
												id="organization-name"
												label={
													<Label htmlFor="organization-name" className="text-sm font-medium">
														Workspace Name
													</Label>
												}
												leftIcon={<Briefcase className="size-4" />}
												placeholder="My Workspace"
												disabled={isSubmitting}
												error={
													form.formState.errors?.name
														?.message
												}
												{...form.register('name')}
											/>
										</div>

										<div className="space-y-2">
											<AddOnInput
												leftIcon={
													<Slash className="size-3 rotate-[112deg]" />
												}
												placeholder="my-workspace"
												disabled={isSubmitting}
												error={
													form.formState.errors?.slug
														?.message
												}
												id="slug"
												{...form.register('slug')}
												onChange={(e) => {
													const value = e.target.value
														.toLowerCase()
														.replace(/[^a-z0-9-]/g, '-');
													form.setValue('slug', value);
													setCheckSlugMessage(null);
													if (debouncedCheckSlug.current) {
														debouncedCheckSlug.current.cancel();
													}
													debouncedCheckSlug.current =
														_.debounce(checkSlug, 500);
													debouncedCheckSlug.current();
												}}
											/>

											{/* Slug Status */}
											<AnimatePresence mode="wait">
												{isCheckingSlug && (
													<motion.p
														key="checking"
														initial={{ opacity: 0, y: -5 }}
														animate={{ opacity: 1, y: 0 }}
														exit={{ opacity: 0, y: -5 }}
														className="flex items-center gap-1.5 text-muted-foreground text-xs"
													>
														<Loader2 className="size-3 animate-spin" />
														Checking availability...
													</motion.p>
												)}
												{!isCheckingSlug && checkSlugMessage && (
													<motion.p
														key="result"
														initial={{ opacity: 0, y: -5 }}
														animate={{ opacity: 1, y: 0 }}
														exit={{ opacity: 0, y: -5 }}
														className={cn(
															'flex items-center gap-1.5 text-xs font-medium',
															checkSlugMessage.status === 'error'
																? 'text-destructive'
																: 'text-emerald-600 dark:text-emerald-500',
														)}
													>
														{checkSlugMessage.status === 'error' ? (
															<XCircle className="size-3" />
														) : (
															<CheckCircle className="size-3" />
														)}
														{checkSlugMessage.message}
													</motion.p>
												)}
											</AnimatePresence>
										</div>
									</div>

									{/* Submit Button */}
									<Button
										type="submit"
										className="w-full h-11 font-medium"
										disabled={isSubmitting || !isFormValid}
									>
										{isSubmitting ? (
											<span className="flex items-center gap-2">
												<Loader2 className="size-4 animate-spin" />
												Creating Workspace...
											</span>
										) : (
											'Create Workspace'
										)}
									</Button>

									{/* Helper text */}
									{type === 'get-started-page' && (
										<p className="text-center text-xs text-muted-foreground">
											You can invite team members after creating your workspace.
										</p>
									)}
								</form>
							</motion.div>
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
								'hidden lg:block relative bg-gradient-to-br from-primary to-primary/80 rounded-2xl w-full h-full overflow-hidden',
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
