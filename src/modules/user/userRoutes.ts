import express from "express";
import { UserController } from "./userController";
import { validateEmail, validateFields } from "../../shared/middlewares/general";
import { hashPassword, validateUserBody, validateUserId } from "./userMiddelwares";

const router = express.Router();

const userController = new UserController();

const { createUser, getAllUsers, getOneUser, updateUser, removeUser } = userController;

router.post("/create", validateUserBody, validateFields, validateEmail, hashPassword, createUser);
router.post("/getAllUsers", getAllUsers);
router.post("/user/:id", validateUserId, getOneUser);
router.post("/updateUser/:id", validateUserId, updateUser);
router.post("/removeUser/:id", validateUserId, removeUser);

export default router;
