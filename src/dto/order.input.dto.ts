export type OrderItem = {
  id: string,
  quantity: number
};

export type ItemDetails = {
  name: string
  description: string
  unitPrice: number
  stocks: number
};

export type OrderItemWithPrice = OrderItem & ItemDetails;

export type OrderToConfirm = OrderItemWithPrice & { confirm: boolean }

export interface OrderInput {
  id?: string,
  items: OrderItem[],
  customer: {
    name: string,
    email: string
  }
}
