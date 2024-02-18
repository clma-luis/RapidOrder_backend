import { Request, Response } from "express";
import { ClosedByType, OrderProps, OrderSchema, StatusOrderType } from "../order/orderModel";
import {
  handleAdapDataToAddNewStatusHistory,
  handleAdaptDatOrderStatus,
  handleAdaptDataToCreateOrderHistory,
} from "./orderHistoryMiddlewares";
import { orderHistoryService } from "./orderHistoryService";
import { INTERNAL_SERVER_ERROR_STATUS, OK_STATUS } from "../../shared/constants/statusHTTP";

export interface CreateOrderData extends OrderSchema {
  createdAt: Date;
  updatedAt: Date;
}

class OrderHistoryController {
  constructor() {}

  public async createOrderHistory(data: CreateOrderData, dataDetails: OrderProps): Promise<any> {
    try {
      const dataAdapter = handleAdaptDataToCreateOrderHistory(data, dataDetails);
      await orderHistoryService.createOrderHistory(dataAdapter);
    } catch (error) {
      console.log(error);
      throw new Error(`Error to create orderHistory: ${data.id}`);
    }
  }

  public async updateStatusOrderItems(data: CreateOrderData, orderItems: any): Promise<any> {
    const { id } = data;
    try {
      const dataAdapter = handleAdapDataToAddNewStatusHistory(data, orderItems);
      await orderHistoryService.addLogToOrderHistory(id, dataAdapter);
    } catch (error) {
      console.error(error);
      throw new Error(`Error to update status orderHistory: ${data.id}`);
    }
  }

  public async closeOrderStatus(id: string, status: StatusOrderType, closedBy: ClosedByType, data: CreateOrderData) {
    try {
      const dataAdapter = handleAdaptDatOrderStatus(data, status, closedBy);
      await orderHistoryService.addLogToOrderHistory(id, dataAdapter);
    } catch (error) {
      console.error(error);
      throw new Error(`Error to update order status: ${data.id}`);
    }
  }

  public async getAllOrderHistories(req: Request, res: Response): Promise<any> {
    const { page, size } = req.query;

    try {
      const [result, total] = await Promise.all([
        orderHistoryService.getAllOrderHistories({ page: Number(page), size: Number(size) }),
        orderHistoryService.getTotalOrderHistories(),
      ]);

      res.status(OK_STATUS).json({ message: "orderHistories found", result, total, page, size });
    } catch (error) {
      console.error(error);
      res.status(INTERNAL_SERVER_ERROR_STATUS).json({ error: "Internal server error while getting orderHistories" });
    }
  }

  public async getOneOrderHistory(req: Request, res: Response) {
    const { id } = req.params;
    const result = await orderHistoryService.getOneOrderHistory(id);
    res.status(OK_STATUS).json({ message: "orderHistory found", result });
    try {
    } catch (error) {
      console.error(error);
      res.status(INTERNAL_SERVER_ERROR_STATUS).json({ error: "Internal server error while getting an orderHistory" });
    }
  }
}

export const orderHistoryController = new OrderHistoryController();
