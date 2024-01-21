import mongoose, { Document, Schema } from "mongoose";

export interface UserSchema extends Document {
  name: string;
  email: string;
  image?: string;
  password: string;
  role: string;
  deleted?: 0 | 1;
}

const userSchema = new Schema<UserSchema>(
  {
    name: { type: String, required: [true, "Name is required"] },
    email: { type: String, required: [true, "Email is required"] },
    image: { type: String, default: "" },
    password: { type: String, required: [true, "Password is required"] },
    role: { type: String, required: [true, "Role is required"], enum: ["ADMIN_ROLE", "USER_ROLE"] },
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

const UserModel = mongoose.model<UserSchema>("userModel", userSchema);

export default UserModel;
