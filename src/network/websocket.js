import io from "socket.io-client";

export default class Websocket {
  constructor() {
    this.socket = io(`http://localhost:9999`, {
      reconnectionDelay: 1000,
      reconnectionDelayMax: 4000,
      timeout: 8000
    });

    this.setupSocket();
    this.sendTestMessage();
    // setInterval(this.sendTestMessage, 5000);
  }

  setupSocket = () => {
    this.socket.on("test", data => console.log("data received", data));
    this.socket.on("message", data => console.log("message received", data));
  };
  sendTestMessage = () => {
    this.socket.emit("test", { data: 123, test: "hallo" });
  };
}
