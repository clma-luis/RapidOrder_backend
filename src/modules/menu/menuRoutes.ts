import { Router } from "express";
import { validateFields, validateId, validateMenuItemBody } from "../../middlewares/validateFieldsMenu";
import { MenuController } from "./menuController";
import { MenuService } from "./menuService";

const router = Router();

const menuService = new MenuService();
const menuController = new MenuController(menuService);
const { createMenuItem, getAllMenuItems, getOneMenuItem, updateMenuItem, removeMenuItem } = menuController;

router.post("/createItem", validateMenuItemBody, validateFields, createMenuItem);
router.get("/getAllItems", getAllMenuItems);
router.get("/getOneItem/:id", validateId, getOneMenuItem);
router.put("/updateItem/:id", validateId, validateMenuItemBody, validateFields, updateMenuItem);
router.put("/removeItem/:id", validateId, removeMenuItem);

export default router;
