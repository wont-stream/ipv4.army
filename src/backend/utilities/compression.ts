const determineAlgorithm = (acceptEncodingHeader = ""): string => {
    const encodings = acceptEncodingHeader.split(',').map(encoding => encoding.trim());

    if (encodings.includes('zstd')) {
        return 'zstd';
    }

    if (encodings.includes('gzip')) {
        return 'gzip';
    }

    return 'none'; // Default to no compression
};

export const compress = async (data: Buffer | string | ArrayBuffer, header = "") => {
    const algorithm = determineAlgorithm(header);

    const contentEncoding = { "Content-Encoding": algorithm };

    switch (algorithm) {
        case 'zstd':
            return { header: contentEncoding, body: await Bun.zstdCompress(data, { level: 23 }) };
        case 'gzip':
            return { header: contentEncoding, body: await Bun.gzipSync(data, { level: 9, memLevel: 9, windowBits: 31 }) };
        default:
            return { header: {}, body: data };
    }
}