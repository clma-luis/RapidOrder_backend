import express from "express";
import { ADMIN_ROLE } from "../../shared/constants/roles";
import { validateFields, validateObjectId, validateRole, validateToken } from "../../shared/middlewares/general";
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
router.get("/getUsers", validateToken, validateRole([ADMIN_ROLE]), getAllUsers);
router.get("/getUser/:id", validateObjectId("id"), validateToken, validateRole([ADMIN_ROLE]), validateExistUserFromIdParams, getOneUser);
router.put("/updateUser", validateToken, validateDataToUpdate, validateFields, updateUser);
router.post(
  "/removeUser/:id",
  validateObjectId("id"),
  validateToken,
  validateExistUserFromIdParams,
  validateRole([ADMIN_ROLE]),
  removeUser
);
router.post("/changePassword", validateToken, validatePasswordData, validateFields, validateIsDiferentPassword, changeUserPassword);
router.post("/changeEmail", validateToken, validateEmailData, validateFields, validateEmailWithDataBase, validateNewEmail, changeUserEmail);

export default router;
