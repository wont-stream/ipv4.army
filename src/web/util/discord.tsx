import { useEffect, useState } from "react";
import { get, useLanyard } from "use-lanyard";
import { site } from "@/web/data/site";

export const DiscordProvider = () => {
	const [initialData, setInitialData] = useState<
		Awaited<ReturnType<typeof get>> | undefined
	>(undefined);

	useEffect(() => {
		let cancelled = false;

		(async () => {
			const data = await get(site.discordUserId);
			if (!cancelled) {
				setInitialData(data);
			}
		})();

		return () => {
			cancelled = true;
		};
	}, []);

	useLanyard(site.discordUserId, {
		initialData,
	});

	return null;
};
