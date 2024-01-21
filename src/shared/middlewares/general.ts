import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import UserModel from "../../modules/user/userModel";

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

export const validateEmail = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  const existEmail = await UserModel.findOne({ email }).exec();

  if (existEmail) {
    return res.status(400).json({ errors: "Email already exists" });
  }

  next();
};
