import express from "express";
import { authController } from "./authController";
import { validateFields } from "../../shared/middlewares/general";
import { validateLoginBody, validateLoginUser } from "./authMiddelware";

const router = express.Router();

const { loginController } = authController;

router.post("/login", validateLoginBody, validateFields, validateLoginUser, loginController);
router.post("/createaurth", (req, res) => {});
router.get("/", (req, res) => {});
router.get("/", (req, res) => {});

export default router;
