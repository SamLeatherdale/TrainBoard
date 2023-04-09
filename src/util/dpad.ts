import { DebugController, DpadController } from "../dpad/lib";

import { isDev } from "./env";

let dpad: DpadController;
let dpadDebug: DebugController;
export function initDpad() {
    if (dpad) {
        return;
    }
    // Create a new dpad controller
    dpad = new DpadController();
    // Call update to get the focusable items in the DOM
    dpad.update();
    // Disable the dpad's keyboard events so we can use native
    dpad.disable();
    //
    // // We handle it ourselves
    // document.addEventListener("keyup", (e) => {
    //     if (e.keyCode >= 37 && e.keyCode <= 40) {
    //         const currentFocus = dpad
    //             .getFocusableItems()
    //             .findIndex((el) => el.getElement() === document.activeElement);
    //         console.log("Focused ", currentFocus);
    //         if (currentFocus >= 0) {
    //             dpad.setCurrentFocusItem(currentFocus);
    //         }
    //     }
    // });

    // To enable debugging, create debug controller
    dpadDebug = new DebugController(dpad);
    if (isDev() && false) {
        // Turn on debugging
        console.log("Enabled debugging");
        dpadDebug.setDebugMode(true);
    }

    function update() {
        dpad.update();
        dpadDebug.updateDisplay();
    }

    setInterval(update, 500);
}
export function getDpad() {
    return dpad;
}
