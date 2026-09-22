export const Image = (
	{ alt, src, width, height, ...props }: React.DetailedHTMLProps<
		React.ImgHTMLAttributes<HTMLImageElement>,
		HTMLImageElement
	>,
) => {
	const params = new URLSearchParams({
		output: "webp",
		url: src ?? "",
		w: width?.toString() ?? "0",
		h: height?.toString() ?? "0",
	});

	return (
		<img
			{...props}
			alt={alt}
			src={`https://wsrv.nl?${params}`}
		/>
	);
};
