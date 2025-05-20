import type { Snackbar } from "mdui";
import { snackbar } from "mdui";

interface Options {
	/**
	 * The text to display in the snackbar.
	 */
	message: string;
	/**
	 * The position of the snackbar. Defaults to `bottom`. Possible values are:
	 * * `top`: Aligned to the top, centered
	 * * `top-start`: Aligned to the top, left
	 * * `top-end`: Aligned to the top, right
	 * * `bottom`: Aligned to the bottom, centered
	 * * `bottom-start`: Aligned to the bottom, left
	 * * `bottom-end`: Aligned to the bottom, right
	 */
	placement?:
	| "top"
	| "top-start"
	| "top-end"
	| "bottom"
	| "bottom-start"
	| "bottom-end";
	/**
	 * The text for the action button.
	 */
	action?: string;
	/**
	 * Whether to show a close button on the right.
	 */
	closeable?: boolean;
	/**
	 * The maximum number of lines to display for the message text. Defaults to no limit. Possible values are:
	 * * `1`: The message text will be displayed on one line at most.
	 * * `2`: The message text will be displayed on two lines at most.
	 */
	messageLine?: 1 | 2;
	/**
	 * The duration (in milliseconds) after which the snackbar will automatically close. If set to 0, it will not close automatically. Defaults to 5 seconds.
	 */
	autoCloseDelay?: number;
	/**
	 * Whether to close the snackbar when clicking or touching outside of it.
	 */
	closeOnOutsideClick?: boolean;
	/**
	 * The name of the queue.
	 * By default, queues are not enabled. When calling this function multiple times, multiple snackbars will be displayed simultaneously.
	 * You can pass a queue name as an argument. Snackbar functions with the same queue name will only open after the previous snackbar has closed.
	 */
	queue?: string;
	/**
	 * The callback function to be executed when the snackbar is clicked.
	 * The function parameter is the snackbar instance, and `this` also points to the snackbar instance.
	 * @param snackbar
	 */
	onClick?: (snackbar: Snackbar) => void;
	/**
	 * The callback function to be executed when the action button is clicked.
	 * The function parameter is the snackbar instance, and `this` also points to the snackbar instance.
	 * By default, clicking the action button will close the snackbar. If the return value is false, the snackbar will not close. If the return value is a promise, the snackbar will close after the promise is resolved.
	 * @param snackbar
	 */
	onActionClick?: (snackbar: Snackbar) => void | boolean | Promise<void>;
	/**
	 * The callback function to be executed when the snackbar is opened.
	 * The function parameter is the snackbar instance, and `this` also points to the snackbar instance.
	 * @param snackbar
	 */
	onOpen?: (snackbar: Snackbar) => void;
	/**
	 * The callback function to be executed when the snackbar's show animation is complete.
	 * The function parameter is the snackbar instance, and `this` also points to the snackbar instance.
	 * @param snackbar
	 */
	onOpened?: (snackbar: Snackbar) => void;
	/**
	 * The callback function to be executed when the snackbar is about to be closed.
	 * The function parameter is the snackbar instance, and `this` also points to the snackbar instance.
	 * @param snackbar
	 */
	onClose?: (snackbar: Snackbar) => void;
	/**
	 * The callback function to be executed when the snackbar's hide animation is complete.
	 * The function parameter is the snackbar instance, and `this` also points to the snackbar instance.
	 * @param snackbar
	 */
	onClosed?: (snackbar: Snackbar) => void;
}

export const snacker = (opts: Options) => {
	snackbar({
		closeable: true,
		messageLine: 2,
		queue: "snacker",
		autoCloseDelay: 1600,
		onOpen: () => {
			new Audio("https://no.ipv4.army/raw/Popcorn.ogg").play();
		},

		...opts,
	});
};
