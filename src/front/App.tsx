import Lanyard from './components/Lanyard';
import Hyperate from './components/Hyperate';

export default () => {
    return <div class="app">
        <p>seth&gt; cat ./about.txt</p>
        <p>A Dedicated Backend Developer,<br />with a passion for high-fidelity audio,<br />gaming, and web development.</p>

        <p>seth&gt; curl /tmp/discord-ipc</p>
        <p><Lanyard /></p>

        <p>seth&gt; cat /tmp/heartrate</p>
        <p><Hyperate /></p>
    </div>
}