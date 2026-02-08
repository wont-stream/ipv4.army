import { makeBadge } from "badge-maker";
import { defaultBadgeOptions } from "../defaults";

const badge = () => {
	return makeBadge({
		...defaultBadgeOptions,
		label: "Not",
		message: "Found",
		color: "red",
	});
};

export default badge;
