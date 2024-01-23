const bcrypt = require("bcrypt");
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { body } from "express-validator";

import UserModel from "./userModel";
import { LETTER_PATTERN, NUMBER_PATTERN, SPECIAL_CHARACTERS_PATTERN } from "../../shared/constants/regex";
import RoleModel from "../role/roleModel";

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
  body("newEmail", "Field email is required and must be available format")
    .not()
    .isEmpty()
    .isEmail()
    .custom((value) => {}),
];

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

export const validateUserId = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const isValidId = mongoose.isValidObjectId(id);
  if (!isValidId) {
    return res.status(400).json({ message: "the id is not valid" });
  }

  const existId = await UserModel.findById(id);

  if (!existId) {
    return res.status(404).json({ message: "the id does not exist" });
  }

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
    console.error(error);
    res.status(500).json({ message: "Internal server error: password not hashed" });
  }
};

export const validateIsDiferentPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { password, newPassword } = req.body;

  if (password === newPassword) {
    return res.status(400).json({ message: "The new password must be different from the old password" });
  }

  next();
};

export const validateEmail = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  compareEmailWithDB(email, res);

  next();
};

export const validateNewEmail = async (req: Request, res: Response, next: NextFunction) => {
  const { email, newEmail } = req.body;

  if (email === newEmail) {
    return res.status(400).json({ message: "The new email must be different from the old email" });
  }

  compareEmailWithDB(newEmail, res, "New email already exists in the database");

  next();
};

const compareEmailWithDB = async (email: string, res: Response, errorMessage: string = "Email does not exist in the database") => {
  const existEmail = await UserModel.findOne({ email }).exec();

  if (existEmail) {
    return res.status(400).json({ errors: errorMessage });
  }
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
