import { Request, Response } from "express";
import { userService } from "./userService";

export class UserController {
  constructor() {}

  async createUser(req: Request, res: Response) {
    const result = await userService.creatreUser(req.body);
    res.status(201).json({ message: "User created successfully", result });
  }

  async getAllUsers(req: Request, res: Response) {
    const result = userService.getAllUsers();
    res.status(200).json({ message: "users found", result });
  }

  async getOneUser(req: Request, res: Response) {
    const { id } = req.params;
    const result = await userService.getOneUser(id);
    res.status(200).json({ message: "user found", result });
  }

  async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const result = await userService.updateUser(id, req.body);
    res.status(200).json({ message: "updated successfully", result });
  }

  async removeUser(req: Request, res: Response) {
    const { id } = req.params;
    const result = await userService.removeUser(id);
    res.status(200).json({ message: result });
  }
}
