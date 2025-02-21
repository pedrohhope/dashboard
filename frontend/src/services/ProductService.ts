import { GetProductsDto, GetProductsResponse } from "../types/products";
import { api, Response } from "./api";

class ProductService {

    async get(params: GetProductsDto): Promise<Response<GetProductsResponse>> {
        const response = await api.get<Response<GetProductsResponse>>('/product', {
            params
        });
        return response.data;
    }


}

export const productService = new ProductService();