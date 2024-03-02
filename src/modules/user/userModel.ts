import mongoose, { Document, Schema } from "mongoose";

export interface UserSchema extends Document {
  name: string;
  email: string;
  image?: string;
  password: string;
  role: string;
  deleted?: 0 | 1;
}

const UserSchema = new Schema<UserSchema>({
  name: { type: String, required: [true, "Name is required"] },
  email: { type: String, required: [true, "Email is required"] },
  image: { type: String, default: "" },
  password: { type: String, required: [true, "Password is required"] },
  role: { type: String, required: [true, "Role is required"] },
  deleted: { type: Number, default: 0 },
});

UserSchema.methods.toJSON = function () {
  const { __v, _id, password, deleted, ...role } = this.toObject();
  role.id = _id.toString();
  return role;
};

const UserModel = mongoose.model<UserSchema>("User", UserSchema);

export default UserModel;
