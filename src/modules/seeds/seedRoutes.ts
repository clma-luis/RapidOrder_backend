import { Router } from "express";
import { SeedController } from "./seedController";

const router = Router();

const seedController = new SeedController();
const { executeMenuSeed, executeRoleSeed } = seedController;

router.get("/executeMenu", executeMenuSeed);
router.get("/executeRoles", executeRoleSeed);

export default router;
