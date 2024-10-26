import { createRef } from "tsx-dom";
import { on } from "../lib/event.ts";

export const Tidal = () => {
	const link = createRef<HTMLAnchorElement>();

	on("discord", (activity: Activity) => {
		console.log(activity);
		if (link.current) {
			if (activity.listening_to_tidal) {
				link.current.href = `https://tidal.com/browse/track/${activity.tidal.trackId}/u`;
				link.current.innerHTML = `Listening to<br>${activity.tidal.song.replace(
					/\s?[\(\[].*?[\)\]]/g,
					"",
				)} by ${activity.tidal.artist}`;
			} else {
				link.current.href = "/#";
				link.current.textContent = "Not listening to anything.";
			}
		}
	});

	return (
		<a href="/#" ref={link}>
			Not listening to anything.
		</a>
	);
};
