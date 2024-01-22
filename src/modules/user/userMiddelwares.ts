const bcrypt = require("bcrypt");
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { body } from "express-validator";

import UserModel from "./userModel";
import { LETTER_PATTERN, NUMBER_PATTERN, SPECIAL_CHARACTERS_PATTERN } from "../../shared/constants/regex";

export const validateUserBody = [
  body("name", "Field name is required and string").not().isEmpty().isString(),
  body("email", "Field email is required and must be available format").not().isEmpty().isEmail(),
  body("password", "Field password is required and string")
    .not()
    .isEmpty()
    .isString()
    .custom((value, { req }) => validatePasswordConditions(value)),
  body("role", "Field role is required and string").not().isEmpty().isString(),
  body("deleted", "Field deleted should be 0 or 1 number").optional().isIn([0, 1]),
];

const validatePasswordConditions = (value: string) => {
  const errors: string[] = [];

  checkLength(value, 6, 10, "Password must be between 6 and 10 characters", errors);
  checkPattern(value, LETTER_PATTERN, "Password must contain at least one letter", errors);
  checkPattern(value, SPECIAL_CHARACTERS_PATTERN, "Password must contain at least one special character", errors);
  checkPattern(value, NUMBER_PATTERN, "Password must contain at least one number", errors);

  if (errors.length > 0) throw new Error(errors.join(", "));

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
