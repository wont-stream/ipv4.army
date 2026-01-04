import "./index.css";

import { Activities } from "./DiscordActivities";
import { Greeting } from "./Greeting";
import { Popups } from "./Popups";
import { Quote } from "./Quote";
import { Time } from "./Time";

export const Container = () => {
	return (
		<main class="container">
			<div>
				<span class="greeting-line">
					{" "}
					<Greeting />
					<Time />
				</span>
				<Quote />
			</div>
			<br />
			<div class="center">
				I'm a jack of many trades and hobbies including
				<br />
				<div class="button-grid">
					<button popovertarget="backend" type="button">
						Backend Dev
					</button>
					<button popovertarget="frontend" type="button">
						Frontend Dev
					</button>
					<button popovertarget="gaming" type="button">
						VR & Gaming
					</button>
					<button popovertarget="audio" type="button">
						Music & Audio
					</button>
					<button popovertarget="smarthome" type="button">
						Smart Home
					</button>
				</div>
			</div>
			<Activities />
			<Popups />
		</main>
	);
};
