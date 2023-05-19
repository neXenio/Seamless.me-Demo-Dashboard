import { useEffect, useRef } from "react";

const DOOR_OPEN_DURATION = 5000;

// var leftCourtain = $("#door-left");
// var rightCourtain = $("#door-right");

function openDoor({leftCourtain, rightCourtain}) {
    console.log("Opening curtains");
    leftCourtain.style.transform =  "translateX(-100%)";
    rightCourtain.style.transform =  "translateX(100%)";
}

function closeDoor({leftCourtain, rightCourtain}) {
  console.log("Closing curtains");
  leftCourtain.style.transform = "translateX(0)";
  rightCourtain.style.transform = "translateX(0)";
}

function indicateAuthenticationSucceeded({rightCourtain}) {
    rightCourtain.style.backgroundImage = 'url("https://i.imgur.com/9LyamPG.png")';
}

function indicateAuthenticationFailed({ rightCourtain }) {
    rightCourtain.style.backgroundImage =  'url("https://i.imgur.com/18dlKcu.png")';
}

function indicateAuthenticationPending({ rightCourtain }) {
    rightCourtain.style.backgroundImage = 'url("https://i.imgur.com/JHCePyJ.png")';
}

function onAuthenticationRequested({leftCourtain, rightCourtain}) {
  console.log("Authentication requested");
  indicateAuthenticationPending({leftCourtain, rightCourtain});
  closeDoor({leftCourtain, rightCourtain});
}

function onAuthenticationSucceeded({leftCourtain, rightCourtain}) {
  console.log("Authentication succeeded");
  indicateAuthenticationSucceeded({leftCourtain, rightCourtain});
  window.setTimeout(() => openDoor({leftCourtain, rightCourtain}), 500);
  window.setTimeout(() => closeDoor({leftCourtain, rightCourtain}), 500 + DOOR_OPEN_DURATION);
  window.setTimeout(() => indicateAuthenticationPending({leftCourtain, rightCourtain}), 500 + DOOR_OPEN_DURATION);
}

function onAuthenticationFailed({leftCourtain, rightCourtain}) {
  console.log("Authentication failed");
  indicateAuthenticationFailed({leftCourtain, rightCourtain});
  window.setTimeout(() => indicateAuthenticationPending({leftCourtain, rightCourtain}), 2000);
}

function onAuthenticationError({leftCourtain, rightCourtain}) {
  console.log("Authentication error");
  indicateAuthenticationFailed({leftCourtain, rightCourtain});
  window.setTimeout(() => indicateAuthenticationPending({leftCourtain, rightCourtain}), 2000);
}


const Door = () => {
    
    const leftCourtainRef = useRef();
    const rightCourtainRef = useRef();
    
    useEffect(() => {
        if (leftCourtainRef && rightCourtainRef) {
            const props = { leftCourtain: leftCourtainRef.current, rightCourtain: rightCourtainRef.current };

            window.setTimeout(() => indicateAuthenticationSucceeded(props), 500);
            window.setTimeout(() => openDoor(props), 1000);
            // window.setTimeout(() => onAuthenticationFailed(props), 500);
            // window.setTimeout(() => onAuthenticationSucceeded(props), 500);
            // window.setInterval(() => onAuthenticationSucceeded(props), 10000);
        }

    }, [leftCourtainRef, rightCourtainRef])

    return (
        <>
            <div ref={leftCourtainRef} id="door-left" class="door"></div>
            <div ref={rightCourtainRef} id="door-right" class="door"></div>
        </>
    )
}

export default Door;
