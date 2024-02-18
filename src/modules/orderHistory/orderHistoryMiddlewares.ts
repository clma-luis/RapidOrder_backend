import { ClosedByType, OrderItemsType, StatusOrderType, orderItemType } from "../order/orderModel";
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
  const orderItemsAdapted = orderItemsAdapter(orderItems);
  const result = {
    action: "status menu item updated",
    userDetails: { id: createdBy, fullName: creatorFullName },
    date: updatedAt,
    dataDetails: { orderItems: orderItemsAdapted },
    message: `The user ${creatorFullName} has updated status to a menu Items order`,
  };

  return result;
};

export const orderItemsAdapter = (orderItems: OrderItemsType) => {
  const currentOrderItems: Record<string, orderItemType[]> = orderItems;
  const keyOfObject = Object.keys(orderItems);

  const result = keyOfObject.reduce(
    (acc, el) => ({
      ...acc,
      [el]: currentOrderItems[el].map((item) => {
        const { preparedBy, ...rest } = item;
        return { ...rest };
      }),
    }),
    {}
  );

  return result;
};

export const handleAdaptDatOrderStatus = (data: CreateOrderData, status: StatusOrderType, closedBy: ClosedByType) => {
  if (!data || !status || !closedBy) throw new Error("Data to update order status history is required");
  const { updatedAt, createdBy, creatorFullName } = data;
  const result = {
    action: "order status closed",
    userDetails: { id: createdBy, fullName: creatorFullName },
    date: updatedAt,
    dataDetails: { status, closedBy },
    message: `The user ${creatorFullName} has closed the order`,
  };

  return result;
};
