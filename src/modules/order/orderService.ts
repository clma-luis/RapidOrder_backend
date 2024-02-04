import OrderModel, { OrderSchema } from "./orderModel";

export class OrderService {
  constructor() {}

  public async createOrder(data: OrderSchema): Promise<OrderSchema> {
    const order = new OrderModel({ ...data });
    const result = await order.save();
    return result;
  }

  public async getAllOrdersByUserId(waiterId: string): Promise<OrderSchema[]> {
    console.log("waiterId", waiterId);
    const result = await OrderModel.find({ waiterId }).exec();
    console.log("getAllOrdersByUserId", result);
    return result;
  }

  async updateOrder(id: string, data: any): Promise<OrderSchema> {
    const result = (await OrderModel.findOneAndUpdate({ _id: id }, data, { new: true }).exec()) as OrderSchema;
    return result;
  }

  async updateOrderStatus(id: string, status: string): Promise<OrderSchema> {
    const result = (await OrderModel.findOneAndUpdate({ _id: id }, { status }, { new: true }).exec()) as OrderSchema;
    return result;
  }

  public getOrderStatus(orderId: string): any {
    return orderId;
  }
}

export const orderService = new OrderService();
