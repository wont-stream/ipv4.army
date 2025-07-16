import { determineAlgorithm } from "./util"

export const compress = async (
	data: Buffer | string | ArrayBuffer,
	header = "",
) => {
	const algorithm = determineAlgorithm(header);

	const contentEncoding = { "Content-Encoding": algorithm };

	switch (algorithm) {
		case "zstd":
			return {
				header: contentEncoding,
				body: await Bun.zstdCompress(data, { level: 22 }),
			};
		case "gzip":
			return {
				header: contentEncoding,
				body: await Bun.gzipSync(data, {
					level: 9,
					memLevel: 9,
					windowBits: 31,
				}),
			};
		default:
			return { header: {}, body: data };
	}
};
