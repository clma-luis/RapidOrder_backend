import { ClosedByType } from "../order/orderModel";
import OrderHistoryModel, { HistoryType, OrderHistorySchema } from "./orderHistoryModel";

class OrderHistoryService {
  constructor() {}

  public async createOrderHistory(data: OrderHistorySchema): Promise<OrderHistorySchema> {
    const orderHistory = new OrderHistoryModel({ ...data });
    const result = await orderHistory.save();
    return result;
  }

  public async addLogToOrderHistory(orderId: string, data: HistoryType) {
    const result = (await OrderHistoryModel.findOneAndUpdate(
      { orderId },
      { $push: { ["history"]: data } },
      { new: true }
    )) as OrderHistorySchema;

    return result;
  }

  public async getAllOrderHistories({ page, size }: { page: number; size: number }): Promise<OrderHistorySchema[]> {
    const skip = (page - 1) * size;
    const result = await OrderHistoryModel.find().skip(skip).limit(size);
    return result;
  }

  async getTotalOrderHistories(): Promise<number> {
    return OrderHistoryModel.countDocuments().exec();
  }

  public async getOneOrderHistory(orderId: string): Promise<OrderHistorySchema> {
    const result = (await OrderHistoryModel.findOne({ orderId })) as OrderHistorySchema;
    return result;
  }
}

export const orderHistoryService = new OrderHistoryService();
