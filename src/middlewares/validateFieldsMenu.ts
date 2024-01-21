import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import mongoose from "mongoose";
import MenuModel from "../modules/menu/menuModel";

export const validateMenuItemBody = [
  body("name", "Field name is required and string").not().isEmpty().isString(),
  body("image", "Field image is required and string").not().isEmpty().isString(),
  body("description", "Field description is required and string").not().isEmpty().isString(),
  body("price", "Field price is required and number").not().isEmpty().isNumeric(),
  body("ingredients", "Field ingredients is string[] and required").isArray().not().isEmpty(),
  body("available", "Field available should be 0 or 1 number").optional().isIn([0, 1]),
  body("deleted", "Field deleted should be 0 or 1 number").optional().isIn([0, 1]),
];

export const validateFields = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.mapped() });
  }

  next();
};

export const validateId = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const isValidId = mongoose.isValidObjectId(id);
  if (!isValidId) {
    return res.status(400).json({ message: "the id is not valid" });
  }

  const existId = await MenuModel.findById(id);

  if (!existId) {
    return res.status(404).json({ message: "the id does not exist" });
  }

  next();
};
