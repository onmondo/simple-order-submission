export type ConfirmedOrder = {
  orderId: string
  status: 'CONFIRMED' | 'REJECTED'
  total?: number
  reason?: string
};

export interface IResponse { message: string, statusCode: number }
