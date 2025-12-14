'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { LockIcon, Mail, User2, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { IconGoogle } from '@/assets/app-icons';
import authClient from '@/lib/authClient';
import {
	signInFormSchema,
	signUpFormSchema,
} from '@/lib/form-schemas/auth-forms';
import { cn } from '@/lib/utils';
import { InputField } from '../../../components/app-ui/inputs';
import ThemeSwitcher from '../../../components/app-ui/theme-switcher';
import { Button } from '../../../components/ui/button';
import { Checkbox } from '../../../components/ui/checkbox';
import { Label } from '../../../components/ui/label';

type Props = {
	type?: 'sign-in' | 'sign-up';
	className?: string;
	content_flow?: 'right' | 'left';
	image_src?: string;
	image_alt?: string;
	error_description?: string;
	error?: string;
};

const AuthForm = ({
	type = 'sign-in',
	error,
	error_description,
	className,
	content_flow = 'left',
}: Props) => {
	const [rememberMe, setRememberMe] = useState(false);
	const [loading, setLoading] = useState({
		googleAuthLoading: false,
		emailSigninLoading: false
	});

	useEffect(() => {
		if (
			error === 'signup_disabled' ||
			error_description === 'signup_disabled'
		) {
			toast.error("You don't have an account, please sign up");
			redirect('/sign-up');
		}
	}, [error, error_description]);

	const form = useForm<
		z.infer<typeof signUpFormSchema> | z.infer<typeof signInFormSchema>
	>({
		defaultValues: {
			email: '',
			password: '',
			name: '',
		},
		resolver: zodResolver(
			type === 'sign-up' ? signUpFormSchema : signInFormSchema,
		),
		mode: 'onChange',
	});

	const handleSubmit = async (
		data:
			| z.infer<typeof signUpFormSchema>
			| z.infer<typeof signInFormSchema>,
	) => {
		if (type === 'sign-up') {
			return await authClient.signUp.email(
				{
					email: data.email,
					password: data.password,
					name: (data as z.infer<typeof signUpFormSchema>).name,
					callbackURL: '/workspace/get-started',
				},
				{
					onRequest: () => {
						setLoading((prev) => ({
							...prev,
							emailSigninLoading: true,
						}));
					},
					onSuccess: () => {
						toast.success('Successfully Signed Up');
					},
					onError: (ctx) => {
						console.log(ctx);
						toast.error(ctx.error.message);
					},
					onResponse: () => {
						setLoading((prev) => ({
							...prev,
							emailSigninLoading: false,
						}));
					},
				},
			);
		} else {
			return await authClient.signIn.email(
				{
					email: data.email,
					password: data.password,
					rememberMe: rememberMe,
					callbackURL: '/workspace/get-started',
				},
				{
					onRequest: () => {
						setLoading((prev) => ({
							...prev,
							emailSigninLoading: true,
						}));
					},
					onSuccess: () => {
						toast.success('Successfully logged in');
					},
					onError: (ctx) => {
						console.log(ctx);
						toast.error(ctx.error.message);
					},
					onResponse: () => {
						setLoading((prev) => ({
							...prev,
							emailSigninLoading: false,
						}));
					},
				},
			);
		}
	};

	const handleGoogleLoginAndSignup = async () => {
		await authClient.signIn.social({
			provider: 'google',
			requestSignUp: type === 'sign-up',
			callbackURL: '/workspace/get-started',
			errorCallbackURL: type === 'sign-up' ? `/sign-up` : `/sign-in`,
		});
	};

	return (
		<div className="grid h-svh overflow-hidden lg:grid-cols-2 bg-background">
			<AnimatePresence
				key={content_flow}
				presenceAffectsLayout
				mode="sync"
			>
				{/* Form Section */}
				<motion.div
					key={'form'}
					initial={{
						opacity: 0,
						x: content_flow === 'left' ? 100 : -100,
					}}
					animate={{ opacity: 1, x: 0 }}
					exit={{
						opacity: 0,
						x: content_flow === 'left' ? 100 : -100,
					}}
					transition={{
						type: 'spring',
						stiffness: 300,
						damping: 30,
						duration: 0.5,
					}}
					className={cn(
						'flex flex-col gap-2 p-4 md:p-6 relative overflow-hidden',
						content_flow === 'right' ? 'order-2' : 'order-1',
					)}
				>
					{/* Header */}
					<div className="flex w-full justify-between items-center">
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

					{/* Form Container */}
					<div className="flex flex-1 items-center justify-center">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2 }}
							className="w-full max-w-sm"
						>
							<form
								className={cn('flex flex-col gap-4', className)}
								onSubmit={form.handleSubmit(handleSubmit)}
							>
								{/* Title */}
								<div className="flex flex-col items-center gap-2 text-center">
									<motion.div
										initial={{ scale: 0 }}
										animate={{ scale: 1 }}
										transition={{ type: 'spring', delay: 0.1 }}
										className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center"
									>
										{type === 'sign-in' ? (
											<LockIcon className="w-5 h-5 text-white" />
										) : (
											<Sparkles className="w-5 h-5 text-white" />
										)}
									</motion.div>
									<h1 className="text-xl font-bold">
										{type === 'sign-in'
											? 'Welcome back!'
											: 'Create your account'}
									</h1>
									<p className="text-muted-foreground text-sm">
										{type === 'sign-in'
											? 'Sign in to continue to your workspace'
											: 'Get started with ApiClient for free'}
									</p>
								</div>

								{/* Form Fields */}
								<div className="grid gap-3">
									{/* Google Button */}
									<motion.div
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
									>
										<Button
											variant="outline"
											className="w-full h-10 rounded-xl border-white/10 hover:bg-white/5 hover:border-violet-500/30 transition-all"
											type="button"

											onClick={handleGoogleLoginAndSignup}
										>
											{loading.googleAuthLoading ? (
												<Loader2 className="mr-2 size-5" />
											) : (
												<IconGoogle className="mr-2 size-5" />
											)}
											Continue with Google
										</Button>
									</motion.div>

									{/* Divider */}
									<div className="relative text-center text-sm">
										<div className="absolute inset-0 flex items-center">
											<div className="w-full border-t border-white/10" />
										</div>
										<span className="relative bg-background px-4 text-muted-foreground text-xs">
											or continue with email
										</span>
									</div>

									{type === 'sign-up' && (
										<motion.div
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.1 }}
										>
											<InputField
												id="name"
												label={
													<Label htmlFor="name" className="text-sm font-medium">
														Full Name
													</Label>
												}
												type="name"
												leftIcon={<User2 className="w-4 h-4" />}
												placeholder="John Doe"
												className="h-10 rounded-xl bg-white/5 border-white/10 focus:border-violet-500/50"
												error={
													('name' in
														form.formState.errors &&
														form.formState.errors
															?.name?.message) ||
													undefined
												}
												{...form.register('name')}
											/>
										</motion.div>
									)}

									<motion.div
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.15 }}
									>
										<InputField
											id="email"
											label={
												<Label htmlFor="email" className="text-sm font-medium">
													Email
												</Label>
											}
											leftIcon={<Mail className="w-4 h-4" />}
											type="email"
											placeholder="you@example.com"
											className="h-10 rounded-xl bg-white/5 border-white/10 focus:border-violet-500/50"
											error={
												form.formState.errors?.email
													?.message
											}
											{...form.register('email')}
										/>
									</motion.div>

									<motion.div
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.2 }}
									>
										<InputField
											type="password"
											leftIcon={<LockIcon className="w-4 h-4" />}
											placeholder="••••••••"
											className="h-10 rounded-xl bg-white/5 border-white/10 focus:border-violet-500/50"
											error={
												form.formState.errors?.password
													?.message
											}
											id="password"
											label={
												<div className="flex items-center justify-between">
													<Label htmlFor="password" className="text-sm font-medium">
														Password
													</Label>
													{type === 'sign-in' && (
														<a
															href="#"
															className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
														>
															Forgot password?
														</a>
													)}
												</div>
											}
											{...form.register('password')}
										/>
									</motion.div>

									{type === 'sign-in' && (
										<motion.div
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											className="flex items-center gap-2"
										>
											<Checkbox
												id="remember-me"
												title="Remember me"
												className="cursor-pointer rounded border-white/20 data-[state=checked]:bg-violet-500 data-[state=checked]:border-violet-500"
												onCheckedChange={(checked) =>
													setRememberMe(
														checked as boolean,
													)
												}
											/>
											<Label
												htmlFor="remember-me"
												className="cursor-pointer text-sm text-muted-foreground"
											>
												Remember me for 30 days
											</Label>
										</motion.div>
									)}

									{/* Submit Button */}
									<motion.div
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
									>
										<Button
											type="submit"
											className="w-full h-10 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-violet-500/25"
										>
											{loading.emailSigninLoading ?
												<Loader2 className="mr-2 size-5" />
												: <>
													{type === 'sign-in' ? 'Sign In' : 'Create Account'}
													<ArrowRight className="w-4 h-4 ml-2" />
												</>}

										</Button>
									</motion.div>
								</div>

								{/* Footer Link */}
								<p className="text-center text-sm text-muted-foreground">
									{type === 'sign-in'
										? "Don't have an account? "
										: 'Already have an account? '}
									<Link
										href={
											type === 'sign-in'
												? '/sign-up'
												: '/sign-in'
										}
										className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
									>
										{type === 'sign-in'
											? 'Sign up'
											: 'Sign in'}
									</Link>
								</p>
							</form>
						</motion.div>
					</div>
				</motion.div>

				{/* Image/Visual Section */}
				<motion.div
					key={'visual'}
					initial={{
						opacity: 0,
						x: content_flow === 'left' ? -100 : 100,
					}}
					animate={{ opacity: 1, x: 0 }}
					exit={{
						opacity: 0,
						x: content_flow === 'left' ? -100 : 100,
					}}
					transition={{
						type: 'spring',
						stiffness: 300,
						damping: 30,
						duration: 0.5,
					}}
					className={cn(
						'relative hidden p-6 lg:block',
						content_flow === 'right' ? 'order-1' : 'order-2',
					)}
				>
					<div className="relative h-full w-full rounded-3xl overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600">
						{/* Animated background patterns */}
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
									<Image
										src="/logo.png"
										alt="ApiClient"
										width={48}
										height={48}
										className="object-contain"
									/>
								</motion.div>

								<h2 className="text-3xl font-bold mb-4">
									{type === 'sign-in'
										? 'Welcome Back!'
										: 'Join ApiClient'}
								</h2>
								<p className="text-white/80 text-lg mb-8 max-w-sm">
									{type === 'sign-in'
										? 'Your workspace is waiting. Pick up right where you left off.'
										: 'The most beautiful API client, built for developers who care.'}
								</p>

								{/* Feature pills */}
								<div className="flex flex-wrap justify-center gap-3">
									{['Free Forever', 'Open Source', 'Self-Hostable'].map((feature, i) => (
										<motion.div
											key={feature}
											initial={{ opacity: 0, scale: 0.8 }}
											animate={{ opacity: 1, scale: 1 }}
											transition={{ delay: 0.5 + i * 0.1 }}
											className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium"
										>
											{feature}
										</motion.div>
									))}
								</div>
							</motion.div>
						</div>

						{/* Grid pattern */}
						<div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
					</div>
				</motion.div>
			</AnimatePresence>
		</div>
	);
};

export default AuthForm;
