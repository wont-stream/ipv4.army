const referersReq = await fetch(
	"https://s3-eu-west-1.amazonaws.com/snowplow-hosted-assets/third-party/referer-parser/referers-latest.json",
);

const referers = (await referersReq.json()) as {
	email: { [key: string]: { domains: string[]; parameters?: string[] } };
	paid: { [key: string]: { domains: string[]; parameters?: string[] } };
	search: { [key: string]: { domains: string[]; parameters?: string[] } };
	social: { [key: string]: { domains: string[]; parameters?: string[] } };
	unknown: { [key: string]: { domains: string[]; parameters?: string[] } };
};

export const getReferer = (req: Bun.BunRequest) => {
	const referer = req.headers.get("referer");
	if (!referer) return "None";

	try {
		const { hostname } = new URL(referer);

		const email = Object.entries(referers.email).find(([_, data]) =>
			data.domains.includes(hostname),
		);
		if (email)
			return {
				type: "Email",
				referer: email[0],
			};

		const paid = Object.entries(referers.paid).find(([_, data]) =>
			data.domains.includes(hostname),
		);
		if (paid)
			return {
				type: "Paid",
				referer: paid[0],
			};

		const search = Object.entries(referers.search).find(([_, data]) =>
			data.domains.includes(hostname),
		);
		if (search)
			return {
				type: "Search",
				referer: search[0],
			};

		const social = Object.entries(referers.social).find(([_, data]) =>
			data.domains.includes(hostname),
		);
		if (social)
			return {
				type: "Social",
				referer: social[0],
			};

		const unknown = Object.entries(referers.unknown).find(([_, data]) =>
			data.domains.includes(hostname),
		);
		if (unknown)
			return {
				type: "Unknown",
				referer: unknown[0],
			};
	} catch {}

	return {
		type: "Other",
		referer,
	};
};

console.log(
	getReferer({
		headers: new Headers({
			referer: "https://mail.google.com",
		}),
	}),
);
