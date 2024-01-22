import RoleModel, { RoleSchema } from "./roleModel";

class RoleService {
  constructor() {}

  async addRole(data: RoleSchema): Promise<RoleSchema> {
    const menuItem = new RoleModel({ ...data });
    const result = await menuItem.save();
    return result;
  }

  async getAllRoles(): Promise<RoleSchema[]> {
    return RoleModel.find().exec();
  }

  async getOneRole(id: string): Promise<RoleSchema> {
    const result = (await RoleModel.findOne({ _id: id }).exec()) as RoleSchema;

    return result;
  }

  async updateRole(id: string, data: RoleSchema): Promise<RoleSchema> {
    const result = (await RoleModel.findOneAndUpdate({ _id: id }, data, { new: true }).exec()) as RoleSchema;
    return result;
  }

  async removeRole(id: string): Promise<string> {
    await RoleModel.findOneAndUpdate({ _id: id }, { deleted: 1 }, { new: true }).exec();
    return "Menu item deleted successfully";
  }
}

export const roleService = new RoleService();
