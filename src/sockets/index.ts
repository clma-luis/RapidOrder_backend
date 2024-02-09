import { Socket } from "socket.io";

export const socketEvents = {
  NEW_ORDER: "new-order",
  JOIN_ROOM: "join-room",
  NOTIFICATION: "notification",
};

const { NEW_ORDER, JOIN_ROOM, NOTIFICATION } = socketEvents;

export const socketConnection = (socket: Socket) => {
  socket.on(JOIN_ROOM, (room) => {
    const { userId, kitchenId } = room;
    !!kitchenId && socket.join(kitchenId);
    !!userId && socket.join(userId);
  });

  socket.on("sendNotification", (room, message) => {
    socket.to(room).emit(NOTIFICATION, message);
  });

  socket.on(NEW_ORDER, (payload, callback) => {
    console.log("Order created", payload);
    socket.emit(NEW_ORDER, payload);
  });

  socket.on("connect-waiter", (payload) => {
    console.log("Camarero connected", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("connected", socket.id);
  });
};
