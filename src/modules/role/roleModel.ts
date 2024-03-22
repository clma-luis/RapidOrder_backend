import mongoose, { Document, Schema } from "mongoose";

export interface RoleSchema extends Document {
  role: string;
  maximumQuantity: number;
}

const RoleSchema = new Schema<RoleSchema>({
  role: { type: String, required: [true, "Role is required"] },
  maximumQuantity: { type: Number, required: [true, "acceptedAmount is required"] },
});

RoleSchema.methods.toJSON = function () {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { __v, _id, ...role } = this.toObject();
  role.id = _id.toString();
  return role;
};

const RoleModel = mongoose.model<RoleSchema>("role", RoleSchema);

export default RoleModel;
