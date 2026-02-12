import { Request, Response, Router } from 'express';
import { ItemService } from '../service/item.service';
import { ItemRepository } from '../repository/item.repository';

const itemRouter = Router();

const service = new ItemService(new ItemRepository())
itemRouter.get('/', async (_req: Request, res: Response) => {
  const items = await service.getAllItems();
  res.status(200).json({
    data: items
  })
})

export default itemRouter;
