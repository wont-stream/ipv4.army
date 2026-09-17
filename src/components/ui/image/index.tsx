export const Image = (
	props: React.DetailedHTMLProps<
		React.ImgHTMLAttributes<HTMLImageElement>,
		HTMLImageElement
	>,
) => {
	return (
		<img
			{...props}
			alt={props.alt}
			src={`https://wsrv.nl?output=webp&url=${encodeURIComponent(props.src as string)}`}
		/>
	);
};
