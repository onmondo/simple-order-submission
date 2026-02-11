import { Request } from 'express';
import { OrderInput } from '../dto/order.input.dto';
import { ConfirmedOrder, IResponse } from '../dto/order.response.dto';

export class OrderService {
  submitOrder(req: Request): IResponse | ConfirmedOrder {
    const request: unknown = req.body;
    const order = request as OrderInput;

    // validate
    if (!order || !order.items || order.items.length === 0) {
      return {
        statusCode: 400,
        message: 'At least one item must be provided'
      };
    }

    if (!order || !order.customer || !order.customer.email || !order.customer.name) {
      return {
        statusCode: 400,
        message: 'Customer name and email are required'
      };
    }

    return {
      orderId: 'id',
      status: 'REJECTED',
      reason: 'ORDER_TOTAL_TOO_HIGH'
    };
  }
}