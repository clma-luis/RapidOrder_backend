import { Router } from "express";
import { SeedController } from "./seedController";

const router = Router();

const seedController = new SeedController();
const { executeMenuSeed } = seedController;

router.get("/executeMenu", executeMenuSeed);

export default router;
