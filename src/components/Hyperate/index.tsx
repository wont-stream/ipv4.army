import { createRef } from "tsx-dom";
import microlight from "microlight";

import socket from "../../Socket";

export default () => {
    const paragraph = createRef<HTMLParagraphElement>();

    socket.addEventListener('hyperate', (event: Event) => {
        const heartRate = (event as CustomEvent).detail;
        if (paragraph.current) {
            paragraph.current.innerText = `${heartRate} BPM`;
        }
        microlight.reset();
    });
    return <div>
        <p class="microlight" ref={paragraph}>0 BPM</p>
    </div>;
}