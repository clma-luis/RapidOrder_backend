import { Request, Response } from "express";
import { MenuItemSchema } from "./menuModel";
import { MenuService } from "./menuService";
import { CREATED_STATUS, INTERNAL_SERVER_ERROR_STATUS, NOT_FOUND, OK_STATUS } from "../../shared/constants/statusHTTP";

export class MenuController {
  private menuService: MenuService;
  constructor(menuService: MenuService) {
    this.menuService = menuService;
  }

  public createMenuItem = async (req: Request, res: Response) => {
    const { cloudUrl, image, ...rest } = req.body;
    const data = {
      ...rest,
      image: cloudUrl,
    } as MenuItemSchema;

    try {
      const result = await this.menuService.addMenuItem(data);

      res.status(CREATED_STATUS).json({ message: "MenuItem created successfully", result });
    } catch (error) {
      console.error(error);
      res.status(INTERNAL_SERVER_ERROR_STATUS).json({ message: "An error occurred while creating the current dish menu" });
    }
  };

  public getAllMenuItems = async (req: Request, res: Response) => {
    const result = await this.menuService.getAllMenuItems();
    res.status(OK_STATUS).json({ message: "MenuItems founds", result });
  };

  public getOneMenuItem = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const result = await this.menuService.getOneMenuItem(id);
      if (!result) return res.status(NOT_FOUND).json({ message: "The menu does not exist" });

      return res.status(OK_STATUS).json({ message: "MenuItem found", result });
    } catch (error) {
      console.error(error);
      return res.status(INTERNAL_SERVER_ERROR_STATUS).json({ message: "An error occurred while getting the current dish menu" });
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
      res.status(OK_STATUS).json({ message: "Menu updated successfully", result });
    } catch (error) {
      console.error(error);
      res.status(INTERNAL_SERVER_ERROR_STATUS).json({ message: "An error occurred while updating the current dish menu" });
    }
  };

  public changeMenuStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { available } = req.body;

    try {
      const result = await this.menuService.changeMenuStatus(id, available);
      res.status(OK_STATUS).json({ message: result });
    } catch (error) {
      console.error(error);
      res
        .status(INTERNAL_SERVER_ERROR_STATUS)
        .json({ message: "An error occurred while changing available status of the current dish menu" });
    }
  };

  public removeMenuItem = async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this.menuService.removeMenuItem(id);
    res.status(OK_STATUS).json({ message: result });
  };
}
