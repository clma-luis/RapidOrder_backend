const jwt = require("jsonwebtoken");
import { NextFunction, Request, Response } from "express";
import { check, validationResult } from "express-validator";
import { isValidObjectId } from "mongoose";
import UserModel from "../../modules/user/userModel";
import { JWT_SECRET } from "../config/config";
import { BAD_REQUEST_STATUS, INTERNAL_SERVER_ERROR_STATUS } from "../constants/statusHTTP";

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

    return res.status(BAD_REQUEST_STATUS).json({ errors: result });
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
    req.body.tokenRole = payload.role;

    next();
  } catch (error) {
    console.error(error);
    return res.status(BAD_REQUEST_STATUS).json({ message: "Invalid Token", error });
  }
};

export const validateRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { user, tokenRole } = req.body;

    if (!user) {
      return res.status(INTERNAL_SERVER_ERROR_STATUS).json({ message: "we have an error, please try again" });
    }

    if (!roles.includes(tokenRole)) {
      return res.status(BAD_REQUEST_STATUS).json({ message: "unauthorized - invalid role" });
    }

    delete req.body.tokenRole;
    next();
  };
};
