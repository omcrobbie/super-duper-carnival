import clsx from "clsx";
import React from "react";

interface Props
	extends React.DetailedHTMLProps<
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	> {
	content: string;
}

export const Button = React.forwardRef<HTMLButtonElement, Props>(
	(props, ref) => {
		const { className, content } = props;
		return (
			<div className="flex items-center">
				<button
					{...props}
					ref={ref}
					className={clsx(
						"outline outline-1 p-2 enabled:hover:bg-black enabled:hover:text-white rounded-full disabled:opacity-20 disabled:cursor-not-allowed",
						className
					)}
				>
					{content}
				</button>
			</div>
		);
	}
);
