import React from "react";

interface Props {
	disabled?: boolean;
	id?: string;
	content: string;
	onClick: (event: React.MouseEvent) => void;
	type?: "submit" | "button" | "reset";
}

export const Button = React.forwardRef<HTMLButtonElement, Props>(
	({ id, disabled, onClick, content, type = "submit" }, ref) => (
		<div className="flex items-center">
			<button
				type={type}
				ref={ref}
				className="outline outline-1 mx-2 p-2 enabled:hover:bg-black enabled:hover:text-white rounded-full disabled:opacity-20 disabled:cursor-not-allowed"
				id={id}
				disabled={disabled}
				onClick={(e) => {
					onClick(e);
				}}
			>
				{content}
			</button>
		</div>
	)
);
