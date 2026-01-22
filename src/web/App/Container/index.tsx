import "./index.css";

import { Activities } from "../Components/DiscordActivities";
import { Greeting } from "../Components/Greeting";
import { Quote } from "../Components/Quote";
import { Time } from "../Components/Time";
import { Popups } from "./Popups";

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
