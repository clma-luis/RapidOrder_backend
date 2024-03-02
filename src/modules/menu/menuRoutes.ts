import { Router } from "express";
import { replaceImageInCloudinary, uploadImageInCloudinary } from "../../shared/middlewares/fileMiddelwares";
import { validateRole, validateFields, validateObjectId, validateToken } from "../../shared/middlewares/general";
import { MenuController } from "./menuController";
import { validateChangeStatus, validateExistMenu, validateMenuItemBody, validateUpdateMenuItemBody } from "./menuMiddelwares";
import { MenuService } from "./menuService";
import { ADMIN_ROLE } from "../../shared/constants/roles";

const router = Router();

const menuService = new MenuService();
const menuController = new MenuController(menuService);
const { createMenuItem, getAllMenuItems, getOneMenuItem, updateMenuItem, changeMenuStatus, removeMenuItem } = menuController;

router.post(
  "/createItem",
  validateToken,
  validateRole([ADMIN_ROLE]),
  validateMenuItemBody,
  validateFields,
  uploadImageInCloudinary,
  createMenuItem
);
router.get("/getAllItems", getAllMenuItems);
router.get("/getOneItem/:id", validateObjectId("id"), getOneMenuItem);
router.put(
  "/updateItem/:id",
  validateObjectId("id"),
  validateToken,
  validateRole([ADMIN_ROLE]),
  validateExistMenu,
  validateUpdateMenuItemBody,
  validateFields,
  replaceImageInCloudinary,
  updateMenuItem
);
router.put("/removeItem/:id", validateToken, validateRole([ADMIN_ROLE]), validateObjectId("id"), validateExistMenu, removeMenuItem);
router.put("/changeStatus/:id", validateObjectId("id"), validateExistMenu, validateChangeStatus, validateFields, changeMenuStatus);

export default router;
