import "mdui/components/layout";
import "mdui/components/layout-main";

import NavigationBar from "./components/NavigationBar";
import About from "./components/pages/About";
import TopAppBar from "./components/TopAppBar";

export default () => {
	return (
		<mdui-layout full-height>
			<TopAppBar />
			<mdui-layout-main>
				<About />
			</mdui-layout-main>
			<NavigationBar />
		</mdui-layout>
	);
};
