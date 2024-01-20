class OrderServiceClass {
  constructor() {
    console.log("OrderService constructor called");
    // Asegúrate de que las instancias de otras clases, si las hay, se estén creando correctamente aquí
  }

  public createOrder(orderData: any): any {
    // Implementación de createOrder
    return orderData;
  }

  public getOrderStatus(orderId: string): any {
    // Implementación de getOrderStatus
    return orderId;
  }
}

export const orderService = new OrderServiceClass();
