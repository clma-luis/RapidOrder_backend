import express from "express";
import { orderHistoryController } from "./orderHistoryController";

const router = express.Router();

const { getAllOrderHistories, getOneOrderHistory } = orderHistoryController;

router.get("/getAllOrderHistories", getAllOrderHistories);
router.get("/getOrderHistory/:id", getOneOrderHistory);
