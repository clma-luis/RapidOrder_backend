import express from "express";

import { OrderController } from "./orderController";

const router = express.Router();

const orderController = new OrderController();
const { createOrder, updateOrder, getAllOrdersByUserId, updateStatusOrderItems } = orderController;

router.post("/create", createOrder);
router.get("/getOrdersByUserId/:id", getAllOrdersByUserId);
router.put("/updateStatusOrderItems/:id", updateStatusOrderItems);
router.put("/updateOrder/:id", updateOrder);

export default router;
