import express from "express";

import { ADMIN_ROLE, WAITER_ROLE } from "../../shared/constants/roles";
import { validateFields, validateObjectId, validateRole, validateToken } from "../../shared/middlewares/general";
import { OrderController } from "./orderController";
import {
  handleTotalPriceToPay,
  prepareDataToAddOrders,
  prepareDataToUpdate,
  validateAddNewOrders,
  validateExistOrderFromIdParams,
  validateOrderBody,
  validateOrderItemToUpdate,
} from "./orderMiddlewares";

const router = express.Router();

const orderController = new OrderController();
const { createOrder, getAllOrdersByUserId, updateOneOrderItemById, updateStatusOrderItems, updateOrderTable, addNewOrders, closeOrder } =
  orderController;

router.post(
  "/create",
  validateToken,
  validateOrderBody,
  validateFields,
  validateRole([ADMIN_ROLE, WAITER_ROLE]),
  handleTotalPriceToPay,
  createOrder
);
router.post(
  "/addNewOrders/:id",
  validateObjectId("id"),
  validateToken,
  validateAddNewOrders,
  validateFields,
  validateRole([ADMIN_ROLE, WAITER_ROLE]),
  validateExistOrderFromIdParams,
  prepareDataToAddOrders,
  addNewOrders
);
router.get(
  "/getOrdersCreatedByUserId/:id",
  validateObjectId("id"),
  validateToken,
  validateRole([ADMIN_ROLE, WAITER_ROLE]),
  validateExistOrderFromIdParams,
  getAllOrdersByUserId
);

router.put(
  "/updateOneOrderItemById/:id",
  validateObjectId("id"),
  validateToken,
  validateRole([ADMIN_ROLE, WAITER_ROLE]),
  validateExistOrderFromIdParams,
  validateOrderItemToUpdate,
  updateOneOrderItemById
);

router.put(
  "/updateStatusOrderItems/:id",
  validateObjectId("id"),
  validateToken,
  validateRole([ADMIN_ROLE, WAITER_ROLE]),
  validateExistOrderFromIdParams,
  prepareDataToUpdate,
  updateStatusOrderItems
);
router.put(
  "/closeOrder/:id",
  validateObjectId("id"),
  validateToken,
  validateRole([ADMIN_ROLE, WAITER_ROLE]),
  validateExistOrderFromIdParams,
  closeOrder
);
router.put(
  "/updateOrderTable/:id",
  validateObjectId("id"),
  validateToken,
  validateRole([ADMIN_ROLE, WAITER_ROLE]),
  validateExistOrderFromIdParams,
  updateOrderTable
);

export default router;
