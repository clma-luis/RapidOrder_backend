import UserModel, { UserSchema } from "./userModel";

export class UserService {
  constructor() {}

  async creatreUser(data: any): Promise<UserSchema> {
    const menuItem = new UserModel({ ...data });
    const result = await menuItem.save();
    return result;
  }

  async getAllUsers(): Promise<UserSchema[]> {
    return UserModel.find().exec();
  }

  async getOneUser(id: string): Promise<UserSchema> {
    const result = (await UserModel.findOne({ _id: id }).exec()) as UserSchema;

    return result;
  }

  async updateUser(id: string, data: UserSchema): Promise<UserSchema> {
    const result = (await UserModel.findOneAndUpdate({ _id: id }, data, { new: true }).exec()) as UserSchema;
    return result;
  }

  async changeUserPassword(id: string, password: string): Promise<UserSchema> {
    const result = (await UserModel.findOneAndUpdate({ _id: id }, { password }, { new: true }).exec()) as UserSchema;
    return result;
  }

  async changeUserEmail(id: string, email: string): Promise<UserSchema> {
    const result = (await UserModel.findOneAndUpdate({ _id: id }, { email }, { new: true }).exec()) as UserSchema;
    return result;
  }

  async removeUser(id: string): Promise<string> {
    (await UserModel.findOneAndUpdate({ _id: id }, { deleted: 1 }, { new: true }).exec()) as UserSchema;
    return "User deleted successfully";
  }
}

export const userService = new UserService();
