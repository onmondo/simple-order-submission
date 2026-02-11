import { Request, Response, Router } from 'express';
import { OrderService } from '../service/order.service';
const orderRouter = Router();

const service = new OrderService();
orderRouter.post('/', (req: Request, res: Response) => {
  const response = service.submitOrder(req);
  res.status(200).json({ response });
});

export default orderRouter;
