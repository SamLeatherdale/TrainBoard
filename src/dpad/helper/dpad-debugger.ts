import { DebugController, DpadController } from "../lib";

declare global {
    interface Window {
        dpad: DpadController;
        dpaddebug: DebugController;
    }
}

window.addEventListener("load", () => {
    window.dpaddebug = window.dpaddebug || new DebugController(window.dpad);
});

window.addEventListener("resize", () => {
    if (!window.dpaddebug) {
        return;
    }
    window.dpaddebug.updateDisplay();
});
