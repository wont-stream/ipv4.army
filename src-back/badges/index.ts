import type { Types } from "@prequist/lanyard";
import { makeBadge } from "badge-maker";

import heartrate from "./badge/heartrate";
import listening from "./badge/listening";
import status from "./badge/status";
import stream from "./badge/stream";
import wakapi from "./badge/wakapi";

const unknownBadge = makeBadge({
	label: "Unknown",
	message: `Badge`,
	color: "red",
});

export const badger = async (opts: {
	type: string;
	heartrate: number;
	lanyard: Types.Presence;
}) => {
	switch (opts.type) {
		case "heartrate": {
			return await heartrate(opts);
		}
		case "listening": {
			return await listening(opts);
		}
		case "status": {
			return await status(opts);
		}
		case "stream": {
			return await stream(opts);
		}
	}

	if (opts.type.startsWith("waka_")) {
		return await wakapi(opts);
	}

	return unknownBadge;
};
