import { Request } from 'express';
import { OrderInput, OrderItem, OrderItemWithPrice, OrderToConfirm } from '../dto/order.input.dto';
import { ConfirmedOrder } from '../dto/order.response.dto';
import { ItemService } from '../repository/item.repository';
import { OrderRepository } from '../repository/order.repository';

export class OrderService {
  constructor(
    private itemService: ItemService,
    private orderRepo: OrderRepository
  ) {
    itemService = new ItemService();
    orderRepo = new OrderRepository();
  }

  async computeTotalPrice(items: OrderItem[]): Promise<number> {
    const processUnitPriceRetrieval = items.map(item => this.itemService.getById(item.id));

    const response = await Promise.all(processUnitPriceRetrieval);
    const itemsWithUnitPrice = response as OrderItemWithPrice[];

    const completeOrderedItems = itemsWithUnitPrice.map(item => {
      const matchedItem = items.find(orderedItem => orderedItem.id === item.id);

      return {
        ...item,
        quantity: matchedItem ? matchedItem.quantity : 0
      };
    });

    const totalPrice = completeOrderedItems.reduce((accumulator, item) => {
      const totalUnitPrice = item.unitPrice * item.quantity;
      accumulator = accumulator + totalUnitPrice;
      return accumulator;
    }, 0);

    return totalPrice;
  }

  private async consolidateOrder(items: OrderItem[]): Promise<OrderToConfirm[]> {
    const processStockRetrieval = items.map(item => this.itemService.getById(item.id));

    const response = await Promise.all(processStockRetrieval);
    const itemDetails = response as OrderItemWithPrice[];

    const orderedItemsToEvaluate = itemDetails.map(item => {
      const matchedItem = items.find(orderedItem => orderedItem.id === item.id);
      const quantity = matchedItem ? matchedItem.quantity : 0;

      return {
        ...item,
        quantity,
        confirm: (item.stocks >= quantity)
      };
    });

    return orderedItemsToEvaluate;
  }

  private evaluateOrder(orders: OrderToConfirm[]): { confirmed: OrderToConfirm[], rejected: OrderToConfirm[] } {
    const confirmedOrders = orders.filter(order => order.confirm);
    const rejectedOrders = orders.filter(order => !order.confirm);
    return {
      confirmed: confirmedOrders,
      rejected: rejectedOrders
    };
  }

  private async updateStock(items: OrderToConfirm[]): Promise<void> {
    const processStockRetrieval = items.map(item => {
      console.log('item', item);
      const computedStock = item.stocks - item.quantity;
      return this.itemService.updateStockById(item.id, computedStock)
    });
    await Promise.all(processStockRetrieval);
  }

  async submitOrder(req: Request): Promise<ConfirmedOrder> {
    const request: unknown = req.body;
    const newOrder = request as OrderInput;

    const allOrders = await this.orderRepo.getAll()
    const currentOrdersInQueue = allOrders as OrderInput[]
    if (currentOrdersInQueue && currentOrdersInQueue.length > Number(process.env.ORDER_THRESHOLD)) {
      return {
        orderId: 'id',
        status: 'REJECTED',
        reason: 'ORDER_TOTAL_TOO_HIGH'
      };
    }

    const foundOrder = currentOrdersInQueue.find(order => (order.customer.email === newOrder.customer.email ||
      order.customer.name === newOrder.customer.name) &&
      order.items.length === newOrder.items.length)
    if (foundOrder) {
      return {
        orderId: foundOrder.id || 'N/A',
        status: 'REJECTED',
        reason: 'ORDER_TOTAL_TOO_HIGH'
      };
    }

    // check stocks available
    const consolidatedOrders = await this.consolidateOrder(newOrder.items);
    const { confirmed, rejected } = this.evaluateOrder(consolidatedOrders);

    console.log('confirmed', confirmed)
    console.log('rejected', rejected)
    if (rejected.length > 0) {
      return {
        orderId: 'id',
        status: 'REJECTED',
        reason: 'ORDER_TOTAL_TOO_HIGH'
      };
    }

    const createdOrderRes = await this.orderRepo.createOrder(newOrder)
    const createdOrder = createdOrderRes as OrderInput
    await this.updateStock(confirmed)

    // compute total
    const computedTotal = await this.computeTotalPrice(newOrder.items);

    return {
      orderId: createdOrder.id || 'N/A',
      status: "CONFIRMED",
      total: computedTotal,
    };
  }
}