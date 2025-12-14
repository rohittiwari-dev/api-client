'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Folder, FileJson, Globe, Key } from 'lucide-react';

const Loading = () => {
	return (
		<div className="flex flex-col justify-center items-center w-full min-h-screen overflow-hidden bg-background relative">
			{/* Subtle background gradient */}
			<div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-indigo-500/5" />

			{/* Loading content */}
			<div className="relative z-10 flex flex-col items-center">
				{/* Logo with pulse */}
				<motion.div
					className="relative mb-8"
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.5 }}
				>
					<motion.div
						className="absolute -inset-4 bg-violet-500/20 rounded-full blur-xl"
						animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
						transition={{ duration: 2, repeat: Infinity }}
					/>
					<div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 p-[2px]">
						<div className="w-full h-full rounded-2xl bg-background flex items-center justify-center">
							<Image
								src="/logo.png"
								alt="ApiClient"
								width={36}
								height={36}
								className="object-contain"
							/>
						</div>
					</div>
				</motion.div>

				{/* Loading text */}
				<motion.h2
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className="text-lg font-semibold text-foreground mb-2"
				>
					Loading Workspace
				</motion.h2>

				{/* Animated icons representing workspace elements */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.4 }}
					className="flex items-center gap-4 mt-6"
				>
					{[
						{ Icon: Folder, delay: 0, color: 'text-amber-400' },
						{ Icon: FileJson, delay: 0.1, color: 'text-green-400' },
						{ Icon: Globe, delay: 0.2, color: 'text-blue-400' },
						{ Icon: Key, delay: 0.3, color: 'text-violet-400' },
					].map(({ Icon, delay, color }, i) => (
						<motion.div
							key={i}
							className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center"
							animate={{
								y: [0, -8, 0],
								opacity: [0.5, 1, 0.5],
							}}
							transition={{
								duration: 1.2,
								repeat: Infinity,
								delay: delay,
							}}
						>
							<Icon className={`w-5 h-5 ${color}`} />
						</motion.div>
					))}
				</motion.div>

				{/* Subtle progress indicator */}
				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.6 }}
					className="mt-8 text-sm text-muted-foreground flex items-center gap-1"
				>
					<span>Preparing your environment</span>
					<motion.span
						animate={{ opacity: [0, 1, 0] }}
						transition={{ duration: 1.5, repeat: Infinity }}
					>
						...
					</motion.span>
				</motion.p>
			</div>
		</div>
	);
};

export default Loading;
