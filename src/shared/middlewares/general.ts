const jwt = require("jsonwebtoken");
import { NextFunction, Request, Response } from "express";
import { check, validationResult } from "express-validator";
import { JWT_SECRET } from "../constants/config";
import UserModel from "../../modules/user/userModel";
import { ADMIN_ROLE } from "../constants/roles";
import RoleModel from "../../modules/role/roleModel";
import { isValidObjectId } from "mongoose";

export const validateObjectId = (paramName: string) => {
  return check(paramName)
    .custom((value) => isValidObjectId(value))
    .withMessage("Invalid id from params");
};

export const validateFields = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorsFields = Object.keys(errors.mapped());
    const objectErrors: Record<string, any> = errors.mapped();
    const result = errorsFields.map((item) => ({ message: objectErrors[item].msg, field: item }));

    return res.status(400).json({ errors: result });
  }

  next();
};

export const validateToken = async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.headers;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    const user = await UserModel.findById(payload.userId).exec();

    if (!user) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    user.id = user._id;
    delete user._id;
    req.body.user = user;

    next();
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Invalid Token", error });
  }
};

export const validateAdminRole = async (req: Request, res: Response, next: NextFunction) => {
  const { user } = req.body;

  if (!user) {
    return res.status(500).json({ message: "we have an error, please try again" });
  }

  if (user.role !== ADMIN_ROLE) {
    return res.status(400).json({ message: "unauthorized - invalid role" });
  }

  next();
};
