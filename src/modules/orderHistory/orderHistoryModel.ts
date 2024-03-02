import mongoose, { Document, Schema } from "mongoose";

export type HistoryType = {
  action: string;
  userDetails: { id: string; fullName: string };
  dataDetails: any;
  message?: string;
  date: Date;
};

export interface OrderHistorySchema extends Document {
  orderId: string;
  history: HistoryType[];
}

const historyTypeModel = {
  action: { type: String, required: true },
  dataDetails: { type: Schema.Types.Mixed, required: true },
  userDetails: { type: { id: String, fullName: String, _id: false } },
  message: { type: String, default: null },
  date: { type: Date, required: true },
  _id: false,
};

const OrderHistorySchema = new Schema<OrderHistorySchema>({
  orderId: { type: String, required: [true, "orderId is required"] },
  history: { type: [historyTypeModel], required: [true, "history is required"] },
});

OrderHistorySchema.methods.toJSON = function () {
  const { __v, _id, ...orderHistory } = this.toObject();
  orderHistory.id = _id;
  return orderHistory;
};

const OrderHistoryModel = mongoose.model<OrderHistorySchema>("orderHistory", OrderHistorySchema);

export default OrderHistoryModel;
