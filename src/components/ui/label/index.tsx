import type { ReactNode } from "react";
import "./index.css";

type Props = {
	children: ReactNode;
};

export const Label = ({ children }: Props) => {
	return <p className="label">{children}</p>;
};
