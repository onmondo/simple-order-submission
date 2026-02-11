type OrderItem = {
  id: string,
  quantity: number
};

export interface OrderInput {
  items: OrderItem[],
  customer: {
    name: string,
    email: string
  }
}
