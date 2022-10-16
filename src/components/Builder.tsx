import clsx from "clsx";

interface Props {
	title: string;
	enabled?: boolean;
	children: React.ReactNode;
}

export const Builder: React.FunctionComponent<Props> = ({
	title,
	enabled = false,
	children,
}) => {
	return (
		<div>
			<form
				className={clsx("p-4 border-b-2 border-l-2 border-grey flex", {
					"opacity-30 pointer-events-none": !enabled,
				})}
				onSubmit={(e) => {
					e.preventDefault();
					e.currentTarget.reset();
				}}
			>
				<span className="mr-8 self-center">{title}</span>
				<div className="flex pl-10">{children}</div>
			</form>
		</div>
	);
};
