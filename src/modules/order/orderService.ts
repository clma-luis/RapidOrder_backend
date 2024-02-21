import mongoose from "mongoose";
import { UpdateItemsType } from "./orderMiddlewares";
import OrderModel, { ClosedByType, OrderSchema, orderItemType } from "./orderModel";

class OrderService {
  constructor() {}

  public async createOrderService(data: OrderSchema): Promise<OrderSchema> {
    const order = new OrderModel({ ...data });
    const result = await order.save();
    return result;
  }

  public async getAllOrdersByUserIdService(createdBy: string): Promise<OrderSchema[]> {
    const result = await OrderModel.find({ createdBy }).exec();
    return result;
  }

  public async getOneOrderItemService(id: string): Promise<OrderSchema> {
    const result = (await OrderModel.findById(id)) as OrderSchema;
    return result;
  }

  public async updateOneOrderItemService(id: string, data: orderItemType): Promise<OrderSchema> {
    const { quantity, observation, serviceType, type } = data;

    const updateFields = {
      [`orderItems.${type}.$[elem].quantity`]: quantity,
      [`orderItems.${type}.$[elem].observation`]: observation,
      [`orderItems.${type}.$[elem].serviceType`]: serviceType,
    };

    const options = {
      new: true,
      arrayFilters: [{ "elem._id": new mongoose.Types.ObjectId(data.id) }],
    };

    const result = (await OrderModel.findOneAndUpdate({ _id: id }, { $set: updateFields }, options)) as OrderSchema;

    return result;
  }

  async updateOrderItemsStatusService(id: string, orderItems: UpdateItemsType[]): Promise<OrderSchema> {
    const updateData = {
      $set: {},
    };

    Object.assign(updateData.$set, ...orderItems);

    const result = (await OrderModel.findOneAndUpdate({ _id: id }, updateData, {
      new: true,
      projection: {
        totalReadyOrders: {
          $sum: {
            $map: {
              input: {
                $concatArrays: ["$orderItems.starters", "$orderItems.mainCourses", "$orderItems.desserts", "$orderItems.drinks"],
              },
              as: "orderItem",
              in: { $cond: [{ $eq: ["$$orderItem.status", "listo"] }, 1, 0] },
            },
          },
        },
        createdBy: 1,
        creatorFullName: 1,
        table: 1,
        orderItems: 1,
        status: 1,
        closedBy: 1,
        createdAt: 1,
        updatedAt: 1,
        _id: 0,
      },
      lean: true,
    })) as OrderSchema;

    if (result) {
      result.id = result._id;
      delete result._id;
    }

    return result;
  }

  public async closeOrderService(id: string, status: string, closedBy: ClosedByType, payMethod: string): Promise<OrderSchema> {
    const result = (await OrderModel.findOneAndUpdate({ _id: id }, { status, closedBy, payMethod }, { new: true })) as OrderSchema;
    return result;
  }

  public getOrderStatus(orderId: string): any {
    return orderId;
  }

  public async updateOrderTableService(id: string, table: string): Promise<OrderSchema> {
    const result = (await OrderModel.findOneAndUpdate({ _id: id }, { table }, { new: true })) as OrderSchema;
    return result;
  }

  public async addAdditionalOrdersService(id: string, orderItems: any): Promise<OrderSchema> {
    const result = (await OrderModel.findByIdAndUpdate(
      { _id: id },
      {
        $push: orderItems,
      },
      { new: true }
    )) as OrderSchema;

    return result;
  }

  public async updateTotalPriceService(id: string, totalPrice: number): Promise<OrderSchema> {
    const result = (await OrderModel.findByIdAndUpdate({ _id: id }, { totalPrice }, { new: true })) as OrderSchema;

    return result;
  }
}

export const orderService = new OrderService();
