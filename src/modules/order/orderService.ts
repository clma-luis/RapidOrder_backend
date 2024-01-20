export class OrderService {
  constructor() {}

  public createOrder(orderData: any): any {
    return orderData;
  }

  public getOrderStatus(orderId: string): any {
    return orderId;
  }
}

export const orderService = new OrderService();
