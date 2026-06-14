import { spawn } from "bun";

const platforms = {
	aix: null,
	android: null,
	darwin: "darwin",
	freebsd: null,
	haiku: null,
	linux: "linux",
	openbsd: null,
	sunos: null,
	win32: "windows",
	cygwin: null,
	netbsd: null,
};

const arches = {
	arm: null,
	arm64: "arm64",
	ia32: null,
	loong64: null,
	mips: null,
	mipsel: null,
	ppc64: null,
	riscv64: null,
	s390x: null,
	x64: "amd64",
};

const ext = process.platform === "win32" ? ".exe" : "";
const path = `./gitmal${ext}`;

const gitmal = await fetch(
	`https://github.com/antonmedv/gitmal/releases/latest/download/gitmal_${platforms[process.platform]}_${arches[process.arch]}${ext}`,
);

if (gitmal.status !== 200) throw new Error(await gitmal.text());

await Bun.write(path, gitmal);
try {
	await Bun.$`chmod +x ${path}`;
} catch (_e) {
	/*ignore*/
}
const proc = spawn([
	path,
	"--minify",
	"--output=./src/web/public/dist",
	"--name=Website",
	"--owner=S€TH",
	"--theme=xcode-dark",
	"./src/web/content",
]);

await proc.exited;
