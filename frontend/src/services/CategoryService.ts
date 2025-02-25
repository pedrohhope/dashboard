import { Category, GetCategoriesResponse } from "../types/categories";
import { api, Response } from "./api";

class CategoryService {
    async get() {
        const response = await api.get<Response<GetCategoriesResponse>>('/category');
        return response.data;
    }

    async create(name: string) {
        const response = await api.post<Response<Category>>('/category', {
            name
        });
        return response.data;
    }

    async remove(id: string) {
        const response = await api.delete<Response<Category>>(`/category/${id}`);
        return response.data;
    }

    async update(id: string, name: string) {
        const response = await api.patch<Response<Category>>(`/category/${id}`, {
            name
        });
        return response.data;
    }
}

export const categoryService = new CategoryService();