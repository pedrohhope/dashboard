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

export interface GetOrdersMetricsResponse {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    ordersByPeriod: OrdersByPeriod;
}

export interface OrdersByPeriod {
    daily: Daily;
    weekly: Weekly;
    monthly: Monthly;
}

export interface Daily {
    [date: string]: number;
}

export interface Weekly {
    [week: string]: number;
}

export interface Monthly {
    [month: string]: number;
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