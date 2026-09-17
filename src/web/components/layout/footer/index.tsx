import { site } from "@/web/data/site";
import "./index.css";

export const Footer = () => {
	return (
		<footer className="footer">
			<div className="copyright">
				<p style={{ color: "var(--on-surface-variant)", margin: 0 }}>
					© {new Date().getFullYear()} {site.name}
				</p>
				<a href={site.githubRepoUrl} target="_blank" rel="noreferrer">
					Source
				</a>
			</div>
		</footer>
	);
};
