import { useEffect, useState } from "preact/hooks";

const greetings = ["Hello, I'm ", "Привет, я ", "Hallo, ich bin "];
const TYPING_SPEED = 150;
const DELETING_SPEED = 80;
const PAUSE_AFTER_TYPING = 1500;

export const Greeting = () => {
	const [text, setText] = useState("");
	const [index, setIndex] = useState(0);
	const [isDeleting, setIsDeleting] = useState(false);

	useEffect(() => {
		let timeout: number;

		const currentGreeting = greetings[index] || "";

		if (!isDeleting && text.length < currentGreeting.length) {
			timeout = window.setTimeout(() => {
				setText(currentGreeting.slice(0, text.length + 1));
			}, TYPING_SPEED);
		} else if (isDeleting && text.length > 0) {
			timeout = window.setTimeout(() => {
				setText(currentGreeting.slice(0, text.length - 1));
			}, DELETING_SPEED);
		} else if (!isDeleting && text.length === currentGreeting.length) {
			timeout = window.setTimeout(
				() => setIsDeleting(true),
				PAUSE_AFTER_TYPING,
			);
		} else if (isDeleting && text.length === 0) {
			setIsDeleting(false);
			setIndex((prev) => (prev + 1) % greetings.length);
		}

		return () => clearTimeout(timeout);
	}, [text, isDeleting, index]);

	return (
		<span>
			{text} <b>Seth</b>.
		</span>
	);
};
