import type { Types } from "@prequist/lanyard";
import { makeBadge } from "badge-maker";

const fetchError = makeBadge({
	label: "Failed to",
	message: `fetch streams`,
	color: "red",
});

const currentlyOffline = makeBadge({
	label: "Stream",
	message: `Offline`,
	color: "red",
});

const currentlyLive = makeBadge({
	label: "Stream",
	message: `Live`,
	color: "green",
});

const streamingNow = makeBadge({
	label: "Streaming",
	message: "Now",
	color: "green",
});

export default async (opts: {
	type: string;
	heartrate: number;
	lanyard: Types.Presence;
}) => {
	const { lanyard } = opts;

	const streamsReq = await fetch(`https://stream.atums.world/api/streams`);
	if (!streamsReq.ok) {
		return fetchError;
	}

	const streams = (await streamsReq.json()) as {
		success: boolean;
		error?: string;
		data: {
			streams: {
				name: string;
				frames: number;
			}[];
		};
	};
	if (streams.success !== true) {
		console.error(streams.error);
		return;
	}

	const liveStream = streams.data.streams.find(
		(stream) => stream.name === "seth",
	);
	if (!liveStream) {
		return currentlyOffline;
	}

	const atumsLiveActivity = lanyard.activities.find(
		(act) => act.application_id === "1401179007344443434",
	);

	if (!atumsLiveActivity) {
		return currentlyLive;
	}

	if (!atumsLiveActivity.details) {
		return streamingNow;
	}

	return makeBadge({
		label: "Streaming",
		message: atumsLiveActivity.details,
		color: "green",
	});
};
