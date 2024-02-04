import express from "express";

import { OrderController } from "./orderController";

const router = express.Router();

const orderController = new OrderController();
const { createOrder, getOrderStatus, updateOrder, getAllOrdersByUserId, updateOrderStatus } = orderController;

router.post("/create", createOrder);
router.get("/getOrdersByUserId/:id", getAllOrdersByUserId);
router.put("/updateStatus/:id", updateOrderStatus);
router.put("/updateOrder/:id", updateOrder);
router.get("/status/:id", getOrderStatus);

export default router;
