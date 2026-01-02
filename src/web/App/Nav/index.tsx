import "./index.css";

import { lanyard } from "src/web/util/lanyard";

const Nav = () => {
  return (
    <nav>
      <div class="left">S€TH</div>
      <div class="center">ipv4.army</div>

      <div class="right">{lanyard.value.discord_status}</div>
    </nav>
  );
};

export default Nav;
