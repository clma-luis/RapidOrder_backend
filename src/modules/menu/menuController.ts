import { Request, Response } from "express";
import { MenuItemSchema } from "./menuModel";
import { MenuService } from "./menuService";

export class MenuController {
  private menuService: MenuService;
  constructor(menuService: MenuService) {
    this.menuService = menuService;
  }

  public createMenuItem = async (req: Request, res: Response): Promise<any> => {
    const data = req.body as MenuItemSchema;
    const result = await this.menuService.addMenuItem(data);
    res.status(201).json({ message: "MenuItem created successfully", result });
  };

  public getAllMenuItems = async (req: Request, res: Response) => {
    const menuItems = await this.menuService.getAllMenuItems();
    res.json(menuItems);
  };

  public getOneMenuItem = async (req: Request, res: Response) => {
    const { id } = req.params;

    const menuItems = await this.menuService.getOneMenuItem(id);
    res.json(menuItems);
  };

  public updateMenuItem = async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body as MenuItemSchema;
    const menuItems = await this.menuService.updateMenuItem(id, data);
    res.json(menuItems);
  };

  public removeMenuItem = async (req: Request, res: Response) => {
    const { id } = req.params;
    const menuItems = await this.menuService.removeMenuItem(id);
    res.json(menuItems);
  };
}
