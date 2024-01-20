// order/orderController.ts
import { Request, Response } from "express";
import { orderService } from "./orderService";

class OrderController {
  constructor() {}

  public createOrder(req: Request, res: Response) {
    const orderData = req.body;
    console.log("Order Datadsd:", orderData); // Agrega un log para verificar los datos
    const result = orderService.createOrder(orderData);
    console.log("Result:", result);
    res.json(result);
  }

  public getOrderStatus(req: Request, res: Response): void {
    const orderId = req.params.orderId;
    //  const status = this.orderService.getOrderStatus(orderId);
    res.json({ status: "ok" });
  }
}

export default OrderController;
