export const Image = (
	props: React.DetailedHTMLProps<
		React.ImgHTMLAttributes<HTMLImageElement>,
		HTMLImageElement
	>,
) => {
	let query = "";
	if (props.width) query += `&w=${props.width}`;
	if (props.height) query += `&h=${props.height}`;
	return (
		<img
			{...props}
			alt={props.alt}
			src={`https://wsrv.nl?output=webp${query}&url=${encodeURIComponent(props.src as string)}`}
		/>
	);
};
