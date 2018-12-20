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
    });

    socket.on("message", data => {
      console.log("received", Date.now(), data);

      socket.to(ROOM).emit("message", data);
    });
  });
};

module.exports = {
  init
};
