import "./App.css";
import { PageBuilder } from "./components/PageBuilder";
import { useAppContext } from "./utils/appState";

const App = () => {
	const { pages } = useAppContext();
	console.log(pages);
	return (
		<>
			{Object.keys(pages).map((key) => (
				<div key={key}>
					<PageBuilder name={key} />
				</div>
			))}
			<PageBuilder />
		</>
	);
};

export default App;
