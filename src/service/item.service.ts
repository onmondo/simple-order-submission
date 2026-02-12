import { Item } from '../dto/item.response.dto';
import { ItemRepository } from '../repository/item.repository';

export class ItemService {
  constructor(private itemRepo: ItemRepository) {
    itemRepo = new ItemRepository();
  }

  async getAllItems() {
    const response = await this.itemRepo.getAll()
    const items = response as Item[]
    return items
  }
}