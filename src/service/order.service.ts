import { Request } from 'express';
import { OrderInput, OrderItem, OrderItemWithPrice, OrderToConfirm } from '../dto/order.input.dto';
import { ConfirmedOrder } from '../dto/order.response.dto';
import { ItemService } from './item.service';

export class OrderService {
  constructor(private itemService: ItemService) {
    itemService = new ItemService();
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

  private evaluateOrder(orders: OrderToConfirm[]): boolean {
    const rejectedOrders = orders.filter(order => !order.confirm);
    return rejectedOrders.length > 0;
  }

  async submitOrder(req: Request): Promise<ConfirmedOrder> {
    const request: unknown = req.body;
    const order = request as OrderInput;

    // check stocks available
    const consolidatedOrders = await this.consolidateOrder(order.items);
    const hasRejectedOrders = this.evaluateOrder(consolidatedOrders);

    if (hasRejectedOrders) {
      return {
        orderId: 'id',
        status: 'REJECTED',
        reason: 'ORDER_TOTAL_TOO_HIGH'
      };
    }

    // compute total
    const computedTotal = await this.computeTotalPrice(order.items);
    console.info(computedTotal);

    return {
      orderId: 'test',
      status: "CONFIRMED",
      total: computedTotal,
    };
  }
}