import { Request, Response, NextFunction, Router } from 'express';
import { OrderService } from '../service/order.service';
import { OrderInput } from '../dto/order.input.dto';
import { ItemService } from '../repository/item.repository';
import { OrderRepository } from '../repository/order.repository';
const orderRouter = Router();

const service = new OrderService(new ItemService(), new OrderRepository());

const validateOrder = (req: Request, res: Response, next: NextFunction) => {
  const request: unknown = req.body;
  const order = request as OrderInput;

  // validate
  if (!order || !order.items || order.items.length === 0) {
    res.status(400).json({
      message: 'At least one item must be provided'
    });
  }

  if (!order || !order.customer || !order.customer.email || !order.customer.name) {
    res.status(400).json({
      message: 'Customer name and email are required'
    });
  }

  next();
};

orderRouter.post('/', validateOrder, async (req: Request, res: Response) => {
  try {
    const response = await service.submitOrder(req);
    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }

});

export default orderRouter;
