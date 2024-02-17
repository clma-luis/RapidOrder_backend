import express from "express";
import { orderHistoryController } from "./orderHistoryController";

const router = express.Router();

const { addHistory, createOrderHistory, getAllOrderHistories, getOrderHistory } = orderHistoryController;

router.post("/create", createOrderHistory);
router.put("/addOrderHistory/:id", addHistory);
router.get("/getAllOrderHistories", getAllOrderHistories);
router.get("/getOrderHistory/:id", getOrderHistory);
