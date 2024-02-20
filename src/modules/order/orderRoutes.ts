import express from "express";

import { OrderController } from "./orderController";
import {
  handleTotalPriceToPay,
  prepareDataToAddOrders,
  prepareDataToUpdate,
  validateExistOrderFromIdParams,
  validateOrderBody,
} from "./orderMiddlewares";
import { validateFields, validateObjectId, validateToken } from "../../shared/middlewares/general";

const router = express.Router();

const orderController = new OrderController();
const { createOrder, getAllOrdersByUserId, updateStatusOrderItems, updateOrderTable, addNewOrders, closeOrder } = orderController;

router.post("/create", validateToken, validateOrderBody, validateFields, handleTotalPriceToPay, createOrder);
router.post("/addNewOrders/:id", validateObjectId("id"), validateExistOrderFromIdParams, prepareDataToAddOrders, addNewOrders);
router.get("/getOrdersCreatedByUserId/:id", validateObjectId("id"), validateExistOrderFromIdParams, getAllOrdersByUserId);
router.put(
  "/updateStatusOrderItems/:id",
  validateObjectId("id"),
  validateExistOrderFromIdParams,
  prepareDataToUpdate,
  updateStatusOrderItems
);
router.put("/closeOrder/:id", validateObjectId("id"), validateExistOrderFromIdParams, closeOrder);
router.put("/updateOrderTable/:id", validateObjectId("id"), validateExistOrderFromIdParams, updateOrderTable);

export default router;
