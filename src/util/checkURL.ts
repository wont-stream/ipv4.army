import { allowedHosts } from "@/data/allowedHosts";

export const checkURL = (url: string) => {
	const { hostname, pathname } = new URL(url);

	if (hostname === "i.scdn.co") {
		return true;
	}

	return allowedHosts.includes(hostname) && pathname.split("/").length === 2;
};
