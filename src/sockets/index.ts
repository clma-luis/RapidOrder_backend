import { Socket } from "socket.io";
import { JOIN_ROOM, NEW_ORDER, handleRoomToJoin } from "./config";

export const socketConnection = (socket: Socket) => {
  socket.on(JOIN_ROOM, (room) => {
    const { userId, role } = room;
    if (!userId || !role) return;

    const joinToRoom = handleRoomToJoin(role, userId);
    if (!joinToRoom) return;

    socket.join(joinToRoom);
  });

  socket.on(NEW_ORDER, (payload) => {
    socket.emit(NEW_ORDER, payload);
  });

  socket.on("disconnect", () => {
    // eslint-disable-next-line no-console
    console.log("connected", socket.id);
  });
};
