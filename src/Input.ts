
export const input = {
    thrust: false,
    reverse: false,
    shoot: false,
    escape: false,
    barrage: false
};

function onKeyDown(e: KeyboardEvent): void {
    switch (e.code) {
        case "KeyW": input.thrust = true; break;
        case "KeyS": input.reverse = true; break;
        case "Escape": input.escape = true; break;
        default: break;
    }
}

function onKeyUp(e: KeyboardEvent): void {
    switch (e.code) {
        case "KeyW": input.thrust = false; break;
        case "KeyS": input.reverse = false; break;
        case "Space": input.shoot = true; break;
        case "KeyQ": input.barrage = true; break;
        default: break;
    }
}

export function enableInput(): void {
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
}

export function disableInput(): void {
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("keyup", onKeyUp);

    // reset the control state so no key is stuck when re-enabling
    input.thrust = false;
    input.reverse = false;
    input.shoot = false;
    input.escape = false;
    input.barrage= false;
}
