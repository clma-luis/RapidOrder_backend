import express from "express";

import { OrderController } from "./orderController";
import { prepareDataToUpdate } from "./orderMiddelwares";

const router = express.Router();

const orderController = new OrderController();
const { createOrder, updateOrder, getAllOrdersByUserId, updateStatusOrderItems, updateOrderStatus } = orderController;

router.post("/create", createOrder);
router.post("/addAdditionalOrders/:id", prepareDataToUpdate, updateOrder);
router.get("/getOrdersByUserId/:id", getAllOrdersByUserId);
router.put("/updateStatusOrderItems/:id", prepareDataToUpdate, updateStatusOrderItems);
router.put("/updateStatusOrder", updateOrderStatus);
router.put("/updateOrderTable/:id", prepareDataToUpdate, updateStatusOrderItems);
router.put("/updateOrder/:id", updateOrder);

export default router;
