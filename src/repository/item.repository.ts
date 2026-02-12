const baseUrl = 'http://localhost:3001/items';

export class ItemRepository {
  async getById(id: string) {
    const response = await fetch(`${baseUrl}/${id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch item by id');
    }
    const data: unknown = await response.json();

    return data;
  }

  async updateStockById(id: string, currentStock: number) {
    const response = await fetch(`${baseUrl}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stocks: currentStock })
    })

    if (!response.ok) {
      throw new Error('Failed to update stocks by id');
    }

    const data: unknown = await response.json()

    return data;
  }

  async getAll() {
    const response = await fetch(baseUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch all items');
    }

    const data: unknown = await response.json()

    return data;
  }
}