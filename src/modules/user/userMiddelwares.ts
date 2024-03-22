// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require("bcrypt");
import { NextFunction, Request, Response } from "express";
import { body } from "express-validator";

import { LETTER_PATTERN, NUMBER_PATTERN, SPECIAL_CHARACTERS_PATTERN } from "../../shared/constants/regex";
import RoleModel from "../role/roleModel";
import UserModel from "./userModel";
import { BAD_REQUEST_STATUS, INTERNAL_SERVER_ERROR_STATUS, NOT_FOUND } from "../../shared/constants/statusHTTP";

export const validatePasswordData = [
  body("password", "Field password is required and string")
    .optional()
    .custom((value) => validatePasswordConditions(value)),
  body("newPassword", "Field password is required and string")
    .optional()
    .custom((value) => validatePasswordConditions(value)),
];

const validatePasswordConditions = (value: string) => {
  if (!value) throw new Error("The password is required");
  const errors: string[] = [];

  checkLength(value, 6, 10, "Password must be between 6 and 10 characters", errors);
  checkPattern(value, LETTER_PATTERN, "Password must contain at least one letter", errors);
  checkPattern(value, SPECIAL_CHARACTERS_PATTERN, "Password must contain at least one special character", errors);
  checkPattern(value, NUMBER_PATTERN, "Password must contain at least one number", errors);

  if (errors.length > 0) throw new Error(errors.join(", "));

  return true;
};

const validateRoleUser = async (value: string) => {
  if (!value) throw new Error("The role is required");

  const existModel = await RoleModel.findOne({ role: value });

  if (!existModel) throw new Error("The role does not exist in the database");

  return true;
};

export const validateExistUserFromIdParams = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const user = await UserModel.findById(id);

  if (!user || !!user.deleted) {
    return res.status(NOT_FOUND).json({ message: "the user does not exist" });
  }

  req.body.userFromParamsId = user;

  next();
};

export const hashPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    req.body.password = hashedPassword;

    next();
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR_STATUS).json({ message: "Internal server error: password not hashed" });
  }
};

export const validateIsDiferentPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { password, newPassword } = req.body;

  if (password === newPassword) {
    return res.status(BAD_REQUEST_STATUS).json({ message: "The new password must be different from the old password" });
  }

  next();
};

export const validateEmailWithDataBase = async (req: Request, res: Response, next: NextFunction) => {
  const { email, userFromParamsId } = req.body;

  if (userFromParamsId && email !== userFromParamsId?.email) {
    return res.status(BAD_REQUEST_STATUS).json({ message: "The email is different from data base email" });
  }

  const existEmail = await compareEmailWithDB(email);
  if (existEmail) return res.status(BAD_REQUEST_STATUS).json({ message: "New email already exists in the database" });

  next();
};

export const validateNewEmail = async (req: Request, res: Response, next: NextFunction) => {
  const { email, newEmail, user } = req.body;

  if (user.email !== email) return res.status(BAD_REQUEST_STATUS).json({ message: "The email is different from data base email" });

  if (email === newEmail) {
    return res.status(BAD_REQUEST_STATUS).json({ message: "The new email must be different from the old email" });
  }

  const existEmail = await compareEmailWithDB(newEmail);

  if (existEmail) return res.status(BAD_REQUEST_STATUS).json({ message: "New email already exists in the database" });

  next();
};

const compareEmailWithDB = async (email: string) => {
  const user = await UserModel.findOne({ email }).exec();

  return user;
};

//=================================
//======Functions to password======
//=================================

const checkLength = (value: string, min: number, max: number, errorMessage: string, errors: string[]) => {
  if (value.length < min || value.length > max) {
    errors.push(errorMessage);
  }
};

const checkPattern = (value: string, pattern: RegExp, errorMessage: string, errors: string[]) => {
  if (!pattern.test(value)) {
    errors.push(errorMessage);
  }
};

export const validateUserBody = [
  body("name", "Field name is required and string").not().isEmpty().isString(),
  body("image", "Field image is string").optional().isString(),
  body("email", "Field email is required and must be available format").not().isEmpty().isEmail(),
  body("password", "Field password is required and string").custom((value) => validatePasswordConditions(value)),
  body("role").custom((value) => validateRoleUser(value)),
];

export const validateDataToUpdate = [
  body("name", "Field name is required and string").optional().isString(),
  body("image", "Field image is string").optional().isString(),
  body("role")
    .optional()
    .custom((value) => validateRoleUser(value)),
];

export const validateEmailData = [
  body("email", "Field email is required and must be available format").not().isEmpty().isEmail(),
  body("newEmail", "Field email is required and must be available format").not().isEmpty().isEmail(),
];
