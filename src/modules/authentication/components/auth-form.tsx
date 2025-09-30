'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconBrandSocketIo } from '@tabler/icons-react';
import { LockIcon, Mail, User2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { IconGoogle } from '@/assets/app-icons';
import AuthImage from '@/assets/authImage.webp';
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
	image_src,
	image_alt,
}: Props) => {
	const [rememberMe, setRememberMe] = useState(false);

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
					onSuccess: () => {
						toast.success('Successfully Signed Up');
					},
					onError: (ctx) => {
						toast.error(ctx.error.message);
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
					onSuccess: () => {
						toast.success('Successfully logged in');
					},
					onError: (ctx) => {
						toast.error(ctx.error.message);
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
		<div className="grid min-h-svh overflow-hidden lg:grid-cols-2">
			<AnimatePresence
				key={content_flow}
				presenceAffectsLayout
				mode="sync"
			>
				<motion.div
					key={'right'}
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
						'flex flex-col gap-4 p-6 md:p-10',
						content_flow === 'right' ? 'order-2' : 'order-1',
					)}
				>
					<div className="flex w-full justify-between gap-2">
						<a
							href="#"
							className="flex items-center gap-2 font-medium"
						>
							<div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
								<IconBrandSocketIo className="size-4" />
							</div>
							ApiClient
						</a>
						<ThemeSwitcher variant="multiple" />
					</div>
					<div className="flex flex-1 items-center justify-center">
						<div className="w-full max-w-xs">
							<form
								className={cn('flex flex-col gap-6', className)}
								onSubmit={form.handleSubmit(handleSubmit)}
							>
								<div className="flex flex-col items-center gap-2 text-center">
									<h1 className="text-2xl font-bold">
										{type === 'sign-in'
											? 'Login to your account'
											: 'Create an account'}
									</h1>
									<p className="text-muted-foreground text-sm text-balance">
										{type === 'sign-in'
											? 'Enter your credentials to login'
											: 'Enter your details to get started'}
									</p>
								</div>
								<div className="grid gap-6">
									{type === 'sign-up' && (
										<div className="grid gap-3">
											<InputField
												id="name"
												label={
													<Label htmlFor="name">
														Name
													</Label>
												}
												type="name"
												leftIcon={<User2 />}
												placeholder="Jon Doe"
												error={
													('name' in
														form.formState.errors &&
														form.formState.errors
															?.name?.message) ||
													undefined
												}
												{...form.register('name')}
											/>
										</div>
									)}
									<div className="grid gap-3">
										<InputField
											id="email"
											label={
												<Label htmlFor="email">
													Email
												</Label>
											}
											leftIcon={<Mail />}
											type="email"
											placeholder="m@example.com"
											error={
												form.formState.errors?.email
													?.message
											}
											{...form.register('email')}
										/>
									</div>
									<div className="grid gap-3">
										<InputField
											type="password"
											leftIcon={<LockIcon />}
											placeholder="⋆⋆⋆⋆⋆⋆⋆"
											error={
												form.formState.errors?.password
													?.message
											}
											id="password"
											label={
												<div className="flex items-center">
													<Label htmlFor="password">
														Password
													</Label>
													<a
														href="#"
														className="ml-auto text-sm underline-offset-4 hover:underline"
													>
														Forgot your password?
													</a>
												</div>
											}
											{...form.register('password')}
										/>
									</div>
									{type === 'sign-in' && (
										<div className="flex cursor-pointer gap-2">
											<Checkbox
												id="remember-me"
												title="Remember me"
												className="cursor-pointer"
												onCheckedChange={(checked) =>
													setRememberMe(
														checked as boolean,
													)
												}
											/>
											<Label
												htmlFor="remember-me"
												className="cursor-pointer"
											>
												Remember me
											</Label>
										</div>
									)}
									<Button type="submit" className="w-full">
										{type === 'sign-in'
											? 'Login'
											: 'Sign Up'}
									</Button>
									<div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
										<span className="bg-background text-muted-foreground relative z-10 px-2">
											Or continue with
										</span>
									</div>
									<Button
										variant="outline"
										className="w-full"
										type="button"
										onClick={handleGoogleLoginAndSignup}
									>
										<IconGoogle className="mr-2 size-4" />
										{type === 'sign-in'
											? 'Login with Google'
											: 'Sign Up with Google'}
									</Button>
								</div>
								<div className="text-center text-sm">
									Don&apos;t have an account?{' '}
									<Link
										href={
											type === 'sign-in'
												? '/sign-up'
												: '/sign-in'
										}
										className="underline underline-offset-4"
									>
										{type === 'sign-in'
											? 'Create an account'
											: 'Login to your account'}
									</Link>
								</div>
							</form>
						</div>
					</div>
				</motion.div>
				<motion.div
					key={'left'}
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
					<div
						className={cn(
							'bg-primary relative hidden h-full w-full overflow-hidden rounded-2xl lg:block',
						)}
					>
						<div className="bg-primary/10 blur-in absolute inset-0 z-10 h-full w-full" />
						<Image
							width={1000}
							height={1000}
							src={image_src || AuthImage}
							alt={image_alt || 'Image'}
							className="bg-primary/10 absolute h-full w-full object-cover opacity-65 dark:invert"
						/>
					</div>
				</motion.div>
			</AnimatePresence>
		</div>
	);
};

export default AuthForm;
