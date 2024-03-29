import mongoose, { Document, Schema } from "mongoose";

export type StatusOrderType = "abierto" | "cerrado";

export enum StatusOrder {
  OPEN = "abierto",
  CLOSED = "cerrado",
}

export enum ServiceType {
  TAKE_AWAY = "para llevar",
  TAKE_HERE = "comer aquí",
  DELIVERY = "delivery",
}

export enum StatusOrderItem {
  PENDING = "pendiente",
  IN_PROGRESS = "en proceso",
  READY = "listo",
  DELIVERED = "entregado",
}

const serviceTypeEnum = ["para llevar", "comer aquí"];

export type DetailsOrderItemType = { menuItemId: string; itemName: string; price: number };

export type orderItemType = {
  itemName: string;
  quantity: number;
  details: DetailsOrderItemType;
  observation: string;
  status: StatusOrderItem;
  preparedBy: { fullName: string; id: string };
  serviceType: ServiceType;
  type: string;
  id?: string;
};

export type OrderItemsType = {
  starters: orderItemType[];
  mainCourses: orderItemType[];
  desserts: orderItemType[];
  drinks: orderItemType[];
};

export interface OrderItemsToObjectType extends OrderItemsType {
  toObject(): unknown;
}

export type ClosedByType = { fullName: string; userId: string };

export interface OrderProps {
  createdBy: string;
  creatorFullName: string;
  table: string;
  orderItems: OrderItemsType;
  status?: StatusOrder;
  closedBy?: ClosedByType;
  createdAt?: Date;
  updatedAt?: Date;
  totalReadyOrders?: number;
  totalPrice: number;
  payMethod?: "efectivo" | "yape" | "tarjeta";
}

export type OrderSchema = OrderProps & Document;

const orderItemCommonProps = {
  details: { type: { itemName: String, menuItemId: String, price: Number }, required: true, _id: false },
  quantity: { type: Number, required: true },
  observation: { type: String, default: null },
  status: { type: String, default: "pendiente" },
  serviceType: { type: String, enum: serviceTypeEnum, required: [true, "serviceType is required"] },
  preparedBy: { type: { fullName: String, id: String, _id: false }, default: null },
  type: { type: String },
};

const OrderItemsType = {
  starters: [orderItemCommonProps],
  mainCourses: [orderItemCommonProps],
  desserts: [orderItemCommonProps],
  drinks: [orderItemCommonProps],
};

const OrderSchema = new Schema<OrderSchema>(
  {
    createdBy: { type: String, required: [true, "createdBy is required"] },
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
    closedBy: { type: { fullName: String, userId: String, _id: false }, default: null },
    payMethod: { type: { fullName: String, userId: String }, default: null },
    totalPrice: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

OrderSchema.methods.toJSON = function () {
  const { _id, orderItems, ...order } = this.toObject();
  delete order.__v;
  order.id = _id.toString();
  order.orderItems = handleIdAdapter(orderItems);

  return order;
};

const OrderModel = mongoose.model<OrderSchema>("order", OrderSchema);

export default OrderModel;

interface CurrentOrderItems extends orderItemType {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _id: any;
  id?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleIdAdapter = (orderItems: any) => {
  const currentOrderItems: Record<string, CurrentOrderItems[]> = orderItems;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const keyOfObject = Object.keys(orderItems as any);

  const result = keyOfObject.reduce(
    (acc, el) => ({
      ...acc,
      [el]: currentOrderItems[el].length
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
