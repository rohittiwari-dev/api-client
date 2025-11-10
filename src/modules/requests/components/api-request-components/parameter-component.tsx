import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { EnvironmentVariableInput } from '@/components/ui/environment-variable-input';
import { cn } from '@/lib/utils';
import useRequestStore from '../../store/request.store';

const ParameterComponent = () => {
	const { activeRequest, updateRequest } = useRequestStore();
	const parameters = activeRequest?.parameters || [];

	const addParameter = () => {
		const updatedParameters = [
			...parameters,
			{ key: '', value: '', description: '', isActive: true },
		];
		updateRequest(activeRequest?.id!, {
			parameters: updatedParameters,
			unsaved: true,
		});
	};

	const updateParameter = (index: number, field: string, value: string | boolean) => {
		const newParams = [...parameters];
		(newParams[index] as any)[field] = value;
		updateRequest(activeRequest?.id!, {
			parameters: newParams,
			unsaved: true,
		});
	};

	const removeParameter = (index: number) => {
		updateRequest(activeRequest?.id!, {
			parameters: parameters.filter((_, i) => i !== index),
			unsaved: true,
		});
	};

	return (
		<div className="flex flex-col gap-2 h-full">
			{/* Empty State */}
			{parameters.length === 0 && (
				<div className="flex-1 flex flex-col items-center justify-center gap-4 py-16">
					<div className="size-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 flex items-center justify-center">
						<Plus className="size-6 text-primary/60" />
					</div>
					<div className="text-center space-y-1">
						<p className="text-sm font-semibold text-foreground">No parameters yet</p>
						<p className="text-xs text-muted-foreground max-w-[200px]">Add query parameters to be appended to the request URL</p>
					</div>
					<Button
						variant="outline"
						size="sm"
						onClick={addParameter}
						className="h-9 text-xs gap-2 rounded-lg mt-1 border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/30"
					>
						<Plus className="size-3.5" /> Add Parameter
					</Button>
				</div>
			)}

			{/* Parameters List */}
			{parameters.length > 0 && (
				<>
					{/* Header Row */}
					<div className="grid grid-cols-[32px_1fr_1fr_1fr_32px] gap-3 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
						<div></div>
						<div>Key</div>
						<div>Value</div>
						<div>Description</div>
						<div></div>
					</div>

					{/* Parameter Rows */}
					<div className="flex flex-col gap-0.5">
						{parameters.map((param, index) => (
							<div
								key={index}
								className={cn(
									"group grid grid-cols-[32px_1fr_1fr_1fr_32px] gap-3 px-3 py-1.5 rounded-lg border border-transparent transition-all duration-200 items-center",
									"hover:bg-muted/50 dark:hover:bg-accent/30",
									!param.isActive && "opacity-50"
								)}
							>
								{/* Checkbox */}
								<div className="flex items-center justify-center">
									<Checkbox
										checked={param.isActive}
										onCheckedChange={(checked) => updateParameter(index, 'isActive', Boolean(checked))}
										className="size-4 rounded-md data-[state=checked]:bg-primary data-[state=checked]:border-primary shadow-sm"
									/>
								</div>

								{/* Key */}
								<div className="relative">
									<Input
										placeholder="e.g. page"
										value={param.key}
										onChange={(e) => updateParameter(index, 'key', e.target.value)}
										className="h-8 font-mono text-xs border-transparent bg-transparent hover:bg-muted/60 focus-visible:bg-background focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/10 px-2.5 rounded-md transition-all"
									/>
								</div>

								{/* Value */}
								<div className="relative">
									<EnvironmentVariableInput
										placeholder="e.g. 1 or {{page_num}}"
										value={param.value}
										onChange={(value) => updateParameter(index, 'value', value)}
										className="h-8 font-mono text-xs border-transparent bg-transparent hover:bg-muted/60 focus-visible:bg-background focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/10 px-2.5 rounded-md transition-all"
									/>
								</div>

								{/* Description */}
								<div className="relative">
									<Input
										placeholder="e.g. Page number for pagination"
										value={param.description}
										onChange={(e) => updateParameter(index, 'description', e.target.value)}
										className="h-8 text-xs text-muted-foreground border-transparent bg-transparent hover:bg-muted/60 focus-visible:bg-background focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/10 px-2.5 rounded-md transition-all"
									/>
								</div>

								{/* Delete */}
								<div className="flex items-center justify-center">
									<Button
										size="icon"
										variant="ghost"
										onClick={() => removeParameter(index)}
										className="h-7 w-7 rounded-md text-muted-foreground/40 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
									>
										<Trash2 className="size-3.5" />
									</Button>
								</div>
							</div>
						))}
					</div>

					{/* Add Button */}
					<button
						onClick={addParameter}
						className="flex items-center justify-center gap-2 h-9 text-xs rounded-lg text-muted-foreground/60 hover:text-primary border border-dashed border-border/50 hover:border-primary/30 hover:bg-primary/5 w-full transition-all duration-200"
					>
						<Plus className="size-3.5" /> Add Parameter
					</button>
				</>
			)}
		</div>
	);
};

export default ParameterComponent;

