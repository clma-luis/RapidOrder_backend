import { Request, Response } from "express";
import { userService } from "./userService";

export class UserController {
  constructor() {}

  public createUser(req: Request, res: Response) {
    const { password, ...rest } = req.body;

    const result = userService.creatreUser(req.body);
    res.status(201).json({ message: "created successfully", result });
  }

  public getAllUsers(req: Request, res: Response) {
    const result = userService.getAllUsers();
    res.status(200).json({ message: "users found", result });
  }

  public getOneUser(req: Request, res: Response) {
    const { id } = req.params;
    const result = userService.getOneUser(id);
    res.status(200).json({ message: "user found", result });
  }

  public updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const result = userService.updateUser(id, req.body);
    res.status(200).json({ message: "updated successfully", result });
  }

  public removeUser(req: Request, res: Response) {
    const { id } = req.params;
    const result = userService.removeUser(id);
    res.status(200).json({ message: result });
  }
}
