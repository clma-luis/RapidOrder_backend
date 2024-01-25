const bcrypt = require("bcrypt");
import { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import UserModel from "../user/userModel";

export const validateLoginBody = [
  body("email", "Field email is required and must be available format").notEmpty().isEmail(),
  body("password", "Field password is required").notEmpty(),
];

export const validateLoginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email }).exec();
  const passwordMatch = await comparePasswords(req.body.password, user?.password as string);

  if (!user) {
    return res.status(400).json({ message: "The email does not exist" });
  } else if (!!user?.deleted) {
    return res.status(400).json({ message: "user deleted" });
  } else if (!passwordMatch) {
    return res.status(400).json({ message: "The password is incorrect" });
  }

  next();
};

const comparePasswords = async (password: string, passwordHash: string) => {
  if (!passwordHash || !password) return false;
  return bcrypt.compareSync(password, passwordHash);
};
