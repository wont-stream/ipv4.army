import { createRef } from "tsx-dom";
import { on } from "../ts/lib/event.ts";

const colors = {
	online: "hsl(153, calc(1 * 46%), 49%)",
	idle: "rgb(240, 178, 50)",
	dnd: "rgb(242, 63, 67)",
	offline: "rgb(128, 132, 142)",
};

export const Avatar = () => {
	const img = createRef<HTMLImageElement>();

	on("discord", async (activity: Activity) => {
		if (img.current) {
			img.current.style.border = `solid ${colors[activity.status as keyof typeof colors]}`;
		}
	});

	return (
		<img
			alt="Seth's Avatar"
			class="small-width small-height circle"
			width="192px"
			height="192px"
			src="profile.webp"
			style="border: solid rgb(128, 132, 142)"
			ref={img}
		/>
	);
};
