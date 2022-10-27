import React from "react";
import { Button } from "../elements/Buttton";
import { Field } from "../elements/Field";
import { useAppContext } from "../utils/appState";
import { Builder } from "./Builder";
import { StepBuilder } from "./StepBuilder";

export const PageBuilder: React.FunctionComponent<{ name?: string }> = ({
	name,
}) => {
	const { createPage, pages } = useAppContext();
	const nameRef = React.useRef<HTMLInputElement>(null);
	return (
		<>
			<Builder title="Page" enabled={!name}>
				<Field
					ref={nameRef}
					id="page-name-field"
					type="text"
					title="title"
					defaultValue={name}
				/>
				<Button
					type="submit"
					className="mx-2"
					content="Add page+"
					onClick={() => {
						createPage?.(nameRef?.current?.value);
					}}
				/>
			</Builder>
			{name && (
				<div className="ml-12">
					{pages[name].steps.map((_, index) => (
						<div key={index}>
							<StepBuilder pageName={name} stepIndex={index} />
						</div>
					))}
					<StepBuilder pageName={name} />
				</div>
			)}
		</>
	);
};
