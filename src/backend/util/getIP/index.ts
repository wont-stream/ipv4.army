import { parseCIDR, parse, IP } from "ipaddr.js";

// Load these once at startup (your existing code is fine here)
const ipv4Req = await fetch("https://www.cloudflare.com/ips-v4");
const ipv4Ranges = (await ipv4Req.text())
	.split("\n")
	.filter(Boolean)
	.map((cidr) => parseCIDR(cidr));

const ipv6Req = await fetch("https://www.cloudflare.com/ips-v6");
const ipv6Ranges = (await ipv6Req.text())
	.split("\n")
	.filter(Boolean)
	.map((cidr) => parseCIDR(cidr));

function isCloudflareIP(ip: IP): boolean {
	const ranges = ip.kind() === "ipv4" ? ipv4Ranges : ipv6Ranges;
	return ranges.some(([rangeIp, range]) => ip.match([rangeIp, range]));
}

export const getIP = (req: Bun.BunRequest): string | null => {
	const ipHeaders = [
		req.headers.get("x-forwarded-for"),
		req.headers.get("x-real-ip"),
		req.headers.get("cf-connecting-ip"),
	].filter(Boolean);

	const ipCandidates = new Set<string>();

	for (const header of ipHeaders) {
		const parts =
			header ||
			""
				.split(",")
				.map((ip) => ip.trim())
				.filter(Boolean);
		for (const part of parts) {
			ipCandidates.add(part);
		}
	}

	for (const ipStr of ipCandidates) {
		try {
			const ip = parse(ipStr);
			if (!isCloudflareIP(ip)) {
				return ipStr;
			}
		} catch {
			// ignore invalid IPs
		}
	}

	// Fall back: if all are Cloudflare or invalid, return null or the first valid one
	return null;
};
