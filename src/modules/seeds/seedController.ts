import { Request, Response } from "express";
import { MenuService } from "../menu/menuService";
import { menuSeedData } from "./seedData/menuSeedData";
import { MenuItemSchema } from "../menu/menuModel";
import { roleService } from "../role/roleService";
import { RoleSchema } from "../role/roleModel";
import { roleSeedData } from "./seedData/roleSeedData";

const menuService = new MenuService();

export class SeedController {
  constructor() {}

  public executeMenuSeed = async (req: Request, res: Response): Promise<void> => {
    try {
      await Promise.all(
        menuSeedData.map(async (menuItem) => {
          await menuService.addMenuItem(menuItem as MenuItemSchema);
        })
      );

      res.status(201).json({ message: "Menu seeded successfully" });
    } catch (error) {
      console.error("Error seeding menu:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  public executeRoleSeed = async (req: Request, res: Response): Promise<void> => {
    try {
      await Promise.all(
        roleSeedData.map(async (role) => {
          await roleService.addRole(role as RoleSchema);
        })
      );

      res.status(201).json({ message: "Roles seeded successfully" });
    } catch (error) {
      console.error("Error seeding roles:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}
