import type { Types } from "@prequist/lanyard";
import "./index.css";

import { lanyard } from "src/web/util/realtime";
import Image from "../../Components/Image";
import { ProgressBar } from "./ProgressBar";

const typeMap = {
	0: "Playing",
	1: "Streaming",
	2: "Listening to",
	3: "Watching",
	4: "",
	5: "Competing in",
};

const getActivityImages = (activity: Types.Activity) => {
	const large = activity.assets?.large_image?.startsWith("mp:external")
		? `https://media.discordapp.net/${activity.assets.large_image.replace("mp:", "")}`
		: activity.assets?.large_image
			? `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png`
			: `https://dcdn.dstn.to/app-icons/${activity.application_id}`;

	const small = activity.assets?.small_image?.startsWith("mp:external")
		? `https://media.discordapp.net/${activity.assets.small_image.replace("mp:", "")}`
		: activity.assets?.small_image
			? `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.small_image}.png`
			: null;

	return { large, small };
};

export const Activities = () => {
	return lanyard.value.activities.map((activity) => {
		if (activity.type === 4) return null;

		const { large, small } = getActivityImages(activity);

		return (
			<blockquote key={activity.application_id || activity.id}>
				<div>
					{typeMap[activity.type as keyof typeof typeMap]} {activity.name}
				</div>
				<div class="activity">
					<div class="image">
						{large && (
							<Image
								class="large"
								width={70}
								height={70}
								src={large}
								alt={activity.assets?.large_text || activity.name}
								title={activity.assets?.large_text}
								onError={(e) => {
									e.currentTarget.style.display = "none";
								}}
							/>
						)}
						{small && (
							<Image
								class="small"
								width={30}
								height={30}
								src={small}
								alt={activity.assets?.small_text || activity.name}
								title={activity.assets?.small_text}
								onError={(e) => {
									e.currentTarget.style.display = "none";
								}}
							/>
						)}
					</div>

					<div class="text">
						<div>{activity.details || " "}</div>
						<div>{activity.state || " "}</div>
					</div>
				</div>
				<ProgressBar activity={activity} />
			</blockquote>
		);
	});
};
