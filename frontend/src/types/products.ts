

export interface GetProductsDto {
    page: number;
    limit: number;
    search?: string;
}

export interface GetProductsResponse {
    products: Product[];
    count: number;
}

export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    categories: {
        _id: string;
        name: string;
    };
    imageUrl: string;
}


export interface CreateProductDto {
    name: string;
    description: string;
    price: number;
    categoryIds: string[];
}
