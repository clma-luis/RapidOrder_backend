import { OrderItemsType } from "../order/orderModel";
import { CreateOrderData } from "./orderHistoryController";
import { OrderHistorySchema } from "./orderHistoryModel";

export const handleAdaptDataToCreateOrderHistory = (data: CreateOrderData, dataDetails: any) => {
  if (!data || !dataDetails) throw new Error("Data to create order history is required");
  const { id, createdAt, createdBy, creatorFullName } = data;

  const result = {
    orderId: id,
    history: [
      {
        action: "order created",
        userDetails: { id: createdBy, fullName: creatorFullName },
        date: createdAt,
        dataDetails,
        message: `The user ${creatorFullName} has created new order`,
      },
    ],
  } as OrderHistorySchema;

  return result;
};

export const handleAdapDataToAddNewStatusHistory = (data: CreateOrderData, orderItems: OrderItemsType) => {
  if (!data || !orderItems) throw new Error("Data to create order history is required");
  const { updatedAt, createdBy, creatorFullName } = data;
  const result = {
    action: "status menu item updated",
    userDetails: { id: createdBy, fullName: creatorFullName },
    date: updatedAt,
    dataDetails: orderItems,
    message: `The user ${creatorFullName} has updated status to a menu Items order`,
  };

  return result;
};
