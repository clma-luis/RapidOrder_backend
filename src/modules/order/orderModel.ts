import mongoose, { Document, Schema } from "mongoose";

export type StatusOrderType = "abierto" | "cerrado";
const serviceTypeEnum = ["para llevar", "comer aquí"];

export type DetailsOrderItemType = { menuItemId: string; itemName: string };

export type orderItemType = {
  itemName: string;
  quantity: number;
  details: DetailsOrderItemType;
  observation: string;
  status: "pendiente" | "en proceso" | "listo" | "entregado";
  preparedBy: { fullName: string; id: string };
  serviceType: "para llevar" | "comer aquí";
  totalToPay: number;
  payMethod: "efectivo" | "yape" | "punto de venta";
};

export type OrderItemsType = {
  starters: orderItemType[];
  mainCourses: orderItemType[];
  desserts: orderItemType[];
  drinks: orderItemType[];
};

export type ClosedByType = { fullName: string; userId: string };

export interface OrderProps {
  createdBy: string;
  creatorFullName: string;
  table: string;
  orderItems: OrderItemsType;
  status?: StatusOrderType;
  closedBy?: ClosedByType;
  createdAt?: Date;
  updatedAt?: Date;
}

export type OrderSchema = OrderProps & Document;

const orderItemCommonProps = {
  details: { type: { itemName: String, menuItemId: String }, required: true, _id: false },
  quantity: { type: Number, required: true },
  observation: { type: String, default: null },
  status: { type: String, default: "pendiente" },
  serviceType: { type: String, enum: serviceTypeEnum, required: [true, "serviceType is required"] },
  preparedBy: { type: { fullName: String, id: String, _id: false }, default: null },
};

const OrderItemsType = {
  starters: [orderItemCommonProps],
  mainCourses: [orderItemCommonProps],
  desserts: [orderItemCommonProps],
  drinks: [orderItemCommonProps],
};

const OrderSchema = new Schema<OrderSchema>(
  {
    createdBy: { type: String, required: [true, "waiterId is required"] },
    creatorFullName: { type: String, required: [true, "creatorFullName is required"] },
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
    status: { type: String, default: "abierto" },
    closedBy: { type: { fullName: String, id: String }, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

OrderSchema.methods.toJSON = function () {
  const { __v, _id, orderItems, ...order } = this.toObject();
  order.id = _id.toString();
  order.orderItems = handleIdAdapter(orderItems);
  return order;
};

const OrderModel = mongoose.model<OrderSchema>("order", OrderSchema);

export default OrderModel;

interface CurrentOrderItems extends orderItemType {
  _id: any;
  id?: string;
}

const handleIdAdapter = (orderItems: any) => {
  const currentOrderItems: Record<string, CurrentOrderItems[]> = orderItems;
  const keyOfObject = Object.keys(orderItems as any);

  const result = keyOfObject.reduce(
    (acc, el) => ({
      ...acc,
      [el]: !!currentOrderItems[el].length
        ? currentOrderItems[el].map((item) => {
            const { _id, ...order } = item;
            order.id = _id.toString();
            return order;
          })
        : [],
    }),
    {}
  );

  return result;
};
