const respOptions = {
	headers: {
		"Content-Type": "application/json",
		"Cache-Control": "no-cache",
		"Content-Encoding": "gzip",
	},
};

export const ok = () =>
	new Response(Bun.gzipSync(JSON.stringify({ data: "ok" })), respOptions);

export const json = (data: { [key: string]: string }) =>
	new Response(Bun.gzipSync(JSON.stringify(data)), respOptions);

export const file = async (file: Bun.BunFile) => {
	const isHTML = file.type === "text/html";

	return new Response(Bun.gzipSync(await file.arrayBuffer()), {
		headers: {
			"Content-Type": file.type,
			...(isHTML ? {} : { "Cache-Control": "public, max-age=31536000" }),
			"Content-Encoding": "gzip",
		},
	});
};
export const text = async (
	text: string,
	contentType: string,
	status = 200,
	noCache = false,
) => {
	return new Response(Bun.gzipSync(text), {
		status,
		headers: {
			"Content-Type": contentType,
			...(noCache ? {} : { "Cache-Control": "public, max-age=31536000" }),
			"Content-Encoding": "gzip",
		},
	});
};
