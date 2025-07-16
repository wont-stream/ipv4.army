import { compress } from "../../../compression";
import { respOptions } from "../..";

export const file = async (req: Request, data: Bun.BunFile) => {
	const isHTML = data.type === "text/html";

	const acceptEncoding = req.headers.get("Accept-Encoding") || "";

	const { header, body } = await compress(
		await data.arrayBuffer(),
		acceptEncoding,
	);

	return new Response(body, {
		headers: {
			...(isHTML
				? respOptions.headers
				: { "Cache-Control": "public, max-age=31536000" }),
			...header,
			"Content-Type": data.type,
		},
	});
};
