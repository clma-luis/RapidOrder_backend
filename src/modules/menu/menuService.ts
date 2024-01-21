import MenuModel, { MenuItemSchema } from "./menuModel";

export class MenuService {
  async addMenuItem(data: MenuItemSchema): Promise<MenuItemSchema> {
    const menuItem = new MenuModel({ ...data });
    const result = await menuItem.save();
    return result;
  }

  async getAllMenuItems(): Promise<MenuItemSchema[]> {
    return MenuModel.find().exec();
  }

  async getOneMenuItem(id: string): Promise<MenuItemSchema> {
    const result = (await MenuModel.findOne({ _id: id }).exec()) as MenuItemSchema;

    return result;
  }

  async updateMenuItem(id: string, data: MenuItemSchema): Promise<MenuItemSchema> {
    const result = (await MenuModel.findOneAndUpdate({ _id: id }, data, { new: true }).exec()) as MenuItemSchema;
    return result;
  }

  async removeMenuItem(id: string): Promise<MenuItemSchema[]> {
    return MenuModel.find().exec();
  }
}
