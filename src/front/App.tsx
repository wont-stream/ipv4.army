import Hyperate from "./components/Hyperate";
import Lanyard from "./components/Lanyard";

let latestLanyard: LanyardData | null = null;

window.addEventListener("lanyard-update", (e) => {
	latestLanyard = (e as CustomEvent<LanyardData>).detail;
});

export default () => {
	const container = document.createElement("div");
	container.className = "app terminal";

	const renderElement = (content: string | Node) => {
		const p = document.createElement("p");
		if (typeof content === "string") {
			p.textContent = content;
		} else {
			p.appendChild(content);
		}
		return p;
	};

	const prompt = "[seth@ipv4 ~]$";

	const staticLines: (string | (() => Node))[] = [
		`${prompt} cat ./about.txt`,
		() =>
			document
				.createRange()
				.createContextualFragment(
					"A Dedicated Backend Developer,<br />with a passion for high-fidelity audio,<br />gaming, and web development.",
				),
		`${prompt} cat /tmp/discord-ipc`,
		() => Lanyard(),
		`${prompt} cat /tmp/heartrate`,
		() => Hyperate(),
	];

	const renderStatic = () => {
		for (const line of staticLines) {
			const content = typeof line === "function" ? line() : line;
			container.appendChild(renderElement(content));
		}
	};

	renderStatic();

	const lanyardInstance = Lanyard();
	const files: Record<string, () => Node> = {
		"./about.txt": () =>
			document
				.createRange()
				.createContextualFragment(
					"A Dedicated Backend Developer,<br />with a passion for high-fidelity audio,<br />gaming, and web development.",
				),
		"/tmp/discord-ipc": () => lanyardInstance,
		"/tmp/heartrate": () => Hyperate(),
	};

	const history: string[] = [];
	let historyIndex = -1;

	const inputBox = document.createElement("input");
	inputBox.className = "terminal-input";
	inputBox.autofocus = true;

	const inputLine = document.createElement("div");
	inputLine.className = "terminal-line";

	const promptSpan = document.createElement("span");
	promptSpan.textContent = `${prompt} `;

	inputLine.appendChild(promptSpan);
	inputLine.appendChild(inputBox);
	container.appendChild(inputLine);

	const appendLine = (line: string | Node) => {
		container.insertBefore(renderElement(line), inputLine);
	};

	inputBox.addEventListener("keydown", (e) => {
		if (e.key === "Enter") {
			const cmd = inputBox.value.trim();
			if (!cmd) return;

			history.push(cmd);
			historyIndex = history.length;

			appendLine(`${prompt} ${cmd}`);

			let out: string | Node;

			if (cmd.startsWith("cat ")) {
				const file = cmd.slice(4).trim();
				out = files[file]?.() ?? `cat: ${file}: No such file`;
			} else if (cmd === "ls") {
				out = Object.keys(files)
					.filter((f) => f.startsWith("./"))
					.map((f) => f.slice(2))
					.join("\n");
			} else if (cmd.startsWith("ls ")) {
				const dir = cmd.slice(3).trim();
				if (dir === "/tmp") {
					out = Object.keys(files)
						.filter((f) => f.startsWith("/tmp/"))
						.map((f) => f.slice("/tmp/".length))
						.join("\n");
				} else {
					out = `ls: cannot access '${dir}': No such file or directory`;
				}
			} else if (cmd === "help") {
				out = [
					"Available commands:",
					"  cat [file]     View contents of a file",
					"  ls             List files in current directory",
					"  ls /tmp        List files in /tmp directory",
					"  help           Show this message",
				].join("\n");
			} else {
				out = `bash: ${cmd}: command not found`;
			}

			appendLine(out);
			inputBox.value = "";
		} else if (e.key === "ArrowUp") {
			if (historyIndex > 0) {
				historyIndex--;
				inputBox.value = history[historyIndex] || "";
			}
			e.preventDefault();
		} else if (e.key === "ArrowDown") {
			if (historyIndex < history.length - 1) {
				historyIndex++;
				inputBox.value = history[historyIndex] || "";
			} else {
				historyIndex = history.length;
				inputBox.value = "";
			}
			e.preventDefault();
		}
	});

	return container;
};
