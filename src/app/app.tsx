import "./index.css";
import { Footer } from "../components/layout/footer";
import { Sidebar } from "../components/layout/sidebar";
import { About } from "../components/sections/about";
import { Friends } from "../components/sections/friends";
import { Tools } from "../components/sections/tools";

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
