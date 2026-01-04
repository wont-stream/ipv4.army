import { useRealtime } from "../util/realtime";
import Container from "./Container";
import Nav from "./Nav";

const App = () => {
	useRealtime();

	return (
		<>
			<Nav />
			<Container />
		</>
	);
};

export default App;
