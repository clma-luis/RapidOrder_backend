import mongoose, { Document, Schema } from "mongoose";

export interface MenuItemSchema extends Document {
  name: string;
  image: string;
  description: string;
  price: number;
  ingredients: string[];
  available?: 0 | 1;
  deleted?: 0 | 1;
}

const menuSchema = new Schema<MenuItemSchema>(
  {
    name: { type: String, required: [true, "Name is required"] },
    image: { type: String, required: [true, "Image is required"] },
    description: { type: String, required: [true, "Description is required"] },
    price: { type: Number, required: [true, "Price is required"] },
    ingredients: { type: [String], required: [true, "Ingredients are required"] },
    available: { type: Number, default: 1 },
    deleted: { type: Number, default: 0 },
  },
  {
    versionKey: false,
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

const MenuModel = mongoose.model<MenuItemSchema>("MenuItem", menuSchema);

export default MenuModel;
