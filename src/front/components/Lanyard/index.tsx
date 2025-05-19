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
	if (!activity.assets) return null;

	const image = activity.assets[`${size}_image`];

	if (!image) return null;

	if (image.startsWith("mp:external")) {
		return `https://wsrv.nl/?w=${size === "large" ? 120 : 40}&url=https://${image.split("/").slice(3).join("/")}`;
	}

	if (image.startsWith("mp:")) {
		return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${image.slice(3)}.webp`;
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
								<div class={style.status}>{activityTypes[activity.type]}</div>
								<div class={style.content}>
									{largeImage && (
										<div class={style.bigImage}>
											{/* @ts-expect-error; placement is not in the types for some reason? */}
											<mdui-tooltip content={activity.assets?.large_text} placement="top-right">
												<img src={largeImage} alt="Large Activity" />
											</mdui-tooltip>
											{smallImage && (
												<div class={style.smallImage}>
													{/* @ts-expect-error; placement is not in the types for some reason? */}
													<mdui-tooltip content={activity.assets?.small_text} placement="top-right">
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
