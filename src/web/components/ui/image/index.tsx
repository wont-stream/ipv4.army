import { useEffect, useState } from "react";

export const Image = ({
	alt,
	src,
	width,
	height,
	...props
}: React.DetailedHTMLProps<
	React.ImgHTMLAttributes<HTMLImageElement>,
	HTMLImageElement
>) => {
	const [loaded, setLoaded] = useState(false);

	const placeholder = src
		? `/api/placeholder?${new URLSearchParams({ src })}`
		: undefined;

	const full = `https://wsrv.nl?${new URLSearchParams({
		output: "webp",
		url: src ?? "",
		w: width?.toString() ?? "0",
		h: height?.toString() ?? "0",
	})}`;

	useEffect(() => {
		if (!src) return;

		let cancelled = false;
		setLoaded(false);

		// window.Image is REQUIRED. The component name shadows the global Image.
		const img = new window.Image();
		img.src = full;
		const done = () => {
			if (!cancelled) setLoaded(true);
		};
		img.decode().then(done, done);

		return () => {
			cancelled = true;
		};
	}, [src, full]);

	return (
		<img
			{...props}
			alt={alt}
			width={width}
			height={height}
			src={loaded ? full : placeholder}
		/>
	);
};
