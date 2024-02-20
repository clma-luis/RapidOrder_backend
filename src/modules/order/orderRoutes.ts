import express from "express";

import { OrderController } from "./orderController";
import { handleTotalPriceToPay, prepareDataToAddOrders, prepareDataToUpdate } from "./orderMiddlewares";

const router = express.Router();

const orderController = new OrderController();
const { createOrder, getAllOrdersByUserId, updateStatusOrderItems, updateOrderTable, addAdditionalOrders, closeOrder } = orderController;

router.post("/create", handleTotalPriceToPay, createOrder);
router.post("/addNewOrders/:id", prepareDataToAddOrders, addAdditionalOrders);
router.get("/getOrdersCreatedById/:id", getAllOrdersByUserId);
router.put("/updateStatusOrderItems/:id", prepareDataToUpdate, updateStatusOrderItems);
router.put("/closeOrder/:id", closeOrder);
router.put("/updateOrderTable/:id", updateOrderTable);

export default router;
