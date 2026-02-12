import express from 'express';
import cors from 'cors';
import orderRouter from './controller/order.route';
import { unknownEndpoint } from './utils/middlewares';
import itemRouter from './controller/item.route';

const app = express();

app.use(cors())
app.use(express.json());
app.get('/', (_req, res) => {
  res.end('Health check...');
});
app.use('/api/items', itemRouter)
app.use('/api/orders', orderRouter);
app.use(unknownEndpoint);

export default app;
