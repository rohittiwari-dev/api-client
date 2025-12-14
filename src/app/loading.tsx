'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';

const Loading = () => {
	return (
		<div className="flex flex-col justify-center items-center w-full min-h-screen overflow-hidden bg-background relative">
			{/* Background effects */}
			<div className="absolute inset-0 overflow-hidden">
				<motion.div
					className="absolute top-1/4 left-1/4 w-64 h-64 bg-violet-500/20 rounded-full blur-[100px]"
					animate={{
						scale: [1, 1.2, 1],
						opacity: [0.3, 0.5, 0.3],
					}}
					transition={{ duration: 3, repeat: Infinity }}
				/>
				<motion.div
					className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px]"
					animate={{
						scale: [1, 1.3, 1],
						opacity: [0.2, 0.4, 0.2],
					}}
					transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
				/>
			</div>

			{/* Loading content */}
			<div className="relative z-10 flex flex-col items-center">
				{/* Animated Logo */}
				<motion.div
					className="relative w-20 h-20 mb-8"
					animate={{
						scale: [1, 1.05, 1],
					}}
					transition={{ duration: 2, repeat: Infinity }}
				>
					{/* Outer ring */}
					<motion.div
						className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 p-[2px]"
						animate={{ rotate: 360 }}
						transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
					>
						<div className="w-full h-full rounded-2xl bg-background" />
					</motion.div>

					{/* Logo */}
					<div className="absolute inset-2 flex items-center justify-center">
						<Image
							src="/logo.png"
							alt="ApiClient"
							width={48}
							height={48}
							className="object-contain"
						/>
					</div>
				</motion.div>

				{/* Loading text */}
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-center"
				>
					<h2 className="text-xl font-semibold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent mb-2">
						ApiClient
					</h2>

					{/* Animated dots */}
					<div className="flex items-center justify-center gap-1">
						<span className="text-muted-foreground text-sm">Loading</span>
						{[0, 1, 2].map((i) => (
							<motion.span
								key={i}
								className="text-violet-400 text-lg"
								animate={{ opacity: [0.3, 1, 0.3] }}
								transition={{
									duration: 1,
									repeat: Infinity,
									delay: i * 0.2,
								}}
							>
								.
							</motion.span>
						))}
					</div>
				</motion.div>

				{/* Progress bar */}
				<motion.div
					className="mt-8 w-48 h-1 bg-white/10 rounded-full overflow-hidden"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.5 }}
				>
					<motion.div
						className="h-full bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 rounded-full"
						animate={{
							x: ['-100%', '100%'],
						}}
						transition={{
							duration: 1.5,
							repeat: Infinity,
							ease: 'easeInOut',
						}}
						style={{ width: '50%' }}
					/>
				</motion.div>
			</div>
		</div>
	);
};

export default Loading;
