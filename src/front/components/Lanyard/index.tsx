import { createRef } from "tsx-dom";
import colors from "../../utilities/colors.module.css";
import socket from "../../utilities/socket";

import "mdui/components/tooltip.js";

import style from "./index.module.css"; // entirely gpt generated :sob:

const activityTypes: Record<number, string> = {
	0: "Playing",
	1: "Streaming",
	2: "Listening to",
	3: "Watching",
	4: "Custom Status",
	5: "Competing in",
};

const getImageUrl = (activity: LanyardActivity, size: "large" | "small") => {
	const width = size === "large" ? 120 : 40;
	if (!activity.assets || !activity.assets.large_image) {
		if (size === "large")
			return `https://dcdn.dstn.to/app-icons/${activity.application_id}?size=128`;
	}

	if (!activity.assets) return null;

	const image = activity.assets[`${size}_image`];

	if (!image) return null;

	if (image.startsWith("mp:external")) {
		return `https://media.discordapp.net/${image.slice(3)}?size=${width}`;
	}

	if (image.startsWith("mp:app-assets")) {
		return `https://cdn.discordapp.com/${image.slice(3)}?size=${width}`;
	}

	if (image.startsWith("mp:")) {
		return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${image.slice(3)}.webp?size=${width}`;
	}
};

export default () => {
	const container = createRef<HTMLDivElement>();

	socket.addEventListener("lanyard", (event: Event) => {
		const lanyard = (event as CustomEvent<LanyardData>).detail;

		const streamingActivity = lanyard.activities.find((act) => act.type === 1);
		if (streamingActivity) {
			document.documentElement.className = colors.streaming || "";
		} else {
			document.documentElement.className = colors[lanyard.discord_status] || "";
		}

		if (lanyard.activities.length === 0) {
			document.body.style.setProperty("--lanyard-display", "none");
		} else {
			document.body.style.removeProperty("--lanyard-display");
		}

		if (container.current) {
			container.current.innerHTML = "";
			for (const activity of lanyard.activities) {
				if (activity.type === 4) {
					continue;
				}
				const largeImage = getImageUrl(activity, "large");
				const smallImage = getImageUrl(activity, "small");

				container.current.innerHTML += (
					<div>
						{/* @ts-expect-error; variant is not in the types for some reason? */}
						<mdui-card variant="filled" class={style.card}>
							{" "}
							<div class={style.activityCard}>
								<div class={style.status}>
									{activityTypes[activity.type]}
									{!largeImage && ` ${activity.name}`}
								</div>
								<div class={style.content}>
									{largeImage && (
										<div class={style.bigImage}>
											<mdui-tooltip
												content={activity.assets?.large_text}
												// @ts-expect-error; placement is not in the types for some reason?
												placement="top-right"
											>
												<img src={largeImage} alt="Large Activity" />
											</mdui-tooltip>
											{smallImage && (
												<div class={style.smallImage}>
													<mdui-tooltip
														content={activity.assets?.small_text}
														// @ts-expect-error; placement is not in the types for some reason?
														placement="top-right"
													>
														<img src={smallImage} alt="Small Activity" />
													</mdui-tooltip>
												</div>
											)}
										</div>
									)}
									<div class={style.textInfo}>
										<div class={style.appName}>{activity.name}</div>
										<div class={style.state}>{activity.state}</div>
										<div class={style.details}>{activity.details}</div>
									</div>
								</div>
							</div>
						</mdui-card>
						<br />
					</div>
				).outerHTML;
			}
		}
	});

	return <div ref={container} />;
};
