import { Router } from "express";
import { SeedController } from "./seedController";

const router = Router();

const seedController = new SeedController();
const { executeMenuSeed, executeRoleSeed, executeUserSeed } = seedController;

router.get("/executeMenu", executeMenuSeed);
router.get("/executeRoles", executeRoleSeed);
router.get("/executeUsers", executeUserSeed);

export default router;
