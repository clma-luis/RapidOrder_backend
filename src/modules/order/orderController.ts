// order/orderController.ts
import { Request, Response } from "express";
import { OrderService } from "./orderService";

export class OrderController {
  private orderService: OrderService;

  constructor(orderService: OrderService) {
    this.orderService = orderService;
  }

  public createOrder(req: Request, res: Response) {
    const orderData = req.body;
    const result = this.orderService.createOrder(orderData);

    res.json(result);
  }

  public getOrderStatus(req: Request, res: Response): void {
    const orderId = req.params.orderId;

    res.json({ status: "ok" });
  }
}
