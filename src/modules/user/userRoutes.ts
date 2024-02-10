import express from "express";
import { validateAdminRole, validateFields, validateObjectId, validateToken } from "../../shared/middlewares/general";
import { UserController } from "./userController";
import {
  hashPassword,
  validateDataToUpdate,
  validateEmailData,
  validateEmailWithDataBase,
  validateExistUserFromIdParams,
  validateIsDiferentPassword,
  validateNewEmail,
  validatePasswordData,
  validateUserBody,
} from "./userMiddelwares";

const router = express.Router();

const userController = new UserController();

const { createUser, getAllUsers, getOneUser, updateUser, changeUserPassword, changeUserEmail, removeUser } = userController;

router.post("/create", validateUserBody, validateFields, validateEmailWithDataBase, hashPassword, createUser);
router.get("/getUsers", /*  validateToken, validateAdminRole, */ getAllUsers);
router.get("/getUser/:id", validateObjectId("id"), validateToken, validateAdminRole, validateExistUserFromIdParams, getOneUser);
router.put("/updateUser", validateToken, validateDataToUpdate, validateFields, updateUser);
router.post("/removeUser/:id", validateObjectId("id"), validateToken, validateExistUserFromIdParams, validateAdminRole, removeUser);
router.post("/changePassword", validateToken, validatePasswordData, validateFields, validateIsDiferentPassword, changeUserPassword);
router.post("/changeEmail", validateToken, validateEmailData, validateFields, validateEmailWithDataBase, validateNewEmail, changeUserEmail);

export default router;
