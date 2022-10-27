import React from "react";
import { Button } from "../elements/Buttton";
import { Field } from "../elements/Field";
import { Step, useAppContext } from "../utils/appState";
import { Builder } from "./Builder";

interface Props {
	pageName: string;
	stepIndex?: number;
}

export const StepBuilder: React.FunctionComponent<Props> = ({
	pageName,
	stepIndex,
}) => {
	const { pages, addStep } = useAppContext();
	const [state, setState] = React.useState<Step>({});

	const page = pages[pageName];
	const step = React.useMemo(
		() => (stepIndex !== undefined ? page.steps[stepIndex] : undefined),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[stepIndex]
	);
	return (
		<Builder title="Step" enabled={stepIndex === undefined}>
			<Field
				id="question-field"
				type="text"
				title="question"
				onChange={(e) =>
					setState({ ...state, question: e.currentTarget.value })
				}
				defaultValue={step?.question}
			/>
			<Field
				id="type-field"
				type="radio"
				title={["binary", "free"]}
				onChange={(e) =>
					setState({ ...state, questionType: e.currentTarget.value })
				}
				defaultValue={step?.questionType}
			/>
			<Field
				id="skip-field"
				type="checkbox"
				title="skippable?"
				onChange={(e) =>
					setState({ ...state, skippable: e.currentTarget.checked })
				}
				defaultValue={step?.skippable}
			/>
			<Button
				content="Add step+"
				className="mx-2"
				onClick={() => {
					addStep?.({ ...state }, pageName);
					setState({});
				}}
			/>
		</Builder>
	);
};
