import { Avatar } from "./Avatar.tsx";
import { Heartrate } from "./Heartrate.tsx";
import { Tidal } from "./Tidal.tsx";
import Gafam from "./unused/gafam.tsx";

export const App = () => {
	const events = new EventTarget();
	return (
		<main>
			<header>
				<Avatar />
				<h3>Hallo, Ich bin Seth.</h3>
			</header>
			<h4>Developing for both frontends and backends.</h4>
			<Heartrate />
			<Tidal />
		</main>
	);
};
