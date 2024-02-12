import { Request, Response } from "express";
import { KITCHEN_ROOM, NEW_ORDER } from "../../sockets/config";
import { validateOrderToDeliver } from "./orderMiddelwares";
import { orderService } from "./orderService";

export class OrderController {
  constructor() {}

  public async createOrder(req: Request, res: Response): Promise<any> {
    const data = req.body;
    const io = req.app.get("io");
    try {
      const result = await orderService.createOrder(data);
      io.to(KITCHEN_ROOM).emit(NEW_ORDER, { message: "New order created", result });
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error to create Order, tray again" });
    }
  }

  public async getAllOrdersByUserId(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    try {
      const result = await orderService.getAllOrdersByUserId(id);
      res.status(200).json({ message: "orders founds successfully", result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error to find orders by waiter ID - try later" });
    }
  }

  public async updateOrder(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    const data = req.body;

    try {
      const result = await orderService.updateOrder(id, data);
      res.status(200).json({ message: "order updated successfully", result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error updated order - try later" });
    }
  }

  public async updateStatusOrderItems(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    const { orderItemsAdapted } = req.body;

    try {
      const result = await orderService.updateOrderStatus(id, orderItemsAdapted);

      result && validateOrderToDeliver(result, req);

      res.status(200).json({ message: "order status updated successfully", result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error updated status order - try later" });
    }
  }
}
