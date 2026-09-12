import type { ReactNode } from "react";
import "./index.css";

type Props = {
	className?: string;
	children: ReactNode;
};

export const Card = ({ className, children }: Props) => {
	return <article className={className}>{children}</article>;
};
