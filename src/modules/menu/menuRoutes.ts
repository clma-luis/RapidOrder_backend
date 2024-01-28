import { Router } from "express";
import { replaceImageInCloudinary, uploadImageInCloudinary } from "../../shared/middlewares/fileMiddelwares";
import { validateAdminRole, validateFields, validateObjectId, validateToken } from "../../shared/middlewares/general";
import { MenuController } from "./menuController";
import { validateChangeStatus, validateExistMenu, validateMenuItemBody, validateUpdateMenuItemBody } from "./menuMiddelwares";
import { MenuService } from "./menuService";

const router = Router();

const menuService = new MenuService();
const menuController = new MenuController(menuService);
const { createMenuItem, getAllMenuItems, getOneMenuItem, updateMenuItem, changeMenuStatus, removeMenuItem } = menuController;

router.post("/createItem", validateToken, validateAdminRole, validateMenuItemBody, validateFields, uploadImageInCloudinary, createMenuItem);
router.get("/getAllItems", getAllMenuItems);
router.get("/getOneItem/:id", validateObjectId("id"), getOneMenuItem);
router.put(
  "/updateItem/:id",
  validateObjectId("id"),
  validateToken,
  validateAdminRole,
  validateExistMenu,
  validateUpdateMenuItemBody,
  validateFields,
  replaceImageInCloudinary,
  updateMenuItem
);
router.put("/removeItem/:id", validateToken, validateAdminRole, validateObjectId("id"), validateExistMenu, removeMenuItem);
router.put("/changeStatus/:id", validateObjectId("id"), validateExistMenu, validateChangeStatus, validateFields, changeMenuStatus);

export default router;
