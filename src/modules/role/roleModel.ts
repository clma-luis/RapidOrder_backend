import mongoose, { Document, Schema } from "mongoose";

export interface RoleSchema extends Document {
  role: string;
}

const menuSchema = new Schema<RoleSchema>(
  {
    role: { type: String, required: [true, "Role is required"] },
  },
  {
    versionKey: false,
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

const RoleModel = mongoose.model<RoleSchema>("MenuItem", menuSchema);

export default RoleModel;
