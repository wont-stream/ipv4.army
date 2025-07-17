export const track = async (req: Bun.BunRequest) => {
	if (
		req.url.includes("localhost") ||
		req.url.includes("127.0.0.1") ||
		req.url.includes("::1")
	) {
		return;
	}

	const ip =
		req.headers.get("CF-Connecting-IP") ||
		req.headers.get("CF-Connecting-IPv6") ||
		req.headers.get("X-Real-IP") ||
		req.headers.get("X-Forwarded-For");

	if (!ip) {
		return console.warn(
			"No IP address found in request headers.",
			req.headers.toJSON(),
		);
	} else {
		console.log("Tracking pageview from IP:", ip);
	}

	const referer = req.headers.get("referer");

	return await fetch("https://plausible.creations.works/api/event", {
		method: "POST",
		headers: {
			"User-Agent": req.headers.get("User-Agent") || `Bun/${Bun.version}`,
			"X-Forwarded-For": ip,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			domain: "ipv4.army",
			name: "pageview",
			url: req.url,
			...(referer ? { referer } : {}),
		}),
	});
};
