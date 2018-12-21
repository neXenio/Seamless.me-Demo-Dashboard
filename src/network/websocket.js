import io from "socket.io-client";

import { addRecordings, addDevice } from "../js/actions";

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
    this.socket.on("addRecordings", data => {
      const json = JSON.parse(data).data;
      this.dispatch(
        addRecordings(
          (json.deviceInfo && json.deviceInfo.id) || "testId",
          json.recordings
        )
      );
    });
    this.socket.on("addDevice", data => {
      const json = JSON.parse(data);
      this.dispatch(addDevice(json.deviceInfo));
    });
  };
}
