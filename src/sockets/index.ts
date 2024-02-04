import { Socket } from "socket.io";

export const socketConnection = (socket: Socket) => {
  socket.on("create-order", (payload, callback) => {
    console.log("Order created", payload);
    callback("123");
  });

  socket.on("new-order", (payload, callback) => {
    console.log("Order created", payload);
    socket.emit("new-order", payload);
  });

  socket.on("connect-waiter", (payload) => {
    console.log("Camarero connected", socket.id);
  });

  socket.on("disconnect", () => {});
};
