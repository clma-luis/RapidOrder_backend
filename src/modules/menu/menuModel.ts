import mongoose, { Document, Schema } from "mongoose";

export interface MenuItemSchema extends Document {
  name: string;
  image: string;
  description: string;
  price: number;
  ingredients: string[];
  type: "entrada" | "principal" | "bebida" | "postre";
  available?: 0 | 1;
  deleted?: 0 | 1;
}

const MenuSchema = new Schema<MenuItemSchema>({
  name: { type: String, required: [true, "Name is required"] },
  image: { type: String, required: [true, "Image is required"] },
  description: { type: String, required: [true, "Description is required"] },
  price: { type: Number, required: [true, "Price is required"] },
  type: { type: String, required: [true, "Type is required"] },
  ingredients: { type: [String], required: [true, "Ingredients are required"] },
  available: { type: Number, default: 1 },
  deleted: { type: Number, default: 0 },
});

MenuSchema.methods.toJSON = function () {
  const { __v, _id, ...menu } = this.toObject();
  menu.id = _id.toString();
  return menu;
};

const MenuModel = mongoose.model<MenuItemSchema>("menu", MenuSchema);

export default MenuModel;
