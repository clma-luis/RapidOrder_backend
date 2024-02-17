import OrderHistoryModel, { OrderHistorySchema } from "./orderHistoryModel";

class OrderHistoryService {
  constructor() {}

  public async createOrderHistory(data: OrderHistorySchema): Promise<OrderHistorySchema> {
    const orderHistory = new OrderHistoryModel({ ...data });
    const result = await orderHistory.save();
    return result;
  }

  public async addHistory(orderId: string, data: OrderHistorySchema): Promise<OrderHistorySchema> {
    const result = (await OrderHistoryModel.findOneAndUpdate({ orderId }, { data }, { new: true })) as OrderHistorySchema;
    return result;
  }

  public async getAllOrderHistories(): Promise<OrderHistorySchema[]> {
    const result = (await OrderHistoryModel.find()) as OrderHistorySchema[];
    return result;
  }

  public async getOrderHistory(orderId: string): Promise<OrderHistorySchema> {
    const result = (await OrderHistoryModel.findOne({ orderId })) as OrderHistorySchema;
    return result;
  }
}

export const orderHistoryService = new OrderHistoryService();
