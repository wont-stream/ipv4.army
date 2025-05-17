const effectTick = new Audio("https://no.ipv4.army/u/Effect_Tick.ogg");

effectTick.volume = 0.1;

const whitelistedTags = ["button", "icon", "item"];

document.onclick = (event: MouseEvent) => {
	const target = event.target as HTMLElement;

	if (!target) return;

	const tagName = target.tagName.toLowerCase();
	const isWhitelisted = whitelistedTags.some((tag) => tagName.includes(tag));

	console.log(tagName, isWhitelisted);

	if (!isWhitelisted) return;

	"vibrate" in navigator && navigator.vibrate(1);
	effectTick.currentTime = 0;
	effectTick.play();
};
