import mongoose, { Document, Schema } from "mongoose";

export type orderItemType = {
  itemName: string;
  quantity: number;
  details: string;
  status: "pendiente" | "en proceso" | "listo" | "entregado";
  preparedBy: { fullName: string; id: string };
  serviceType: "para llevar" | "comer aquí";
};

export type OrderItemsType = {
  starters: orderItemType[];
  mainCourses: orderItemType[];
  desserts: orderItemType[];
  drinks: orderItemType[];
};

export type ClosedByType = { fullName: string; id: string };

export interface OrderSchema extends Document {
  waiterId: string;
  table: string;
  orderItems: OrderItemsType;
  additionalOrders: OrderItemsType;
  status: "abierto" | "cerrado";
  closedBy: ClosedByType;
}

const orderItemCommonProps = {
  menuItemId: { type: String, required: true },
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true },
  details: { type: String, default: null },
  status: { type: String, default: "pendiente" },
  preparedBy: { type: { fullName: String, id: String, _id: false }, default: null },
  _id: false,
};

const OrderItemsType = {
  starters: [orderItemCommonProps],
  mainCourses: [orderItemCommonProps],
  desserts: [orderItemCommonProps],
  drinks: [orderItemCommonProps],
};

const OrderSchema = new Schema<OrderSchema>(
  {
    waiterId: { type: String, required: [true, "WaiterId is required"] },
    table: { type: String, required: [true, "Table is required"] },
    orderItems: {
      type: OrderItemsType,
      validate: {
        validator: function (orderItems: OrderItemsType) {
          return (
            orderItems.starters.length > 0 ||
            orderItems.mainCourses.length > 0 ||
            orderItems.desserts.length > 0 ||
            orderItems.drinks.length > 0
          );
        },
        message: "At least one item is required.",
      },
      required: [true, "OrderItems is required"],
      _id: false,
    },
    additionalOrders: {
      type: OrderItemsType,
      default: null,
      _id: false,
    },
    status: { type: String, default: "abierto" },
    closedBy: { type: { fullName: String, id: String }, default: null },
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
