import express, { NextFunction, Request, Response } from "express";

import { OrderController } from "./orderController";
import { handleTotalPriceToPay, prepareDataToAddOrders, prepareDataToUpdate } from "./orderMiddlewares";
import OrderModel from "./orderModel";

const router = express.Router();

const orderController = new OrderController();
const { createOrder, getAllOrdersByUserId, updateStatusOrderItems, updateOrderTable, addAdditionalOrders, closeOrder } = orderController;

router.post("/create", createOrder);
router.post("/addNewOrders/:id", prepareDataToAddOrders, addAdditionalOrders);
router.get("/getOrdersCreatedById/:id", getAllOrdersByUserId);
router.put("/updateStatusOrderItems/:id", prepareDataToUpdate, updateStatusOrderItems);
router.put("/closeOrder/:id", handleTotalPriceToPay, closeOrder);
router.put("/updateOrderTable/:id", updateOrderTable);

export default router;
