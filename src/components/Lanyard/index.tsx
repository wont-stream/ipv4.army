import { createRef } from "tsx-dom";
import microlight from "microlight";

import socket from "../../Socket";

const statusTypes: { [key: string]: string } = {
    online: "green",
    idle: "yellow",
    dnd: "red",
    invisible: "inherent",
    offline: "inherent",
}

const activityTypes: { [key: number]: string } = {
    0: "Playing",
    1: "Streaming",
    2: "Listening to",
    3: "Watching",
    4: "Custom",
    5: "Competing in",
}

export default () => {
    const paragraph = createRef<HTMLParagraphElement>();

    socket.addEventListener('lanyard', (event: Event) => {
        const lanyard = (event as CustomEvent).detail;
        if (paragraph.current) {
            paragraph.current.style = `--status-color: ${statusTypes[lanyard.discord_status]};`;
            paragraph.current.innerText = JSON.stringify({
                status: lanyard.discord_status,
                activities: lanyard.activities.map((act: { type: number, name: string }) => { return `${activityTypes[act.type]} ${act.name}` }),
            }, null, 1);
        }
        microlight.reset();
    });
    return <div>
        <p class="microlight" ref={paragraph}>{JSON.stringify({})}</p>
    </div>;
}