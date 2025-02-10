import { createRef } from "tsx-dom";

const start = new Date("2025-02-10T00:30:28.589000+00:00");

export const Together = () => {
	const text = createRef<HTMLDivElement>();

	const getTime = () => {
		const now = new Date();

		let years = now.getFullYear() - start.getFullYear();
		let months = now.getMonth() - start.getMonth();
		let days = now.getDate() - start.getDate();
		let hours = now.getHours() - start.getHours();
		let minutes = now.getMinutes() - start.getMinutes();
		let seconds = now.getSeconds() - start.getSeconds();
		let milliseconds = now.getMilliseconds() - start.getMilliseconds();

		if (milliseconds < 0) {
			milliseconds += 1000;
			seconds--;
		}
		if (seconds < 0) {
			seconds += 60;
			minutes--;
		}
		if (minutes < 0) {
			minutes += 60;
			hours--;
		}
		if (hours < 0) {
			hours += 24;
			days--;
		}
		if (days < 0) {
			const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
			days += lastMonth.getDate();
			months--;
		}
		if (months < 0) {
			months += 12;
			years--;
		}

		const parts = [];
		parts.push(`${years.toString().padStart(2,"0")}y`);
		parts.push(`${months.toString().padStart(2,"0")}m`);
		parts.push(`${days.toString().padStart(2,"0")}d`);
		parts.push(`${hours.toString().padStart(2,"0")}h`);
		parts.push(`${minutes.toString().padStart(2,"0")}m`);
		parts.push(`${seconds.toString().padStart(2,"0")}s`);
		parts.push(`${milliseconds.toString().padStart(4,"0")}ms`);

		if (text.current) {
			text.current.innerText = `With him for ${parts.join(", ")}.`;
		}

		return requestAnimationFrame(getTime);
	};

	getTime();

	return <div ref={text} />;
};
