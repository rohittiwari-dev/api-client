import React, { use, useEffect } from 'react';
import hljs from 'highlight.js';
import Editor from 'react-simple-code-editor';
import { JsonValue } from '@/generated/prisma/runtime/library';

const JsonAndRawBodyComponent = ({
	type,
	onChange,
	value,
}: {
	type: 'raw' | 'json';
	onChange: (value: string) => void;
	value: JsonValue | string;
}) => {
	const [error, setError] = React.useState<string>('');

	const validateJson = (code: string) => {
		try {
			if (code.trim()) {
				JSON.parse(code);
			}
			setError('');
		} catch (e) {
			setError((e as Error).message);
		}
	};

	const handleChange = (code: string) => {
		onChange(code);
		type === 'json' && validateJson(code);
	};

	const highlight = (code: string) => {
		try {
			const result = hljs.highlight(code, { language: 'json' });
			return result.value;
		} catch {
			return hljs.highlightAuto(code).value;
		}
	};

	return (
		<div className="flex flex-col gap-2">
			<link
				rel="stylesheet"
				href={
					'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/tokyo-night-dark.min.css'
				}
				crossOrigin="anonymous"
			/>
			<div className="relative">
				<Editor
					value={JSON.stringify(value) || ''}
					onValueChange={handleChange}
					highlight={highlight}
					padding={10}
					style={{
						lineHeight: '1.5',
						fontFamily:
							'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',

						color: '#e6edf3',
						border: error
							? '1px solid rgb(239, 68, 68, 0.7)'
							: '1px solid #30363d',
						borderRadius: '6px',
					}}
					textareaClassName="focus:outline-none min-h-[280px] resize-none !text-sm"
					preClassName="language-json  !text-sm min-h-[280px]"
					name="code-editor"
					id="code-editor"
					aria-label="Code Editor"
					textareaId="code-editor-textarea"
				/>
			</div>
			{error && (
				<div className="px-2 text-rose-500/70 text-xs">
					Invalid JSON: {error}
				</div>
			)}
		</div>
	);
};

export default JsonAndRawBodyComponent;
