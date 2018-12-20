const MESSAGE_TYPES = ["test", "message"];

const init = io => {
  io.on("connection", socket => {
    console.info("connected");
    socket.on("disconnect", () => console.log("Client disconnected"));

    MESSAGE_TYPES.forEach(messageType => {
      socket.on(messageType, data => {
        console.log("received message", messageType, data);
        socket.emit(messageType, data);
      });
    });
  });
};

module.exports = {
  init
};
