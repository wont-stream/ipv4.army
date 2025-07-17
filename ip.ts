import * as mmdb from "mmdb-lib";

const dbReq = await fetch(
	"https://cdn.jsdelivr.net/npm/@ip-location-db/geo-whois-asn-country-mmdb/geo-whois-asn-country.mmdb",
);
const db = await dbReq.arrayBuffer();

const reader = new mmdb.Reader(Buffer.from(db));

console.log(reader.get("172.70.86.161"));
