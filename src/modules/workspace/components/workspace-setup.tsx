'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import _ from 'lodash';
import { Briefcase, CheckCircle, Loader2, Slash, Sparkles, XCircle, ArrowRight, Rocket, FolderOpen, Zap } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
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

			await authClient.organization.setActive({
				organizationId: result.data.id,
			});

			toast.success('Workspace created successfully!');
			form.reset();
			window.location.href = `/workspace/${result.data.slug}`;
		} catch {
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
				'grid lg:grid-cols-1 bg-background',
				type === 'get-started-page' &&
				'h-svh overflow-hidden lg:!grid-cols-2',
			)}
		>
			<AnimatePresence
				key={'getting-started'}
				presenceAffectsLayout
				mode="sync"
				initial={type === 'get-started-page'}
			>
				{/* Form Section */}
				<motion.div
					key={'form'}
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
					className={cn('flex flex-col gap-2 p-4 md:p-6 relative overflow-hidden')}
				>
					{/* Header */}
					{type === 'get-started-page' && (
						<div className="flex justify-between items-center w-full">
							<Link
								href="/"
								className="flex items-center gap-2 font-semibold group"
							>
								<motion.div
									whileHover={{ rotate: 360 }}
									transition={{ duration: 0.5 }}
									className="relative w-8 h-8"
								>
									<Image
										src="/logo.png"
										alt="ApiClient"
										fill
										className="object-contain"
									/>
								</motion.div>
								<span className="text-lg bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
									ApiClient
								</span>
							</Link>
							<ThemeSwitcher variant="multiple" />
						</div>
					)}

					{/* Form Container */}
					<div className="flex flex-1 justify-center items-center">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2 }}
							className="w-full max-w-sm"
						>
							<form
								className={cn('flex flex-col gap-4')}
								onSubmit={onSubmit}
							>
								{/* Title */}
								<div className="flex flex-col items-center gap-2 text-center">
									<motion.div
										initial={{ scale: 0 }}
										animate={{ scale: 1 }}
										transition={{ type: 'spring', delay: 0.1 }}
										className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center"
									>
										<Rocket className="w-5 h-5 text-white" />
									</motion.div>
									<h1 className="text-xl font-bold">
										{type === 'get-started-page'
											? 'Create Your Workspace'
											: 'New Workspace'}
									</h1>
									<p className="text-muted-foreground text-sm">
										Set up your workspace to organize your API collections
									</p>
								</div>

								{/* Form Fields */}
								<div className="grid gap-3">
									<motion.div
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.15 }}
									>
										<InputField
											id="organization-name"
											label={
												<Label htmlFor="organization-name" className="text-sm font-medium">
													Workspace Name
												</Label>
											}
											leftIcon={<Briefcase className="w-4 h-4" />}
											placeholder="My Workspace"
											className="h-10 rounded-xl bg-white/5 border-white/10 focus:border-violet-500/50"
											disabled={isSubmitting}
											error={
												form.formState.errors?.name
													?.message
											}
											{...form.register('name')}
										/>
									</motion.div>

									<motion.div
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.2 }}
									>
										<AddOnInput
											leftIcon={
												<Slash className="w-3 h-3 rotate-[112deg]" />
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
													className="flex items-center gap-1.5 text-muted-foreground text-xs mt-2"
												>
													<Loader2 className="w-3 h-3 animate-spin" />
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
														'flex items-center gap-1.5 text-xs font-medium mt-2',
														checkSlugMessage.status === 'error'
															? 'text-destructive'
															: 'text-emerald-500',
													)}
												>
													{checkSlugMessage.status === 'error' ? (
														<XCircle className="w-3 h-3" />
													) : (
														<CheckCircle className="w-3 h-3" />
													)}
													{checkSlugMessage.message}
												</motion.p>
											)}
										</AnimatePresence>
									</motion.div>

									{/* Submit Button */}
									<motion.div
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
									>
										<Button
											type="submit"
											className="w-full h-10 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-violet-500/25"
											disabled={isSubmitting || !isFormValid}
										>
											{isSubmitting ? (
												<span className="flex items-center gap-2">
													<Loader2 className="w-4 h-4 animate-spin" />
													Creating...
												</span>
											) : (
												<span className="flex items-center gap-2">
													Create Workspace
													<ArrowRight className="w-4 h-4" />
												</span>
											)}
										</Button>
									</motion.div>
								</div>

								{/* Helper text */}
								{type === 'get-started-page' && (
									<p className="text-center text-xs text-muted-foreground/60">
										You can invite team members after creating your workspace
									</p>
								)}
							</form>
						</motion.div>
					</div>
				</motion.div>

				{/* Visual Section */}
				{type === 'get-started-page' && (
					<motion.div
						key={'visual'}
						initial={{ opacity: 0, x: 100 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: 100 }}
						transition={{
							type: 'spring',
							stiffness: 300,
							damping: 30,
							duration: 0.5,
						}}
						className="hidden lg:block relative p-6"
					>
						<div className="relative h-full w-full rounded-3xl overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600">
							{/* Animated background */}
							<div className="absolute inset-0">
								<motion.div
									className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
									animate={{
										scale: [1, 1.2, 1],
										opacity: [0.3, 0.5, 0.3],
									}}
									transition={{ duration: 5, repeat: Infinity }}
								/>
								<motion.div
									className="absolute bottom-20 right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"
									animate={{
										scale: [1, 1.3, 1],
										opacity: [0.2, 0.4, 0.2],
									}}
									transition={{ duration: 6, repeat: Infinity, delay: 1 }}
								/>
							</div>

							{/* Content */}
							<div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center p-12">
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.3 }}
								>
									<motion.div
										className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-8 mx-auto"
										animate={{ rotate: [0, 5, -5, 0] }}
										transition={{ duration: 4, repeat: Infinity }}
									>
										<Sparkles className="w-10 h-10" />
									</motion.div>

									<h2 className="text-3xl font-bold mb-4">
										Welcome to ApiClient!
									</h2>
									<p className="text-white/80 text-lg mb-8 max-w-sm">
										Your workspace is where magic happens. Organize collections, test APIs, and collaborate with your team.
									</p>

									{/* Feature list */}
									<div className="flex flex-col gap-3 text-left max-w-xs mx-auto">
										{[
											{ icon: FolderOpen, label: 'Organize API collections' },
											{ icon: Zap, label: 'Lightning fast requests' },
											{ icon: Sparkles, label: 'Beautiful response viewer' },
										].map((feature, i) => (
											<motion.div
												key={feature.label}
												initial={{ opacity: 0, x: -20 }}
												animate={{ opacity: 1, x: 0 }}
												transition={{ delay: 0.5 + i * 0.1 }}
												className="flex items-center gap-3 text-sm text-white/90"
											>
												<div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
													<feature.icon className="w-4 h-4" />
												</div>
												{feature.label}
											</motion.div>
										))}
									</div>
								</motion.div>
							</div>

							{/* Grid pattern */}
							<div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default WorkspaceSetup;
