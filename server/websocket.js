const ROOM = "default_room";

const init = io => {
  io.on("connection", socket => {
    console.info("connected");
    socket.on("disconnect", () => console.log("Client disconnected"));

    socket.on("initDashboard", () => {
      console.log("initDashboard");
      socket.join(ROOM);
    });

    socket.on("initDevice", device => {
      console.log("init device", device);
      socket.to(ROOM).emit("addDevice", device);
    });

    socket.on("message", message => {
      console.log("received", Date.now(), message);

      const key = message.key;

      switch (key) {
        case "device_info":
          socket.to(ROOM).emit("addDevice", message);
          break;
        case "data_recording":
          socket.to(ROOM).emit("addRecordings", message);
          break;
        default:
          console.error("unknow message", message);
      }
    });
  });
};

module.exports = {
  init
};
