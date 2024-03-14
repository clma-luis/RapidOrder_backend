/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
import { Request, Response } from "express";
import { MenuItemSchema } from "./menuModel";
import { MenuService } from "./menuService";
import { CREATED_STATUS, INTERNAL_SERVER_ERROR_STATUS, NOT_FOUND, OK_STATUS } from "../../shared/constants/statusHTTP";

export class MenuController {
  private menuService: MenuService;
  private page: number;
  private size: number;

  constructor(menuService: MenuService) {
    this.page = 1;
    this.size = 10;
    this.menuService = menuService;
  }

  public createMenuItem = async (req: Request, res: Response) => {
    const { cloudUrl, ...rest } = req.body;
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
    const { page, size, type } = req.query;
    const currentPage = !page ? this.page : Number(page);
    const currentSize = !size ? this.size : Number(size);

    const result = await this.menuService.getAllMenuItems({ page: currentPage, size: currentSize, type: type as string });
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
