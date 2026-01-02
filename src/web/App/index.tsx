import Container from "./Container";
import Nav from "./Nav";

import { useLanyard } from "../util/lanyard";

const App = () => {
  useLanyard();

  return (
    <>
      <Nav />
      <Container />
    </>
  );
};

export default App;
