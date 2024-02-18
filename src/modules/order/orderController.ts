import { Request, Response } from "express";
import { CREATED_STATUS, INTERNAL_SERVER_ERROR_STATUS, OK_STATUS } from "../../shared/constants/statusHTTP";
import { KITCHEN_ROOM, NEW_ORDER } from "../../sockets/config";
import { validateOrderToDeliver } from "./orderMiddelwares";
import { orderService } from "./orderService";
import { CreateOrderData, orderHistoryController } from "../orderHistory/orderHistoryController";
import { OrderProps } from "./orderModel";

export class OrderController {
  constructor() {}

  public async createOrder(req: Request, res: Response): Promise<any> {
    const data = req.body;
    const io = req.app.get("io");
    try {
      const result = await orderService.createOrder(data);
      result && orderHistoryController.createOrderHistory(result as CreateOrderData, data as OrderProps);

      io.to(KITCHEN_ROOM).emit(NEW_ORDER, { message: "New order created", result });
      res.status(CREATED_STATUS).json({ message: "order created successfully", result });
    } catch (error) {
      console.error(error);
      res.status(INTERNAL_SERVER_ERROR_STATUS).json({ error: "Internal server error to create Order, tray again" });
    }
  }

  public async getAllOrdersByUserId(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    try {
      const result = await orderService.getAllOrdersByUserId(id);
      res.status(OK_STATUS).json({ message: "orders founds successfully", result });
    } catch (error) {
      console.error(error);
      res.status(INTERNAL_SERVER_ERROR_STATUS).json({ error: "Internal server error to find orders by waiter ID - try later" });
    }
  }

  public async updateStatusOrderItems(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    const { orderItems, orderItemsAdapted } = req.body;

    try {
      const result = await orderService.updateOrderItemsStatus(id, orderItemsAdapted);
      result && orderHistoryController.updateStatusOrderItems(result as CreateOrderData, orderItems);

      result && validateOrderToDeliver(result, req);

      res.status(OK_STATUS).json({ message: "order status updated successfully", result });
    } catch (error) {
      console.error(error);
      res.status(INTERNAL_SERVER_ERROR_STATUS).json({ error: "Internal server error updated status order - try later" });
    }
  }

  public async updateOrderStatus(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    const { status, closedBy } = req.body;

    try {
      const result = await orderService.updateOrderStatus(id, status, closedBy);
      res.status(OK_STATUS).json({ message: "order status updated successfully", result });
    } catch (error) {
      res.status(INTERNAL_SERVER_ERROR_STATUS).json({ error: "Internal server error updated status order - try later" });
    }
  }

  public async updateOrderTable(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    const { table } = req.body;

    try {
      const result = await orderService.updateOrderTable(id, table);
      res.status(OK_STATUS).json({ message: "order table updated successfully", result });
    } catch (error) {
      console.error(error);
      res.status(INTERNAL_SERVER_ERROR_STATUS).json({ error: "Internal server error updated the table's order - try later" });
    }
  }

  public async addAdditionalOrders(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    const { orderItemsAdapted } = req.body;
    try {
      const result = await orderService.addAdditionalOrders(id, orderItemsAdapted);
      res.status(OK_STATUS).json({ message: "new order added to the list successfully", result });
    } catch (error) {
      console.error(error);
      res.status(INTERNAL_SERVER_ERROR_STATUS).json({ error: "Internal server error updated the table's order - try later" });
    }
  }
}
