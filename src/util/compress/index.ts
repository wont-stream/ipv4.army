export const compress = async (
	req: Request,
	file: Bun.BunFile,
	cache = true,
) => {
	const encoders = req.headers.get("Accept-Encoding") || "";

	const data = await file.arrayBuffer();

	let encoded: Buffer | Uint8Array<ArrayBuffer> | null = null;
	let encodedWith: string | null = null;

	if (encoders.includes("zstd")) {
		encoded = await Bun.zstdCompress(data, { level: 22 });
		encodedWith = "zstd";
	} else if (encoders.includes("gzip")) {
		encoded = Bun.gzipSync(data, { level: 9, memLevel: 9, windowBits: 31 });
		encodedWith = "gzip";
	}

	if (encoded === null) {
		// No encoding supported, return original file
		return new Response(file, {
			headers: {
				...(cache
					? { "Cache-Control": "public, max-age=31536000, immutable" }
					: {}),
			},
		});
	}

	return new Response(encoded as BodyInit, {
		headers: {
			"Content-Encoding": encodedWith as string,
			"Content-Type": file.type,
			...(cache
				? { "Cache-Control": "public, max-age=31536000, immutable" }
				: {}),
		},
	});
};
