import io from "socket.io-client";

import { addRecordings } from "../js/actions";

export default class Websocket {
  constructor(dispatch) {
    this.dispatch = dispatch;
    this.socket = io(`http://localhost:9999`, {
      reconnectionDelay: 1000,
      reconnectionDelayMax: 4000,
      timeout: 8000
    });

    this.setupSocket();
  }

  setupSocket = () => {
    this.socket.emit("initDashboard");
    this.socket.on("message", data => {
      const json = JSON.parse(data);
      console.log("message received", Object.keys(json));
      this.dispatch(
        addRecordings(json.deviceInfo.id || "testId", json.recordings)
      );
    });
  };
}
