import MenuModel, { MenuItemSchema } from "./menuModel";

export class MenuService {
  public async addMenuItem(data: MenuItemSchema): Promise<MenuItemSchema> {
    const menuItem = new MenuModel({ ...data });
    const result = await menuItem.save();
    return result;
  }

  public async getAllMenuItems({ page, size, type }: { page: number; size: number; type: string }): Promise<MenuItemSchema[]> {
    const skip = (page - 1) * size;
    return MenuModel.find({ type }).skip(skip).limit(size);
  }

  public async getOneMenuItem(id: string): Promise<MenuItemSchema> {
    const result = (await MenuModel.findOne({ _id: id }).exec()) as MenuItemSchema;

    return result;
  }

  async updateMenuItem(id: string, data: MenuItemSchema): Promise<MenuItemSchema> {
    const result = (await MenuModel.findOneAndUpdate({ _id: id }, data, { new: true }).exec()) as MenuItemSchema;
    return result;
  }

  public async changeMenuStatus(id: string, available: number): Promise<string> {
    await MenuModel.findOneAndUpdate({ _id: id }, { available }, { new: true }).exec();
    return "Menu item deleted successfully";
  }

  public async removeMenuItem(id: string): Promise<string> {
    await MenuModel.findOneAndUpdate({ _id: id }, { deleted: 1 }, { new: true }).exec();
    return "Menu item deleted successfully";
  }
}
