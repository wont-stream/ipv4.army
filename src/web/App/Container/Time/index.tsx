import { useEffect, useState } from "preact/hooks";

const timeZone = "America/New_York";

export const Time = () => {
	const [time, setTime] = useState(
		new Date().toLocaleString(undefined, { timeZone }),
	);

	useEffect(() => {
		const tick = () => {
			setTime(new Date().toLocaleString(undefined, { timeZone }));
		};

		const now = new Date();
		const delay = 1000 - now.getMilliseconds(); // align to next second

		const timeout = setTimeout(() => {
			tick();
			const interval = setInterval(tick, 1000);
			return () => clearInterval(interval);
		}, delay);

		return () => clearTimeout(timeout);
	}, []);

	return <code>{time}</code>;
};
