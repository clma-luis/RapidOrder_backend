const bcrypt = require("bcrypt");
import { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import UserModel, { UserSchema } from "../user/userModel";
import { BAD_REQUEST_STATUS } from "../../shared/constants/statusHTTP";

export const validateLoginBody = [
  body("email", "Field email is required and must be available format").notEmpty().isEmail(),
  body("password", "Field password is required").notEmpty(),
];

export const validateLoginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  const user = await UserModel.findOne({ email }).exec();
  const passwordMatch = await comparePasswords(req.body.password, user?.password as string);

  if (!user) {
    return res.status(BAD_REQUEST_STATUS).json({ message: "The email does not exist" });
  } else if (!!user?.deleted) {
    return res.status(BAD_REQUEST_STATUS).json({ message: "user deleted" });
  } else if (!passwordMatch) {
    return res.status(BAD_REQUEST_STATUS).json({ message: "The password is incorrect" });
  }

  const userAdapter = userDataAdapter(user);
  req.body.user = userAdapter;
  next();
};

const comparePasswords = async (password: string, passwordHash: string) => {
  if (!passwordHash || !password) return false;
  return bcrypt.compareSync(password, passwordHash);
};

const userDataAdapter = (user: UserSchema) => {
  const { _id, image, name, email, role } = user;

  const result = {
    id: _id.toString(),
    image,
    name,
    email,
    role,
  };

  return result;
};
