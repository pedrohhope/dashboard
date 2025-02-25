export interface Order {
    _id: string;
    date: Date;
    productIds: string[]
    total: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface UpdateOrderDto {
    productIds: string[]
    date: Date
    total: number
}
export interface GetOrdersDto {
    page: number;
    limit: number;
    search?: string;
}

export interface CreateOrderDto {
    productIds: string[]
    date: Date
    total: number
}

export interface CreateOrderResponse {
    _id: string;
    productIds: string[]
    date: Date
    total: number
    createdAt: Date;
    updatedAt: Date;
}

export interface GetOrdersResponse {
    orders: Order[];
}