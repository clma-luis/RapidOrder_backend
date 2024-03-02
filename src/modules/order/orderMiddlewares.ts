import { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { isValidObjectId } from "mongoose";
import { BAD_REQUEST_STATUS, NOT_FOUND } from "../../shared/constants/statusHTTP";
import { NOTIFICATION } from "../../sockets/config";
import { OrderItemsType, OrderSchema, StatusOrder, StatusOrderItem, orderItemType } from "./orderModel";
import { orderService } from "./orderService";

const { getOneOrderItemService } = orderService;

export const translateTypeOrderItem: Record<string, string> = {
  entrada: "starters",
  principal: "mainCourses",
  bebida: "drinks",
  postre: "desserts",
};

export const validateOrderBody = [
  body("createdBy", "Field createdBy is required and string").notEmpty().isString(),
  body("creatorFullName", "Field creatorFullName is required and string").notEmpty().isString(),
  body("table", "Field table is required and string").notEmpty().isString(),
  body("orderItems", "Field orderItems is required and array").custom((value) => validateOrderItems(value)),
];

export const validateAddNewOrders = [
  body("orderItems", "Field orderItems is required and array").custom((value, { req }) => validateOrderItems(value, req as Request)),
];

export const validateOrderItems = (value: OrderItemsType, req?: Request) => {
  const ordersItemsAdapter = adaptOrderItemsToUniqueArray(value);
  if (req) req.body.ordersItemsArray = ordersItemsAdapter;

  if (ordersItemsAdapter.length === 0) throw new Error("At least one order item is required.");

  let error = "";

  for (let i = 0; i < ordersItemsAdapter.length; i++) {
    const item = ordersItemsAdapter[i];

    if (!item.hasOwnProperty("details") || !item.hasOwnProperty("quantity") || !item.hasOwnProperty("serviceType")) {
      error = "details, quantity and serviceType are required in orderItems.";
      break;
    }
  }

  if (!!error) throw new Error(error);

  return true;
};

export const validateExistOrderFromIdParams = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const order = await getOneOrderItemService(id);

  if (!order) return res.status(NOT_FOUND).json({ message: "the order does not exist" });
  else if (order.status === StatusOrder.CLOSED) return res.status(NOT_FOUND).json({ message: "the order is already closed" });

  req.body.order = order;

  next();
};

export const validateOrderItemToUpdate = async (req: Request, res: Response, next: NextFunction) => {
  const { orderItem, order } = req.body;

  if (!orderItem) return res.status(BAD_REQUEST_STATUS).json({ message: "orderItem is required" });

  if (Array.isArray(orderItem)) return res.status(BAD_REQUEST_STATUS).json({ message: "orderItem must be an object" });

  if (!isValidObjectId(orderItem.id)) return res.status(BAD_REQUEST_STATUS).json({ message: "Invalid id from orderItem" });

  const ordersItemsAdapter = adaptOrderItemsToUniqueArray((order.orderItems as any).toObject());

  const itemFounded = ordersItemsAdapter.find((item: any) => item._id.toString() === orderItem.id) as orderItemType;

  if (!itemFounded) {
    return res.status(NOT_FOUND).json({ message: "orderItem not found" });
  }

  validateOrderItemFieldsToUpdate(res, itemFounded, orderItem);
  const { id, quantity, observation, serviceType, type } = orderItem;

  req.body.newOrderItem = { id, quantity, observation, serviceType, type: translateTypeOrderItem[type] };

  next();
};

const validateOrderItemFieldsToUpdate = (res: Response, item: orderItemType, dataToUpdate: orderItemType) => {
  const orderDeliverd = item.status === StatusOrderItem.DELIVERED;
  const orderPending = item.status === StatusOrderItem.PENDING;

  if (orderDeliverd) {
    return res.status(BAD_REQUEST_STATUS).json({ error: "orderItem is already delivered" });
  }

  if (item.quantity !== dataToUpdate.quantity && !orderPending) {
    return res.status(BAD_REQUEST_STATUS).json({ error: "orderItem quantity cannot be changed after being prepared" });
  }
};

//========================================================
//========================================================
//========================================================

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

export const handleTotalPriceToPay = async (req: Request, res: Response, next: NextFunction) => {
  const { orderItems } = req.body;

  const result = handleOrderSumPrices(orderItems);

  req.body.totalPrice = result;

  next();
};

export const handleOrderSumPrices = (orderItems: OrderItemsType) => {
  const handlePriceMenuItem = (price: number, quantity: number) => {
    if (!price || !quantity) return 0;

    return price * quantity;
  };

  return adaptOrderItemsToUniqueArray(orderItems).reduce((acc, el) => acc + handlePriceMenuItem(el.details.price, el.quantity), 0);
};

const adaptOrderItemsToUniqueArray = (orderItems: OrderItemsType) => {
  if (!orderItems) return [];
  const currentOrderItems: Record<string, orderItemType[]> = orderItems;

  const keyOfObject = Object.keys(orderItems);

  const result = keyOfObject.reduce((acc: orderItemType[], el) => {
    const currentItem = !!currentOrderItems[el].length ? currentOrderItems[el] : [];

    return [...acc, ...currentItem];
  }, []);

  return result;
};
