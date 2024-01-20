import express from "express";
import OrderController from "./orderController";

const router = express.Router();
const orderController = new OrderController();

router.post("/create", orderController.createOrder);
router.get("/status/:orderId", orderController.getOrderStatus);

export default router;
