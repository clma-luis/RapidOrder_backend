import { Socket } from "socket.io";

export const socketConnection = (socket: Socket) => {
  //console.log("connected", socket.id);

  socket.on("create-order", (payload, callback) => {
    console.log("Order created", payload);
    callback("123");
  });

  socket.on("join-room", (room) => {
    const { userId } = room;
    console.log("rjoom");
    socket.join(userId);

    /*     socket.on("mensajeSala", (mensaje) => {
      console.log(`Mensaje en la sala: ${mensaje}`);
      // Puedes emitir el mensaje de vuelta a la sala o hacer cualquier otra lógica aquí
      socket.to("miSala").emit("mensajeSala", `Alguien dijo: ${mensaje}`);
    }); */

    //socket.to(`room-${userId}`).emit("private-message", `room-${userId}`);
    //console.log(`Cliente ${userId} se unió a la sala room-${userId}`);
  });

  socket.on("sendNotification", (room, message) => {
    socket.to(room).emit("notification", message);
  });

  socket.on("new-order", (payload, callback) => {
    console.log("Order created", payload);
    socket.emit("new-order", payload);
  });

  socket.on("connect-waiter", (payload) => {
    console.log("Camarero connected", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("connected", socket.id);
  });
};
