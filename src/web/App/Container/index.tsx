import "./index.css";

import Activities from "./DiscordActivities";
import Greeting from "./Greeting";
import Citation from "./Citation";

const Container = () => {
  return (
    <main class="container">
      <p>
        <Greeting /> <b>Seth</b>.
        <Citation />
      </p>
      <ul>
        <li>I'm an avid backend developer</li>
        <li>And a casual frontender</li>
      </ul>
      <p>I've dumped a decent amount of money into different things such as</p>
      <ul>
        <li>Virtual Reality</li>
        <li>Audio Gear</li>
        <li>Smart Home Equipment</li>
      </ul>
      <Activities />
    </main>
  );
};

export default Container;
