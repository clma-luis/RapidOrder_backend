const bcrypt = require("bcrypt");
import { Request, Response } from "express";
import MenuModel from "../menu/menuModel";
import { MenuService } from "../menu/menuService";
import RoleModel from "../role/roleModel";
import UserModel from "../user/userModel";
import { menuSeedData } from "./seedData/menuSeedData";
import { roleSeedData } from "./seedData/roleSeedData";
import { usersSeedData } from "./seedData/userSeedData";

const menuService = new MenuService();

export class SeedController {
  constructor() {}

  public executeMenuSeed = async (req: Request, res: Response): Promise<void> => {
    try {
      await MenuModel.insertMany(menuSeedData);

      res.status(201).json({ message: "Menu seeded successfully" });
    } catch (error) {
      console.error("Error seeding menu:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  public executeRoleSeed = async (req: Request, res: Response): Promise<void> => {
    try {
      await RoleModel.insertMany(roleSeedData);

      res.status(201).json({ message: "Roles seeded successfully" });
    } catch (error) {
      console.error("Error seeding roles:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  public executeUserSeed = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await Promise.all(
        usersSeedData.map(async (user) => {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(user.password, salt);
          user.password = hashedPassword;

          return user;
        })
      );
      await UserModel.insertMany(users);
      res.status(201).json({ message: "Users seeded successfully" });
    } catch (error) {
      console.error("Error seeding users:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}
