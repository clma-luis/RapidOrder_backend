import { Router } from "express";
import { MenuService } from "./menuService";
import { MenuController } from "./menuController";
import { body, check } from "express-validator";

const router = Router();

const menuService = new MenuService();
const menuController = new MenuController(menuService);
const { addMenuItem, removeMenuItem, getAllMenuItems } = menuController;

const validateMenuItem = [
  body("name").notEmpty().isString(),
  body("image").notEmpty().isString(),
  body("description").notEmpty().isString(),
  body("price").notEmpty().isNumeric(),
  body("ingredients").isArray().notEmpty(),
  body("available").optional().isIn([0, 1]),
  body("deleted").optional().isIn([0, 1]),
];

router.post("/create", /* validateMenuItem, */ addMenuItem);
router.post("/remove", removeMenuItem);
router.get("/getAll", getAllMenuItems);

export default router;
