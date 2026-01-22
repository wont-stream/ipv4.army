import type { GenericEventHandler } from "preact";

export const Image = (props: {
	src?: string;
	alt?: string;
	title?: string;
	class?: string;
	width: number;
	height: number;
	fit?: "inside" | "outside" | "cover" | "fill" | "contain";
	onError?: GenericEventHandler<HTMLImageElement>;
}) => {
	return (
		<img
			loading="lazy"
			decoding="async"
			src={`https://wsrv.nl?w=${props.width}&h=${props.height}&dpr=${window.devicePixelRatio}&fit=${props.fit || "fill"}&default=${location.host}/android-chrome-192x192.png&output=webp&url=${encodeURIComponent(props.src || "")}`}
			alt={props.alt}
			title={props.title}
			class={props.class}
			width={props.width}
			height={props.height}
			onError={props.onError}
		/>
	);
};
