import express from "express";

import { OrderService } from "./orderService";
import { OrderController } from "./orderController";

const router = express.Router();

const orderService = new OrderService();
const orderController = new OrderController(orderService);
const { createOrder, getOrderStatus } = orderController;

router.post("/create", createOrder);
router.get("/status/:orderId", getOrderStatus);

export default router;
