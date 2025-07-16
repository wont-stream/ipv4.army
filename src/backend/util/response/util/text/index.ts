import { compress } from "../../../compression";
import { respOptions } from "../..";

const defaultTextOptions = {
	contentType: "text/plain",
	status: 200,
	cache: true,
} as { contentType?: string; status?: number; cache?: boolean };

export const text = async (
	req: Request,
	data: string,
	opts = defaultTextOptions,
) => {
	if (opts.contentType === "text/html") opts.cache = false;

	const acceptEncoding = req.headers.get("Accept-Encoding") || "";

	const { header, body } = await compress(data, acceptEncoding);

	return new Response(body, {
		status: opts.status,
		headers: {
			...(opts.cache
				? { "Cache-Control": "public, max-age=31536000" }
				: respOptions.headers),
			...header,
			"Content-Type": opts.contentType,
		},
	});
};
