import React from "react";

export interface Step {
	question?: string;
	questionType?: string;
	skippable?: boolean;
}

export interface Page {
	steps: Step[];
}

export interface AppContext {
	createPage?: (pageName?: string) => void;
	addStep?: (step: Step, pageName?: string) => void;
	pages: { [key: string]: Page };
}

const appContextDefaults: AppContext = {
	pages: {},
};
const appContext = React.createContext<AppContext>(appContextDefaults);

export const AppContextProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [pages, setPages] = React.useState<{ [key: string]: Page }>({});

	const createPage = (pageName?: string) => {
		if (pageName) {
			setPages({
				...pages,
				[pageName]: {
					steps: [],
				},
			});
		}
	};
	const addStep = (step: Step, pageName?: string) => {
		if (pageName) {
			const existingSteps = pages[pageName].steps;
			setPages({
				...pages,
				[pageName]: {
					steps: [...existingSteps, step],
				},
			});
		}
	};
	return (
		<appContext.Provider value={{ pages, createPage, addStep }}>
			{children}
		</appContext.Provider>
	);
};

export const useAppContext = () => React.useContext(appContext);
