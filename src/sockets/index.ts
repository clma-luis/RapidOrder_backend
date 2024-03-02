import { Socket } from "socket.io";
import { JOIN_ROOM, NEW_ORDER, handleRoomToJoin } from "./config";

export const socketConnection = (socket: Socket) => {
  socket.on(JOIN_ROOM, (room) => {
    console.log({ room });
    const { userId, role } = room;
    if (!userId || !role) return;

    const joinToRoom = handleRoomToJoin(role, userId);
    console.log("first", joinToRoom);
    if (!joinToRoom) return;

    socket.join(joinToRoom);
  });

  socket.on(NEW_ORDER, (payload, callback) => {
    socket.emit(NEW_ORDER, payload);
  });

  socket.on("disconnect", () => {
    console.log("connected", socket.id);
  });
};
