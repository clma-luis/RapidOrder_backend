import mongoose, { Document, Schema } from "mongoose";

type orderItemType = {
  itemName: string;
  quantity: number;
  details: string;
};

type OrderItemsType = {
  starters: orderItemType[];
  mainCourses: orderItemType[];
  desserts: orderItemType[];
};

export interface OrderSchema extends Document {
  waiterId: string;
  chefId: string;
  table: string;
  orderItems: OrderItemsType;
  status: "pendiente" | "preparando" | "listo" | "entregado";
}

const OrderSchema = new Schema<OrderSchema>(
  {
    waiterId: { type: String, required: [true, "WaiterId is required"] },
    chefId: { type: String, required: [true, "ChefId is required"] },
    table: { type: String, required: [true, "Table is required"] },
    orderItems: { type: Object, required: [true, "OrderItems is required"] },
    status: { type: String, default: "pendiente" },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

OrderSchema.methods.toJSON = function () {
  const { __v, _id, ...order } = this.toObject();
  order.id = _id.toString();
  return order;
};

const OrderModel = mongoose.model<OrderSchema>("order", OrderSchema);

export default OrderModel;
