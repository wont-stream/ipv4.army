import { Avatar } from "./Avatar.tsx";
import { Together } from "./Together.tsx";
import { Heartrate } from "./Heartrate.tsx";
import { Tidal } from "./Tidal.tsx";

export const App = () => {
	return (
		<main>
			<header>
				<Avatar />
				<h3>Hallo, Ich bin Seth.</h3>
			</header>
			<h4>Developing for both frontends and backends.</h4>
			<h4>Audiophile, Basshead and Techie.</h4>
			<Together />
			<Heartrate />
			<Tidal />
		</main>
	);
};
