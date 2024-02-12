import { NextFunction, Request, Response } from "express";
import { NOTIFICATION } from "../../sockets/config";
import { OrderSchema, orderItemType } from "./orderModel";

export type UpdateItemsType = {
  [x: string]: any;
};

export const prepareDataToUpdate = (req: Request, res: Response, next: NextFunction) => {
  const { orderItems } = req.body;

  if (!orderItems) {
    return res.status(400).json({ message: "orderItems not found" });
  }

  const orders: Record<string, orderItemType[]> = orderItems;

  const updateItems = (category: string) => {
    return orders[category].map((item: any, index: any) => ({
      [`orderItems.${category}.${index}.status`]: item.status,
      [`orderItems.${category}.${index}.preparedBy`]: item.preparedBy,
    }));
  };

  const result = Object.keys(orderItems).flatMap((category) => updateItems(category));

  req.body.orderItemsAdapted = result;

  next();
};

export const validateOrderToDeliver = (result: OrderSchema, req: Request) => {
  const io = req.app.get("io");

  const currentOrderItems: Record<string, orderItemType[]> = result.orderItems;
  const keyOfObject = Object.keys((result.orderItems as any).toObject());
  const filteredOrderItemss = keyOfObject.reduce(
    (acc, el) => ({ ...acc, [el]: currentOrderItems[el].filter((item) => item.status === "listo") }),
    {}
  ) as Record<string, orderItemType[]>;

  const amountReadyItems = keyOfObject.reduce((acc, el) => acc + filteredOrderItemss[el].length, 0);

  const isEqualOne = amountReadyItems === 1;

  !!amountReadyItems &&
    io.to(result.waiterId).emit(NOTIFICATION, {
      message: `There ${isEqualOne ? "is" : "are"} ${amountReadyItems} ${isEqualOne ? "order" : "orders"} of the table ${
        result.table
      } ready to be delivered`,
    });
};
