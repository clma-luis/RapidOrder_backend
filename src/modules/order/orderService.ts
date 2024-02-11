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

  async updateOrderStatus(id: string, orderItems: any): Promise<OrderSchema> {
    const updateData = {
      $set: {},
    };

    const dessertsUpdates = orderItems.desserts.map((item: any, index: any) => {
      return {
        [`orderItems.desserts.${index}.status`]: item.status,
        [`orderItems.desserts.${index}.preparedBy`]: item.preparedBy,
      };
    });

    const drinksUpdates = orderItems.drinks.map((item: any, index: any) => {
      return {
        [`orderItems.drinks.${index}.status`]: item.status,
        [`orderItems.drinks.${index}.preparedBy`]: item.preparedBy,
      };
    });

    const mainCoursesUpdates = orderItems.drinks.map((item: any, index: any) => {
      return {
        [`orderItems.mainCourses.${index}.status`]: item.status,
        [`orderItems.mainCourses.${index}.preparedBy`]: item.preparedBy,
      };
    });

    const startersUpdates = orderItems.drinks.map((item: any, index: any) => {
      return {
        [`orderItems.starters.${index}.status`]: item.status,
        [`orderItems.starters.${index}.preparedBy`]: item.preparedBy,
      };
    });

    Object.assign(updateData.$set, ...dessertsUpdates, ...drinksUpdates, ...mainCoursesUpdates, ...startersUpdates);

    const result = (await OrderModel.findOneAndUpdate({ _id: id }, updateData, { new: true }).exec()) as OrderSchema;
    return result;
  }

  public getOrderStatus(orderId: string): any {
    return orderId;
  }
}

export const orderService = new OrderService();
