import { Request, Response } from "express";
import { userService } from "./userService";

export class UserController {
  constructor() {}

  async createUser(req: Request, res: Response) {
    const result = await userService.createUser(req.body);
    res.status(201).json({ message: "User created successfully", result });
  }

  async getAllUsers(req: Request, res: Response) {
    const { page, size } = req.query;

    const [result, total] = await Promise.all([
      userService.getAllUsers({ page: Number(page), size: Number(size) }),
      userService.getTotalUsers(),
    ]);

    res.status(200).json({ message: "users found", result, total, page, size });
  }

  async getOneUser(req: Request, res: Response) {
    const { id } = req.params;
    const result = await userService.getOneUser(id);
    res.status(200).json({ message: "user found", result });
  }

  async updateUser(req: Request, res: Response) {
    const { _id, __v, email, password, deleted, ...rest } = req.body;
    const { id } = req.body.user;

    try {
      const result = await userService.updateUser(id, rest);
      res.status(200).json({ message: "updated successfully", result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while updating the user" });
    }
  }

  async changeUserPassword(req: Request, res: Response) {
    const { id } = req.body.user;
    const { newPassword } = req.body;

    try {
      const result = await userService.changeUserPassword(id, newPassword);
      res.status(200).json({ message: "password updated successfully", result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while updating user's password " });
    }
  }

  async changeUserEmail(req: Request, res: Response) {
    const { id } = req.body.user;
    const { newEmail } = req.body;

    const result = await userService.changeUserEmail(id, newEmail);
    res.status(200).json({ message: "email updated successfully", result });
  }

  async removeUser(req: Request, res: Response) {
    const { id } = req.params;
    const { user } = req.body;

    const result = await userService.removeUser(id);
    res.status(200).json({ message: result, user });
  }
}
