import express from "express";
import { UserController } from "./userController";
import { validateAdminRole, validateFields, validateToken } from "../../shared/middlewares/general";
import {
  hashPassword,
  validateDataToUpdate,
  validateEmail,
  validateEmailData,
  validateIsDiferentPassword,
  validateNewEmail,
  validatePasswordData,
  validateUserBody,
  validateUserId,
} from "./userMiddelwares";

const router = express.Router();

const userController = new UserController();

const { createUser, getAllUsers, getOneUser, updateUser, changeUserPassword, changeUserEmail, removeUser } = userController;

router.post("/create", validateUserBody, validateFields, validateEmail, hashPassword, createUser);
router.get("/getAllUsers", getAllUsers);
router.get("/user/:id", validateUserId, getOneUser);
router.put("/updateUser/:id", validateUserId, validateDataToUpdate, validateFields, updateUser);
router.post("/removeUser/:id", validateToken, validateUserId, validateAdminRole, removeUser);
router.post("/changePassword/:id", validateUserId, validatePasswordData, validateFields, validateIsDiferentPassword, changeUserPassword);
router.post("/changeEmail/:id", validateEmailData, validateFields, validateUserId, validateEmail, validateNewEmail, changeUserEmail);

export default router;
