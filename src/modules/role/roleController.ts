import { Request, Response } from "express";
import { roleService } from "./roleService";
import { RoleSchema } from "./roleModel";
import { CREATED_STATUS, OK_STATUS } from "../../shared/constants/statusHTTP";

class RoleController {
  constructor() {}

  public createRole = async (req: Request, res: Response) => {
    const data = req.body as RoleSchema;
    const result = await roleService.addRole(data);
    res.status(CREATED_STATUS).json({ message: "Role created successfully", result });
  };

  public getAllRoles = async (req: Request, res: Response) => {
    const result = await roleService.getAllRoles();
    res.status(OK_STATUS).json({ message: "Roles founds", result });
  };

  public getOneRole = async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await roleService.getOneRole(id);
    res.status(OK_STATUS).json({ message: "Role found", result });
  };

  public updateRole = async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body as RoleSchema;
    const result = await roleService.updateRole(id, data);
    res.status(OK_STATUS).json({ message: "Role updated successfully", result });
  };

  public removeRole = async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await roleService.removeRole(id);
    res.status(OK_STATUS).json({ message: "Role deleted successfully", result });
  };
}

export const roleController = new RoleController();
