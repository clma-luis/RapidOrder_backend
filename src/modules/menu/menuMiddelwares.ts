import { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { IMAGE_EXTENSIONS } from "../../shared/constants/fileExtensions";
import { validateExistFile, validateFileExtension } from "../../shared/middlewares/fileMiddelwares";
import MenuModel from "./menuModel";
import { INTERNAL_SERVER_ERROR_STATUS } from "../../shared/constants/statusHTTP";

export const validateMenuItemBody = [
  body("name", "Field name is required and string").not().isEmpty().isString(),
  body("type", "Field type is required and string of: <entrada | principal | bebida | postre>")
    .not()
    .isEmpty()
    .isIn(["entrada", "principal", "bebida", "postre"]),
  body("image")
    .custom((_, { req }) => validateExistFile(req as Request, "image"))
    .custom((_, { req }) => validateFileExtension(req as Request, "image", IMAGE_EXTENSIONS)),
  body("description", "Field description is required and string").not().isEmpty().isString(),
  body("price", "Field price is required and number").not().isEmpty().isNumeric(),
  body("ingredients", "Field ingredients is string[] and required").isArray().not().isEmpty(),
  body("available", "Field available should be 0 or 1 number").optional().isIn([0, 1]),
  body("deleted", "Field deleted should be 0 or 1 number").optional().isIn([0, 1]),
];

export const validateUpdateMenuItemBody = [
  body("name", "Field name is  string").optional().notEmpty().isString(),
  body("type", "Field type is string of: <entrada | principal | bebida | postre>")
    .optional()
    .isIn(["entrada", "principal", "bebida", "postre"]),
  body("image")
    .custom((_, { req }) => validateExistFile(req as Request, "image"))
    .custom((_, { req }) => validateFileExtension(req as Request, "image", IMAGE_EXTENSIONS))
    .if(body("image").exists()),
  body("description", "Field description is string").optional().notEmpty().isString(),
  body("price", "Field price is number").optional().notEmpty().isNumeric(),
  body("ingredients", "Field ingredients is string[]").optional().isArray().notEmpty(),
];

export const validateChangeStatus = [body("available", "Field available should be 0 or 1 number").notEmpty().isIn([0, 1])];

export const validateExistMenu = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const menu = await MenuModel.findById(id);

    if (!menu) {
      return res.status(404).json({ message: "the id does not exist" });
    }

    req.body.menu = menu;

    next();
  } catch (error) {
    console.error(error);
    return res.status(INTERNAL_SERVER_ERROR_STATUS).json({ message: "Internal server error to find menu" });
  }
};
