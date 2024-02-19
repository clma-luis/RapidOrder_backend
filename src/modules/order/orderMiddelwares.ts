import { NextFunction, Request, Response } from "express";
import { NOTIFICATION } from "../../sockets/config";
import OrderModel, { OrderSchema, orderItemType } from "./orderModel";
import { BAD_REQUEST_STATUS } from "../../shared/constants/statusHTTP";
import mongoose from "mongoose";

export type UpdateItemsType = {
  [x: string]: any;
};

export const prepareDataToUpdate = (req: Request, res: Response, next: NextFunction) => {
  const { orderItems } = req.body;

  if (!orderItems) {
    return res.status(BAD_REQUEST_STATUS).json({ message: "orderItems not found" });
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

export const validateOrderToDeliver = async (result: OrderSchema, req: Request) => {
  const io = req.app.get("io");

  const totalReadyOrders = result.totalReadyOrders;

  const isEqualOne = totalReadyOrders === 1;

  !!totalReadyOrders &&
    io.to(result.createdBy).emit(NOTIFICATION, {
      message: `There ${isEqualOne ? "is" : "are"} ${totalReadyOrders} ${isEqualOne ? "order" : "orders"} of the table ${
        result.table
      } ready to be delivered`,
    });
};

export const prepareDataToAddOrders = (req: Request, res: Response, next: NextFunction) => {
  const { orderItems } = req.body;

  const currentOrderItems: Record<string, orderItemType[]> = orderItems;
  const keyOfObject = Object.keys(orderItems);

  const result = keyOfObject.reduce((acc, elem) => ({ ...acc, [`orderItems.${elem}`]: { $each: currentOrderItems[elem] } }), {});

  req.body.orderItemsAdapted = result;

  next();
};
