import { Router } from "express";
import { roleController } from "./roleController";

const router = Router();
const { createRole, getAllRoles, getOneRole, updateRole, removeRole } = roleController;

router.post("/create", createRole);
router.get("/getAll", getAllRoles);
router.get("/getOne/:id", getOneRole);
router.put("/updateOne/:id", updateRole);
router.put("/removeOne/:id", removeRole);

export default router;
