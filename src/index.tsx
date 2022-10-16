import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AppContextProvider } from "./utils/appState";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);
const renderApp = () => {
	root.render(
		<React.StrictMode>
			<AppContextProvider>
				<App />
			</AppContextProvider>
		</React.StrictMode>
	);
};
renderApp();
