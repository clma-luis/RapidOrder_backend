import { Request, Response } from "express";
import { MenuItemSchema } from "./menuModel";
import { MenuService } from "./menuService";

export class MenuController {
  private menuService: MenuService;
  constructor(menuService: MenuService) {
    this.menuService = menuService;
  }

  public createMenuItem = async (req: Request, res: Response): Promise<any> => {
    const { cloudUrl, image, ...rest } = req.body;
    const data = {
      ...rest,
      image: cloudUrl,
    } as MenuItemSchema;

    try {
      const result = await this.menuService.addMenuItem(data);

      res.status(201).json({ message: "MenuItem created successfully", result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while creating the current dish menu" });
    }
  };

  public getAllMenuItems = async (req: Request, res: Response) => {
    const result = await this.menuService.getAllMenuItems();
    res.status(200).json({ message: "MenuItems founds", result });
  };

  public getOneMenuItem = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const result = await this.menuService.getOneMenuItem(id);
      if (!result) return res.status(404).json({ message: "The menu does not exist" });

      return res.status(200).json({ message: "MenuItem found", result });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "An error occurred while getting the current dish menu" });
    }
  };

  public updateMenuItem = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { available, deleted, menu, cloudUrl, image, ...rest } = req.body;
    const data = {
      ...rest,
      image: cloudUrl,
    } as MenuItemSchema;

    try {
      const result = await this.menuService.updateMenuItem(id, data);
      res.status(200).json({ message: "Menu updated successfully", result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while updating the current dish menu" });
    }
  };

  public changeMenuStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { available } = req.body;

    try {
      const result = await this.menuService.changeMenuStatus(id, available);
      res.status(200).json({ message: result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while changing available status of the current dish menu" });
    }
  };

  public removeMenuItem = async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this.menuService.removeMenuItem(id);
    res.status(200).json({ message: result });
  };
}
