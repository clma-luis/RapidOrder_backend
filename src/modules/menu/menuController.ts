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
    const result = await this.menuService.getAllMenuItems();
    res.status(200).json({ message: "MenuItems founds", result });
  };

  public getOneMenuItem = async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await this.menuService.getOneMenuItem(id);
    res.status(200).json({ message: "MenuItem found", result });
  };

  public updateMenuItem = async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body as MenuItemSchema;
    const result = await this.menuService.updateMenuItem(id, data);
    res.status(200).json({ message: "Menu updated successfully", result });
  };

  public removeMenuItem = async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this.menuService.removeMenuItem(id);
    res.status(200).json({ message: result });
  };
}
