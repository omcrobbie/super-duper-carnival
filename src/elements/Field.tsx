import React from "react";

interface Props {
	id?: string;
	type: "text" | "checkbox" | "radio";
	title: string | string[];
	defaultValue?: any;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Field = React.forwardRef<HTMLInputElement, Props>(
	({ id, type, title, onChange, defaultValue }, ref) => (
		<>
			{type === "checkbox" && (
				<div className="mx-2 flex flex-col justify-center">
					<label>
						{title}
						<input
							id={id}
							type={type}
							ref={ref}
							className="mx-2"
							onChange={(e) => onChange?.(e)}
							defaultChecked={defaultValue}
						/>
					</label>
				</div>
			)}
			{type === "text" && (
				<div className="mx-2">
					<div>
						<label className="text-sm">{title}</label>
					</div>
					<input
						defaultValue={defaultValue}
						id={id}
						type={type}
						ref={ref}
						onChange={(e) => onChange?.(e)}
					/>
				</div>
			)}
			{type === "radio" && (
				<fieldset className="flex flex-col justify-end">
					{(title as string[]).map((t) => (
						<div key={t}>
							<label>
								{t}
								<input
									id={t}
									type="radio"
									name="radio-select"
									className="mx-2"
									value={t}
									onChange={(e) => onChange?.(e)}
									defaultChecked={t === defaultValue}
									ref={ref}
								/>
							</label>
						</div>
					))}
				</fieldset>
			)}
		</>
	)
);
