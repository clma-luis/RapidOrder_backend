import express from "express";
import { UserController } from "./userController";

const router = express.Router();

const userController = new UserController();

const { createUser, getAllUsers, getOneUser, updateUser, removeUser } = userController;

router.post("/create", createUser);
router.post("/getAllUsers", getAllUsers);
router.post("/user/:id", getOneUser);
router.post("/updateUser/:id", updateUser);
router.post("/removeUser/:id", removeUser);

export default router;
