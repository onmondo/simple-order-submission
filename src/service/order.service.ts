import { Request } from 'express';
import { OrderInput, OrderItem, OrderItemWithPrice } from '../dto/order.input.dto';
import { ConfirmedOrder } from '../dto/order.response.dto';
import { ItemService } from './item.service';

export class OrderService {
  constructor(private itemService: ItemService) {
    itemService = new ItemService();
  }
  async computeTotalPrice(items: OrderItem[]): Promise<number> {
    const processUnitPriceRetrieval = items.map(item => this.itemService.getById(item.id));

    const response = await Promise.all(processUnitPriceRetrieval);
    console.log(response);
    const itemsWithUnitPrice = response as OrderItemWithPrice[];

    const completeOrderedItems = itemsWithUnitPrice.map(item => {
      const matchedItem = items.find(item => item.id === item.id);

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

  async submitOrder(req: Request): Promise<ConfirmedOrder> {
    const request: unknown = req.body;
    const order = request as OrderInput;


    // compute total
    const computedTotal = await this.computeTotalPrice(order.items);
    console.info(computedTotal);
    // return {
    //   orderId: 'id',
    //   status: 'REJECTED',
    //   reason: 'ORDER_TOTAL_TOO_HIGH'
    // };

    return {
      orderId: 'test',
      status: "CONFIRMED",
      total: computedTotal,
    };
  }
}