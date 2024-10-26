fetch("https://1.ipv4.army/api/event", {
	method: "POST",
	body: JSON.stringify({
		domain: "ipv4.army",
		name: "pageview",
		url: location.href,
		referrer: document.referrer,
		props: {
			languages: navigator.languages.join(", "),
		},
	}),
});
