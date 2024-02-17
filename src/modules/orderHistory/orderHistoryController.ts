import { Request, Response } from "express";
import { OrderHistorySchema } from "./orderHistoryModel";
import { orderHistoryService } from "./orderHistoryService";

class OrderHistoryController {
  constructor() {}

  public async createOrderHistory(data: any, dataDetails: any): Promise<any> {
    const dataAdapter = {
      orderId: data.id,
      history: [
        {
          action: "crear",
          userDetails: { id: data.createdBy, fullName: data.creatorFullName },
          date: data.createdAt,
          dataDetails,
        },
      ],
    } as OrderHistorySchema;
    await orderHistoryService.createOrderHistory(dataAdapter);
  }

  public async addHistory(req: Request, res: Response): Promise<any> {}

  public async getAllOrderHistories(req: Request, res: Response): Promise<any> {}

  public async getOrderHistory(req: Request, res: Response): Promise<any> {}
}

export const orderHistoryController = new OrderHistoryController();
