import OrderModel, { OrderItemsType, OrderSchema, orderItemType } from "./orderModel";

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

  async updateOrderStatus(id: string, orderItems: OrderItemsType): Promise<OrderSchema> {
    const updateData = {
      $set: {},
    };

    const orders: Record<string, orderItemType[]> = orderItems;

    const updateItems = (category: string) => {
      return orders[category].map((item: any, index: any) => ({
        [`orderItems.${category}.${index}.status`]: item.status,
        [`orderItems.${category}.${index}.preparedBy`]: item.preparedBy,
      }));
    };

    const allUpdates = Object.keys(orderItems).flatMap((category) => updateItems(category));

    Object.assign(updateData.$set, ...allUpdates);

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
