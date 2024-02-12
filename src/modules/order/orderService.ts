import { UpdateItemsType } from "./orderMiddelwares";
import OrderModel, { OrderSchema } from "./orderModel";

export class OrderService {
  constructor() {}

  public async createOrder(data: OrderSchema): Promise<OrderSchema> {
    const order = new OrderModel({ ...data });
    const result = await order.save();
    return result;
  }

  public async getAllOrdersByUserId(waiterId: string): Promise<OrderSchema[]> {
    const result = await OrderModel.find({ waiterId }).exec();
    return result;
  }

  async updateOrder(id: string, data: any): Promise<OrderSchema> {
    const result = (await OrderModel.findOneAndUpdate({ _id: id }, data, { new: true }).exec()) as OrderSchema;
    return result;
  }

  async updateOrderStatus(id: string, orderItems: UpdateItemsType[]): Promise<OrderSchema> {
    const updateData = {
      $set: {},
    };

    Object.assign(updateData.$set, ...orderItems);

    const result = await OrderModel.findOneAndUpdate({ _id: id }, updateData, { new: true });

    if (!result) {
      throw new Error(`Not found order with id: ${id}`);
    }

    return result;
  }

  public getOrderStatus(orderId: string): any {
    return orderId;
  }
}

export const orderService = new OrderService();
