import fourzerofour from "./404";
import listening from "./listening";
import status from "./status";

const badges = {
	fourzerofour,
	listening,
	status,
};

const badgeTypes = Object.keys(badges);

export const badge = async (req: Bun.BunRequest<"/api/badge/:type">) => {
	let badge: string;

	if (badgeTypes.includes(req.params.type)) {
		badge = req.params.type;
	} else {
		badge = "fourzerofour";
	}

	return new Response(await badges[badge as keyof typeof badges](), {
		headers: {
			"content-type": "image/svg+xml",
		},
	});
};
