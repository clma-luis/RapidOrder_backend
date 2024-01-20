import { Request, Response } from "express";
import { MenuService } from "./menuService";
import { MenuItem } from "./menuModel";

export class MenuController {
  private menuService: MenuService;
  constructor(menuService: MenuService) {
    this.menuService = menuService;
  }

  public addMenuItem = async (req: Request, res: Response): Promise<void> => {
    const data = req.body as MenuItem;
    await this.menuService.addMenuItem(data);
    res.status(201).json({ message: "MenuItem added successfully" });
  };

  public getAllMenuItems = async (req: Request, res: Response): Promise<void> => {
    const menuItems = await this.menuService.getAllMenuItems();
    res.json(menuItems);
  };

  public removeMenuItem = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const menuItems = await this.menuService.removeMenuItem(id);
    res.json(menuItems);
  };
}
