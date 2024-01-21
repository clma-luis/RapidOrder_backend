import { Router } from "express";
import { validateDishId, validateMenuItemBody } from "./menuMiddelwares";
import { MenuController } from "./menuController";
import { MenuService } from "./menuService";
import { validateFields } from "../../shared/middlewares/general";

const router = Router();

const menuService = new MenuService();
const menuController = new MenuController(menuService);
const { createMenuItem, getAllMenuItems, getOneMenuItem, updateMenuItem, removeMenuItem } = menuController;

router.post("/createItem", validateMenuItemBody, validateFields, createMenuItem);
router.get("/getAllItems", getAllMenuItems);
router.get("/getOneItem/:id", validateDishId, getOneMenuItem);
router.put("/updateItem/:id", validateDishId, validateMenuItemBody, validateFields, updateMenuItem);
router.put("/removeItem/:id", validateDishId, removeMenuItem);

export default router;
