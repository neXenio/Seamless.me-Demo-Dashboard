import { createContext } from "react";
// import { io } from "socket.io-client";

const BAUTH_DEMO_SERVER = "https://bauth-demo-server--steppschuh.repl.co/";
const MESSAGE_INITIALIZE_DEVICE = "initialize_device";
const MESSAGE_INITIALIZE_DASHBOARD = "initialize_dashboard";
const MESSAGE_DATA_RECORDING = "data_recording";

export const IoContext = createContext();
// const socket = io(BAUTH_DEMO_SERVER);

// eslint-disable-next-line no-undef
const socket = io(BAUTH_DEMO_SERVER);
export const IoProvider = ({ children }) => {
  // setupSocket();
  return <IoContext.Provider value={{ socket }}>{children}</IoContext.Provider>;
};

export async function setupSocket() {
  socket.on("connect", function () {
    // console.log("Connected to the Demo Server");
    //   M.toast({
    //     html: 'Connected to the Demo Server'
    //   });
    socket.send({
      key: MESSAGE_INITIALIZE_DASHBOARD,
      data: {
        name: "JSFiddle",
      },
    });
  });

  // console.log(socket);

  socket.on("message", function (message) {
    try {
      if (typeof message === "string") {
        message = JSON.parse(message);
      }

      var key = message.key;
      var data = message.data;

      switch (key) {
        case MESSAGE_INITIALIZE_DEVICE:
          // console.log(data);
          // processDeviceInitialization(data);
          break;
        case MESSAGE_DATA_RECORDING:
          // processDataRecordingContainer(data);
          break;
        default:
          console.log("Unknown message key: " + key);
          break;
      }
    } catch (error) {
      // console.log("Unable to handle message:\n" + JSON.stringify(message));
      console.error(error);
    }
  });
}
