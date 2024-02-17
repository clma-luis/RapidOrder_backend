import express from "express";

import { OrderController } from "./orderController";
import { prepareDataToAddOrders, prepareDataToUpdate } from "./orderMiddelwares";

const router = express.Router();

const orderController = new OrderController();
const { createOrder, getAllOrdersByUserId, updateStatusOrderItems, addAdditionalOrders, updateOrderStatus } = orderController;

router.post("/create", createOrder);
router.post("/addNewOrders/:id", prepareDataToAddOrders, addAdditionalOrders);
router.get("/getOrdersByUserId/:id", getAllOrdersByUserId);
router.put("/updateStatusOrderItems/:id", prepareDataToUpdate, updateStatusOrderItems);
router.put("/updateStatusOrder", updateOrderStatus);
router.put("/updateOrderTable/:id", prepareDataToUpdate, updateStatusOrderItems);

export default router;
