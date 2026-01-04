import { useRealtime } from "../util/realtime";
import { Container } from "./Container";
import { Nav } from "./Nav";

export const App = () => {
	useRealtime();

	return (
		<>
			<Nav />
			<Container />
		</>
	);
};
