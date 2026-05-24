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

	const fileBuffer = await file.arrayBuffer();

	const responseHeaders = new Headers({
		"Content-Type": file.type || "application/octet-stream",
	});

	// Bun.gzipSync / deflateSync / etc. based on format
	const data = new Uint8Array(fileBuffer);
	let compressedData: Uint8Array;
	switch (format) {
		case "gzip":
			compressedData = Bun.gzipSync(data);
			break;
		case "deflate":
			compressedData = Bun.deflateSync(data);
			break;
		/*case "br":
			compressedData = Bun.brotliCompressSync(new Uint8Array(fileBuffer));
			break;*/
		case "zstd":
			compressedData = await Bun.zstdCompress(data);
			break;
	}

	responseHeaders.set("Content-Encoding", COMPRESSION_HEADERS[format]);
	responseHeaders.set("Content-Length", String(compressedData.byteLength));
	responseHeaders.set("Vary", "Accept-Encoding");

	return new Response(compressedData, { headers: responseHeaders });
}
