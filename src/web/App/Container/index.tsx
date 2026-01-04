import "./index.css";

import { Activities } from "./DiscordActivities";
import { Greeting } from "./Greeting";
import { Quote } from "./Quote";
import { Time } from "./Time";

export const Container = () => {
	return (
		<main class="container">
			<p>
				<span class="greeting-line">
					{" "}
					<Greeting />
					<Time />
				</span>
				<Quote />
			</p>
			<ul>
				<li>I'm an avid backend developer</li>
				<li>And a casual frontender</li>
			</ul>
			<p>I've dumped a decent amount of money into different things such as</p>
			<ul>
				<li>Virtual Reality</li>
				<li>Audio Gear</li>
				<li>Smart Home Equipment</li>
			</ul>
			<Activities />
		</main>
	);
};
