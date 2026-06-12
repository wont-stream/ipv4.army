import type { BunFile } from "bun";

type CompressionFormat = "gzip" | "deflate" | /*"br" |*/ "zstd" | null;

function detectCompression(headers: Headers): CompressionFormat {
	const acceptEncoding = headers.get("accept-encoding") ?? "";

	// Priority order: zstd > br > gzip > deflate
	if (/\bzstd\b/i.test(acceptEncoding)) return "zstd";
	//if (/\bbr\b/i.test(acceptEncoding)) return "br";
	if (/\bgzip\b/i.test(acceptEncoding)) return "gzip";
	if (/\bdeflate\b/i.test(acceptEncoding)) return "deflate";

	return null;
}

const COMPRESSION_HEADERS: Record<NonNullable<CompressionFormat>, string> = {
	zstd: "zstd",
	//br: "br",
	gzip: "gzip",
	deflate: "deflate",
};

export async function compressResponse(
	reqHeaders: Headers,
	file: BunFile,
): Promise<Response> {
	const format = detectCompression(reqHeaders);

	if (!format) {
		// Client doesn't support any compression — stream the file as-is
		return new Response(file);
	}

	const responseHeaders = new Headers({
		"Content-Type": file.type || "application/octet-stream",
	});

	// Use streaming compression for better memory efficiency
	const compressedStream = file.stream().pipeThrough(
		new CompressionStream(format)
	);

	const reader = compressedStream.getReader();
	const chunks: Uint8Array[] = [];

	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		chunks.push(value);
	}

	const compressedData = new Uint8Array(
		chunks.reduce((acc, chunk) => acc + chunk.length, 0)
	);
	let offset = 0;
	for (const chunk of chunks) {
		compressedData.set(chunk, offset);
		offset += chunk.length;
	}

	responseHeaders.set("Content-Encoding", COMPRESSION_HEADERS[format]);
	responseHeaders.set("Content-Length", String(compressedData.byteLength));
	responseHeaders.set("Vary", "Accept-Encoding");

	return new Response(compressedData, { headers: responseHeaders });
}
