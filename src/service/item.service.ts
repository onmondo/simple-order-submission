const baseUrl = 'http://localhost:3001/items';

export class ItemService {
  async getById(id: string) {
    const response = await fetch(`${baseUrl}/${id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch item by id');
    }
    const data: unknown = await response.json();

    return data;
  }
}