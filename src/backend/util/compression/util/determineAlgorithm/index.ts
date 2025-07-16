export const determineAlgorithm = (acceptEncodingHeader = ""): string => {
	const encodings = acceptEncodingHeader
		.split(",")
		.map((encoding) => encoding.trim());

	if (encodings.includes("zstd")) {
		return "zstd";
	}

	if (encodings.includes("gzip")) {
		return "gzip";
	}

	return "none"; // Default to no compression
};