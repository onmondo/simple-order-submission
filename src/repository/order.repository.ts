import { OrderInput } from "../dto/order.input.dto";

const baseUrl = 'http://localhost:3001/orders';
export class OrderRepository {
  async getAll() {
    const response = await fetch(baseUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch order by id');
    }
    const data: unknown = await response.json();

    return data;
  }

  async getById(id: string) {
    const response = await fetch(`${baseUrl}/${id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch order by id');
    }
    const data: unknown = await response.json();

    return data;
  }

  async createOrder(order: OrderInput) {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    })

    if (!response.ok) {
      throw new Error('Failed to post new order');
    }

    const data: unknown = await response.json()

    return data;
  }

  async orderExpired(id: string) {
    const response = await fetch(`${baseUrl}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ expired: true })
    })

    if (!response.ok) {
      throw new Error('Failed to post new order');
    }

    const data: unknown = await response.json()

    return data;
  }
}