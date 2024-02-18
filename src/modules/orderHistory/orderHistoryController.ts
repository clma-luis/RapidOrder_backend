import { Request, Response } from "express";
import { OrderProps, OrderSchema } from "../order/orderModel";
import { handleAdapDataToAddNewStatusHistory, handleAdaptDataToCreateOrderHistory } from "./orderHistoryMiddlewares";
import { orderHistoryService } from "./orderHistoryService";

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
    console.log("esta pasaongo por updateStatusOrderItems controller orderhistory");
    const { id } = data;
    try {
      const dataAdapter = handleAdapDataToAddNewStatusHistory(data, orderItems);
      await orderHistoryService.updateStatusOrderItemsHistory(id, dataAdapter);
    } catch (error) {
      console.log(error);
      throw new Error(`Error to update status orderHistory: ${data.id}`);
    }
  }

  public async getAllOrderHistories(req: Request, res: Response): Promise<any> {}

  public async getOrderHistory(req: Request, res: Response): Promise<any> {}
}

export const orderHistoryController = new OrderHistoryController();
