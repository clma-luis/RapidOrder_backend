// menu/menuService.ts
import MenuModel, { MenuItem } from "./menuModel";

export class MenuService {
  async addMenuItem(data: MenuItem): Promise<void> {
    const menuItem = new MenuModel({ ...data });
    await menuItem.save();
  }

  async getAllMenuItems(): Promise<MenuItem[]> {
    return MenuModel.find().exec();
  }

  async removeMenuItem(id: string): Promise<MenuItem[]> {
    return MenuModel.find().exec();
  }
}
