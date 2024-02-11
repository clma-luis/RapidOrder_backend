import { CHEF_ROLE, WAITER_ROLE } from "../shared/constants/roles";

export const socketEvents = {
  NEW_ORDER: "newOrder",
  JOIN_ROOM: "joinRoom",
  NOTIFICATION: "notification",
};

export const listOfRooms = {
  KITCHEN_ROOM: "kitchenRoom",
  WAITER_ROOM: "waiterRoom:id",
};

export const { KITCHEN_ROOM, WAITER_ROOM } = listOfRooms;

export const { NEW_ORDER, JOIN_ROOM, NOTIFICATION } = socketEvents;

export const handleRoomToJoin = (role: string, userId: string) => {
  console.log("pasa por aqui");
  const joinToRoom: Record<string, string> = {
    [CHEF_ROLE]: KITCHEN_ROOM,
    [WAITER_ROLE]: WAITER_ROOM.replace("id", userId),
  };

  if (!joinToRoom[role]) return "";

  return joinToRoom[role];
};
