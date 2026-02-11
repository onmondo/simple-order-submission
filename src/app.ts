import express from 'express';
import orderRouter from './controller/order.route';
import { unknownEndpoint } from './utils/middlewares';

const app = express();

app.use(express.json());
app.get('/', (_req, res) => {
  res.end('Health check...');
});
app.use('/api/order', orderRouter);
app.use(unknownEndpoint);

export default app;
