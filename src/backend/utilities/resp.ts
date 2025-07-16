import { compress } from "./compression";

const respOptions = {
	headers: {
		"Cache-Control": "no-cache",
	},
};

export const ok = async (req: Request) => {
	const acceptEncoding = req.headers.get("Accept-Encoding") || "";

	const { header, body } = await compress("OK", acceptEncoding)

	return new Response(body, {
		status: 200,
		headers: {
			...respOptions.headers,
			...header,
			"Content-Type": "text/plain",
		},
	});
}

export const json = async (req: Request, data: { [key: string]: string }) => {
	const acceptEncoding = req.headers.get("Accept-Encoding") || "";

	const { header, body } = await compress(JSON.stringify(data), acceptEncoding)

	return new Response(body, {
		status: 200,
		headers: {
			...respOptions.headers,
			...header,
			"Content-Type": "application/json",
		},
	});
};

export const file = async (req: Request, data: Bun.BunFile) => {
	const isHTML = data.type === "text/html";

	const acceptEncoding = req.headers.get("Accept-Encoding") || "";

	const { header, body } = await compress(await data.arrayBuffer(), acceptEncoding)

	return new Response(body, {
		headers: {
			...(isHTML ? respOptions.headers : { "Cache-Control": "public, max-age=31536000" }),
			...header,
			"Content-Type": data.type,
		},
	});
};

const defaultTextOptions = { contentType: "text/plain", status: 200, cache: true } as { contentType?: string; status?: number; cache?: boolean };
export const text = async (req: Request, data: string, opts = defaultTextOptions) => {
	if (opts.contentType === "text/html") opts.cache = false;

	const acceptEncoding = req.headers.get("Accept-Encoding") || "";

	const { header, body } = await compress(data, acceptEncoding)

	return new Response(body, {
		status: opts.status,
		headers: {
			...(opts.cache ? { "Cache-Control": "public, max-age=31536000" } : respOptions.headers),
			...header,
			"Content-Type": opts.contentType,
		},
	});
}