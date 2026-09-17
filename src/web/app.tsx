import "./index.css";
import { Footer } from "@/web/components/layout/footer";
import { Sidebar } from "@/web/components/layout/sidebar";
import { About } from "@/web/components/sections/about";
import { Friends } from "@/web/components/sections/friends";
import { Tools } from "@/web/components/sections/tools";

export const App = () => {
	return (
		<main className="site">
			<div className="grid large-space">
				<div className="s12 m4 l3">
					<Sidebar />
				</div>
				<div className="s12 m8 l9 content">
					<About />
					<Tools />
					<Friends />
				</div>
			</div>
			<Footer />
		</main>
	);
};

export default App;
